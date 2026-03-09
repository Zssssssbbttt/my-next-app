// 获取请求参数的不同方式

import { NextRequest } from "next/server";

//  GET /api/post/ - 获取待办事项
export async function GET(request: NextRequest) {
  // 1. 获取URL参数
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  // 2. 获取请求头信息
  const userAgent = request.headers.get("use-agent");
  const authorization = request.headers.get("authorization ");

  //   3. 获取cookie
  const token = request.cookies.get("token");
  const allCookies = request.cookies.getAll();

  // 获取动态路由参数[id]
}

export async function POST(request: NextRequest) {
  // 1. 解析JSON
  const body = await request.json();

  // 2.解析表单数据
  const formData = await request.formData();
  const title = formData.get("title");

  // 3. 获取原始数据
  const text = formData.text();

  // 4. 获取blob (文件上传)
  const blob = await request.blob();
}
