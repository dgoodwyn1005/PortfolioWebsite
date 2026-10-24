"""Run with python tests/browser-smoke.py; requires Playwright and Chromium.
Uses an isolated local Supabase fixture, never a real database or email provider.
"""
import json
import os
from pathlib import Path
import subprocess
import threading
import time
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from playwright.sync_api import sync_playwright

class Fixture(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        from urllib.parse import urlparse, parse_qs
        path = urlparse(self.path)
        query = parse_qs(path.query)
        rows = []
        if path.path.endswith('/companies'):
            slug = query.get('slug', ['eq.wyntech'])[0].removeprefix('eq.')
            rows = [dict(id=slug, slug=slug, name=slug.title(), primary_color='#334455',
                         description='Fixture company', tagline='Professional services',
                         is_active=True, contact_email='test@example.test')]
        elif path.path.endswith('/company_services'):
            rows = [dict(id='service', title='Web Development', description='Fixture service',
                         price='Custom quote', features=['Accessible'], is_visible=True)]
        data = json.dumps(rows).encode()
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

server = ThreadingHTTPServer(('127.0.0.1', 54329), Fixture)
threading.Thread(target=server.serve_forever, daemon=True).start()
environment = dict(os.environ, NEXT_PUBLIC_SUPABASE_URL='http://127.0.0.1:54329',
                   NEXT_PUBLIC_SUPABASE_ANON_KEY='local-fixture-only')
log = open('/tmp/portfolio-browser-server.log', 'w')
process = subprocess.Popen(['node', 'node_modules/next/dist/bin/next', 'dev', '-p', '3001'],
                           env=environment, stdout=log, stderr=log)
try:
    for _ in range(60):
        try:
            urllib.request.urlopen('http://127.0.0.1:3001/robots.txt', timeout=1)
            break
        except Exception:
            time.sleep(.5)
    else:
        raise RuntimeError('Next dev did not start')
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1280, 'height': 900}, reduced_motion='reduce')
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('console', lambda message: errors.append(message.text)
                if message.type == 'error' and any(word in message.text.lower()
                    for word in ['hydration', 'did not match', 'minified react']) else None)
        for route in ['/', '/build', '/music', '/life', '/wyntech', '/wynora']:
            response = page.goto('http://127.0.0.1:3001' + route)
            assert response.status == 200, (route, response.status)
            page.wait_for_timeout(350)
            assert page.locator('main').count() == 1, route
            print('PASS route', route)
        page.goto('http://127.0.0.1:3001/')
        for name, target in [('Build', '/build'), ('Music', '/music'), ('Life', '/life')]:
            assert page.locator(f'nav a[href="{target}"]').count(), name
        assert page.get_by_role('link', name='Work With Me').first.is_visible()
        for slug, label in [('wyntech', 'Start a Project'), ('wynora', 'Request Booking')]:
            for width in [320, 375, 768, 1280]:
                page.set_viewport_size({'width': width, 'height': 850})
                page.goto(f'http://127.0.0.1:3001/{slug}')
                page.wait_for_timeout(350)
                assert any(link.is_visible() for link in page.locator("nav").get_by_role("link", name=label, exact=True).all()), (slug, width, "CTA missing")
                assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth'), (slug, width, page.locator('body *').evaluate_all('(els) => els.filter(e => e.getBoundingClientRect().right > innerWidth).map(e => [e.tagName, e.className]).slice(0, 12)'))
            page.set_viewport_size({'width': 375, 'height': 850})
            page.goto(f'http://127.0.0.1:3001/{slug}')
            page.get_by_role('button', name='Open navigation', exact=True).click()
            assert page.get_by_role('button', name='Close navigation', exact=True).get_attribute('aria-expanded') == 'true'
            page.keyboard.press('Escape')
            assert page.get_by_role('button', name='Open navigation', exact=True).get_attribute('aria-expanded') == 'false'
            page.locator('#services a').first.click()
            page.wait_for_timeout(500)
            assert '?service=Web%20Development#contact' in page.url
            assert page.locator('#contact-form').get_by_text('Web Development', exact=True).is_visible()
            required = page.locator('#contact-form [required]').evaluate_all('(elements) => elements.map(e => e.name)')
            assert sorted(required) == ['email', 'message', 'name'], required
            assert page.locator('#contact-form').get_by_text('$450', exact=False).count() == 0
            captured = []
            def handle_submission(route):
                captured.append(route.request.post_data_json)
                route.fulfill(status=201, content_type='application/json', body='{"success":true}')
            page.route('**/api/contact', handle_submission)
            page.locator('#contact-form input[name="name"]').fill('Test Visitor')
            page.locator('#contact-form input[name="email"]').fill('visitor@example.test')
            page.locator('#contact-form textarea[name="message"]').fill('Please send details')
            page.locator('#contact-form button[type="submit"]').click()
            page.get_by_role('heading', name='Message sent.').wait_for()
            assert captured[-1]['selectedService'] == 'Web Development'
            assert captured[-1]['companySlug'] == slug
            page.unroute('**/api/contact', handle_submission)
            print('PASS mobile CTA, menu, service selection, simplified form submission', slug)
        page.emulate_media(reduced_motion="no-preference")
        for route in ['/', '/build', '/music', '/life', '/wyntech', '/wynora']:
            assert page.goto('http://127.0.0.1:3001' + route).status == 200
            page.wait_for_timeout(600)
        assert not errors, errors
        print('PASS no browser runtime/hydration errors')
        browser.close()
finally:
    process.terminate()
    process.wait(timeout=15)
    server.shutdown()
    log.close()
