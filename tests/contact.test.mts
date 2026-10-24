import { test, mock } from "node:test"
import assert from "node:assert/strict"
import { NextRequest } from "next/server"

let duplicate: {id: string} | null = null
let count = 0
let insertError = false
let notificationThrows = false
let statusThrows = false
let inserts: Record<string, unknown>[] = []
let updates: Record<string, unknown>[] = []
let notifications = 0
const client = { from() {
  let operation = "select"
  const query = {
    select(_columns?: string, options?: {head?: boolean}) { if (options?.head) operation = "count"; return query },
    eq() { return query }, gte() { return query }, order() { return query }, limit() { return query },
    maybeSingle: async () => ({data: duplicate, error: null}),
    insert(data: Record<string, unknown>) { inserts.push(data); return query },
    single: async () => ({data: insertError ? null : {id: "saved-lead"}, error: insertError ? {code: "test", message: "database down"} : null}),
    update(data: Record<string, unknown>) { operation = "update"; updates.push(data); return query },
    then(resolve: (value: unknown) => unknown, reject: (error: Error) => unknown) {
      if (operation === "update" && statusThrows) return Promise.reject(new Error("status write down")).then(resolve, reject)
      return Promise.resolve({count, error: null}).then(resolve, reject)
    },
  }
  return query
}}
mock.module("../lib/supabase/server.ts", { namedExports: {createAdminClient: () => client} })
mock.module("../lib/lead-notifications.ts", { namedExports: {sendLeadNotifications: async () => {
  assert.ok(inserts.length || duplicate, "email must follow persistence")
  notifications++
  if (notificationThrows) throw new Error("email down")
  return {owner: "failed", acknowledgement: "disabled"}
}} })
const { POST } = await import("../app/api/contact/route.ts")
const valid = {name: "Test Visitor", email: "TEST@example.com", message: "A project request", companySlug: "wyntech", selectedService: "Web Development"}
async function post(body: unknown, type = "application/json") {
  return POST(new NextRequest("http://localhost/api/contact", {method: "POST", headers: {"content-type": type}, body: JSON.stringify(body)}))
}
function reset() { duplicate = null; count = 0; insertError = false; notificationThrows = false; statusThrows = false; inserts = []; updates = []; notifications = 0 }
test("lead persistence and notification failure boundaries", async t => {
  await t.test("selected service persisted, email normalized, failed delivery separate from stage", async () => {
    reset(); assert.equal((await post(valid)).status, 201)
    assert.equal(inserts[0].selected_service, "Web Development"); assert.equal(inserts[0].email, "test@example.com"); assert.equal(inserts[0].status, "new")
    assert.equal(updates[0].owner_notification_status, "failed"); assert.equal(updates[0].status, undefined)
  })
  for (const failure of ["notification", "status"]) await t.test(`${failure} exception preserves saved lead success`, async () => {
    reset(); notificationThrows = failure === "notification"; statusThrows = failure === "status"
    assert.equal((await post(valid)).status, 201); assert.equal(inserts.length, 1)
  })
  await t.test("duplicates reuse persistence even when email throws", async () => {
    reset(); duplicate = {id: "existing"}; notificationThrows = true
    assert.equal((await post(valid)).status, 201); assert.equal(inserts.length, 0)
  })
  await t.test("honeypot bypasses persistence and email", async () => {
    reset(); assert.equal((await post({...valid, website: "spam"})).status, 201); assert.equal(inserts.length, 0); assert.equal(notifications, 0)
  })
  await t.test("rate guard rejects burst", async () => { reset(); count = 4; assert.equal((await post(valid)).status, 429); assert.equal(inserts.length, 0) })
  await t.test("failed persistence never sends email", async () => { reset(); insertError = true; assert.equal((await post(valid)).status, 500); assert.equal(notifications, 0) })
  await t.test("invalid input rejected before persistence", async () => {
    reset(); assert.equal((await post({...valid, email: "bad"})).status, 400); assert.equal((await post(valid, "text/plain")).status, 415); assert.equal((await post({...valid, message: "x".repeat(26000)})).status, 413); assert.equal(inserts.length, 0)
  })
})
