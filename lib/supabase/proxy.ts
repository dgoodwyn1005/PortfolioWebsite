import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        )
      },
    },
  })

  // getUser() validates the current access token with Supabase. Authorization
  // itself comes from the database-backed user_roles table below.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/")
  const isAdminLogin = pathname === "/admin/login"

  const copySessionState = (response: NextResponse) => {
    for (const cookie of supabaseResponse.cookies.getAll()) {
      response.cookies.set(cookie.name, cookie.value, cookie)
    }

    for (const header of ["cache-control", "expires", "pragma"]) {
      const value = supabaseResponse.headers.get(header)
      if (value) response.headers.set(header, value)
    }

    return response
  }

  if (isAdminRoute && !isAdminLogin) {
    if (!user) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = "/admin/login"
      loginUrl.search = ""
      return copySessionState(NextResponse.redirect(loginUrl))
    }

    const { data: role } = await supabase
      .from("user_roles")
      .select("is_admin")
      .eq("user_id", user.id)
      .maybeSingle()

    if (role?.is_admin !== true) {
      const homeUrl = request.nextUrl.clone()
      homeUrl.pathname = "/"
      homeUrl.search = ""
      return copySessionState(NextResponse.redirect(homeUrl))
    }
  }

  return supabaseResponse
}
