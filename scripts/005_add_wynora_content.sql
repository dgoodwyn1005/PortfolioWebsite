-- Add testimonials for Wynora
INSERT INTO company_testimonials (company_id, client_name, client_role, client_company, content, rating, display_order, is_visible)
SELECT 
  c.id,
  'Pastor Michael Thompson',
  'Senior Pastor',
  'Grace Community Church',
  'Deshawn has been our go-to pianist for over three years now. His ability to read the room and adapt his playing to the spirit of our services is remarkable. Whether it''s a solemn moment of reflection or a joyful celebration, he brings exactly the right energy.',
  5,
  1,
  true
FROM companies c WHERE c.slug = 'wynora'
ON CONFLICT DO NOTHING;

INSERT INTO company_testimonials (company_id, client_name, client_role, client_company, content, rating, display_order, is_visible)
SELECT 
  c.id,
  'Sarah Mitchell',
  'Music Director',
  'First Baptist Church',
  'I hired Wynora for my daughter''s wedding ceremony and reception. The accompaniment was flawless - he learned three custom song requests in just a week. Our guests kept asking who the pianist was. Worth every penny.',
  5,
  2,
  true
FROM companies c WHERE c.slug = 'wynora'
ON CONFLICT DO NOTHING;

INSERT INTO company_testimonials (company_id, client_name, client_role, client_company, content, rating, display_order, is_visible)
SELECT 
  c.id,
  'Marcus Davis',
  'Recording Artist',
  '',
  'The Premium Recording Package exceeded my expectations. Deshawn didn''t just play the piano parts - he helped arrange my songs to sound more professional. The final tracks were radio-ready quality.',
  5,
  3,
  true
FROM companies c WHERE c.slug = 'wynora'
ON CONFLICT DO NOTHING;

-- Add FAQs for Wynora
INSERT INTO company_faqs (company_id, question, answer, display_order, is_visible)
SELECT 
  c.id,
  'Do you travel for events outside your local area?',
  'Yes! I travel within a 50-mile radius at no extra charge. For events beyond that, I charge a travel fee of $0.50/mile round trip. For out-of-state events, we can discuss travel arrangements and accommodations.',
  1,
  true
FROM companies c WHERE c.slug = 'wynora'
ON CONFLICT DO NOTHING;

INSERT INTO company_faqs (company_id, question, answer, display_order, is_visible)
SELECT 
  c.id,
  'Can I request songs that aren''t in your standard repertoire?',
  'Absolutely! I can learn most songs within 1-2 weeks given sheet music or a recording. For hymns and gospel songs, I have a library of over 200 chord charts. Custom song requests are included in all packages.',
  2,
  true
FROM companies c WHERE c.slug = 'wynora'
ON CONFLICT DO NOTHING;

INSERT INTO company_faqs (company_id, question, answer, display_order, is_visible)
SELECT 
  c.id,
  'Do you provide your own equipment?',
  'For events, I can bring a professional digital piano and sound system if needed (included in Luxury package, available as add-on for others). I can also use your venue''s acoustic piano or keyboard if preferred.',
  3,
  true
FROM companies c WHERE c.slug = 'wynora'
ON CONFLICT DO NOTHING;

INSERT INTO company_faqs (company_id, question, answer, display_order, is_visible)
SELECT 
  c.id,
  'How far in advance should I book?',
  'I recommend booking at least 2-3 weeks in advance for regular events, and 1-2 months for weddings or large productions. Rush bookings may be available for an additional fee - just reach out!',
  4,
  true
FROM companies c WHERE c.slug = 'wynora'
ON CONFLICT DO NOTHING;

INSERT INTO company_faqs (company_id, question, answer, display_order, is_visible)
SELECT 
  c.id,
  'What''s included in the recording packages?',
  'Each package includes studio time, professional mixing, and final master files. Essential includes basic mixing, Premium adds multi-track recording and advanced mixing, and Luxury includes full production with backup musicians if needed.',
  5,
  true
FROM companies c WHERE c.slug = 'wynora'
ON CONFLICT DO NOTHING;

INSERT INTO company_faqs (company_id, question, answer, display_order, is_visible)
SELECT 
  c.id,
  'What genres do you specialize in?',
  'My specialty is gospel and worship music, but I''m also proficient in jazz, classical, R&B, and contemporary Christian. I''ve accompanied everything from traditional hymns to modern worship sets.',
  6,
  true
FROM companies c WHERE c.slug = 'wynora'
ON CONFLICT DO NOTHING;

-- Update Wynora about_text and mission_text to be more specific and personal
UPDATE companies 
SET 
  about_text = 'Wynora Music Services was born from a passion that started at age 8 on a church piano bench. After over a decade of playing for churches, weddings, and recording sessions across Virginia, I founded Wynora to bring professional-grade piano services to musicians and events of all sizes. With 200+ chord charts memorized and experience ranging from intimate ceremonies to 500+ seat sanctuaries, I understand that music isn''t just background noise - it''s the heartbeat of your moment.',
  mission_text = 'My mission is simple: make every note count. Whether you''re a vocalist who needs reliable accompaniment for your audition, a church looking for a fill-in pianist, or an artist ready to record your next project, Wynora delivers studio-quality piano performance tailored to your vision. No generic loops, no half-effort sessions - just dedicated musicianship that elevates your sound.'
WHERE slug = 'wynora';
