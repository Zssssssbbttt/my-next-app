// middleware.ts

import { NextResponse } from "next/server";
import type { NextResponse } from "next/server";

export function middleware(request: NextResponse) {
  // 获取路径
  const path = request.nextUrl.pathname;

  const isProtectedRoute =
    path.startsWith("/dashboard") || path.startsWith("/api/protected");
  const isAuthRoute = path.startsWith("/login") || path.startsWith("/register");

  // 获取token
  const token =
    request.cookies.get("token")?.value || request.headers.get("authorization");

  // 受保护未登录 跳转到登录页
  if (isProtectedRoute && !token) {
    return NextResponse.redirect("/login", request.url);
  }

  // 已登录 跳转到首页
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashborad"), request.url);
  }

  // 添加请求头到请求信息上
  // 3. 添加请求头
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", path);
  requestHeaders.set("x-timestamp", Date.now().toString());

  // CORS处理
  if (path.startsWith("/api/")) {
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    ); 
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    return response;
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/login", "/register"],
};
