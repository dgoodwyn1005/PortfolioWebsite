import {test, mock} from "node:test"
import assert from "node:assert/strict"
mock.module("server-only", {exports: {}})
const {sendLeadNotifications} = await import("../lib/lead-notifications.ts")
const lead = {id: "saved-lead", name: "Visitor", email: "visitor@example.test", subject: null, message: "Hello", companySlug: "wynora", submissionType: "booking", selectedService: "Recording", budgetRange: null, timeline: null, eventDate: null, eventLocation: null}
test("notification delivery and acknowledgement controls", async t => {
  const originalFetch = globalThis.fetch
  const originalEnv = {...process.env}
  t.after(() => { globalThis.fetch = originalFetch; process.env = originalEnv })
  delete process.env.RESEND_API_KEY
  delete process.env.LEAD_FROM_EMAIL
  delete process.env.LEAD_ACK_EMAILS_ENABLED
  assert.deepEqual(await sendLeadNotifications(lead), {owner: "skipped", acknowledgement: "disabled"})
  process.env.RESEND_API_KEY = "local-test-only"
  process.env.LEAD_FROM_EMAIL = "sender@example.test"
  const requests: RequestInit[] = []
  globalThis.fetch = async (_url, init) => { requests.push(init!); return new Response("{}", {status: 200}) }
  assert.deepEqual(await sendLeadNotifications(lead), {owner: "sent", acknowledgement: "disabled"})
  assert.equal(requests.length, 1)
  assert.equal((requests[0].headers as Record<string,string>)["Idempotency-Key"], "lead-owner/saved-lead")
  assert.ok(requests[0].signal, "provider requests must have a timeout")
  process.env.LEAD_ACK_EMAILS_ENABLED = "true"
  assert.deepEqual(await sendLeadNotifications(lead), {owner: "sent", acknowledgement: "sent"})
  assert.equal((requests[2].headers as Record<string,string>)["Idempotency-Key"], "lead-ack/saved-lead")
  globalThis.fetch = async () => new Response("{}", {status: 503})
  assert.deepEqual(await sendLeadNotifications(lead), {owner: "failed", acknowledgement: "failed"})
  globalThis.fetch = async () => {throw new Error("timeout")}
  assert.deepEqual(await sendLeadNotifications(lead), {owner: "failed", acknowledgement: "failed"})
})
