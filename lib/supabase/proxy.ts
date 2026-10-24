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

  // Verify the token rather than trusting the user object stored in a cookie.
  const {
    data: { claims },
  } = await supabase.auth.getClaims()

  const pathname = request.nextUrl.pathname
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/")
  const isAdminLogin = pathname === "/admin/login"

  const copySessionState = (response: NextResponse) => {
    response.cookies.setAll(supabaseResponse.cookies.getAll())

    for (const header of ["cache-control", "expires", "pragma"]) {
      const value = supabaseResponse.headers.get(header)
      if (value) response.headers.set(header, value)
    }

    return response
  }

  if (isAdminRoute && !isAdminLogin) {
    const userId = typeof claims?.sub === "string" ? claims.sub : null

    if (!userId) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = "/admin/login"
      loginUrl.search = ""
      return copySessionState(NextResponse.redirect(loginUrl))
    }

    // Authorization comes from the database-backed role table. This avoids
    // treating editable user metadata as an admin permission.
    const { data: role } = await supabase
      .from("user_roles")
      .select("is_admin")
      .eq("user_id", userId)
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
