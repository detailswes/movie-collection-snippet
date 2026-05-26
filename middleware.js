import { NextResponse } from "next/server";

export function middleware(request) {
  const authToken = request.cookies.get("token")?.value;
  const publicRoutes = ["/sign-in", "/sign-up"];
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

  if (isPublicRoute && authToken) {
    return NextResponse.redirect(new URL("/movies", request.url));
  }

  if (!isPublicRoute && !authToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: ["/", "/movies", "/movies/:path*", "/sign-in", "/sign-up"],
};
