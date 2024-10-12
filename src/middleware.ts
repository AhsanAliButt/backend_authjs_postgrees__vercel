import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default auth((req) => {
  const reqUrl = new URL(req.url);

  // Allow access to the pages without authentication
  if (
    reqUrl.pathname === "/signin" ||
    reqUrl.pathname === "/signup" ||
    reqUrl.pathname === "/verify-user"
  ) {
    return NextResponse.next();
  }

  // If not authenticated and not trying to access the sign-in page, redirect to sign-in
  if (!req.auth) {
    return NextResponse.redirect(
      new URL(
        `/signin?callbackUrl=${encodeURIComponent(reqUrl.pathname)}`,
        req.url
      )
    );
  }

  return NextResponse.next();
});
