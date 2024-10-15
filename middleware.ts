import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ignoreRoute = [
  {
    path: "/signin",
    method: "GET",
    match: "startWith",
  },
  {
    path: "/signup",
    method: "GET",
    match: "startWith",
  },
  {
    path: "/new-verification",
    method: "GET",
    match: "startWith",
  },

  {
    path: "/api/auth/logout",
    method: "POST",
    match: "startWith",
  },
  {
    path: "/api/auth/signout",
    method: "POST",
    match: "startWith",
  },
  {
    path: "/api/auth/[...nextauth]",
    method: "POST",
    match: "startWith",
  },
];

export default async function middleware(request: NextRequest) {
  try {
    const localCookie = request.cookies.has("__Secure-next-auth.session-token");
    const vercelCookie = request.cookies.has("next-auth.session-token");
    const isLogin = localCookie || vercelCookie;

    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const { pathname } = request.nextUrl;

    if ((pathname === "/signin" || pathname === "/signup") && isLogin) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    for (const path of ignoreRoute) {
      if (path.match === "startWith" && pathname.startsWith(path.path)) {
        return NextResponse.next();
      }
      if (path.match === "exact" && pathname === path.path) {
        return NextResponse.next();
      }
    }

    if (pathname.startsWith("/dashboard") && !isLogin) {
      return NextResponse.redirect(new URL(`/signin`, request.url));
    }
    if (pathname.startsWith("/profile") && !isLogin) {
      return NextResponse.redirect(new URL(`/signin`, request.url));
    }

    const response = NextResponse.next();

    // Restrict access to admin dashboard if the user is not an admin

    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
    "/dashboard/:path*",
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
    "/auth/:path*",
  ],
};
