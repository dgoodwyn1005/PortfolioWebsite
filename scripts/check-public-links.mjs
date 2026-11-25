// Only fixed, public destinations. Never fetch arbitrary CMS/user-supplied URLs.
const urls = [
  "https://www.deshawngoodwyn.com/",
  "https://www.deshawngoodwyn.com/build",
  "https://www.deshawngoodwyn.com/music",
  "https://www.deshawngoodwyn.com/life",
  "https://www.deshawngoodwyn.com/wyntech",
  "https://www.deshawngoodwyn.com/wynora",
  "https://www.sonisphere.dev/try",
  "https://www.sonisphere.dev/embed",
  "https://www.sonisphere.dev/docs",
  "https://github.com/dgoodwyn1005/Sonisphere",
]
let failed = false
for (const url of urls) {
  try {
    const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(15000), headers: { "User-Agent": "PortfolioLinkHealth/1.0" } })
    await response.body?.cancel()
    // Rate limiting and bot protection require manual checking, not a broken-link claim.
    const blocked = [401, 403, 429].includes(response.status)
    console.log(response.ok ? "OK" : blocked ? "REVIEW" : "FAIL", response.status, url)
    if (!response.ok && !blocked) failed = true
  } catch (error) {
    console.error("FAIL", url, error.message)
    failed = true
  }
}
if (failed) process.exitCode = 1
