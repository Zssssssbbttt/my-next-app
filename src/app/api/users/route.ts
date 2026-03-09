// api/uers - 请求响应
import { NextRequest } from "next/server";
import { userList } from "./type";
import {
  successResponse,
  errorResponse,
  validateResult,
  generateId,
} from "@/app/api/users/utils";

// GET /api/user - 用户信息请求响应
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get("name");
    const age = searchParams.get("age");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "1");

    let users = [...userList];

    users = users.filter((use) => use.name === name);

    users = users.filter((use) => use.age === age);

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedTodos = users.slice(start, end);

    return successResponse({
      users: paginatedTodos,
      pagination: {
        total: users.length,
        page,
        limit,
        totalPages: Math.ceil(users.length / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return errorResponse("查询失败");
  }
}

// POST /api/users/ - 创建新用户
export async function POST(request: NextRequest) {
  
  try {
    const body = await request.json();

    console.log('请求响应',body)
    const validated = validateResult(body);
    console.log('验证结果',validated)
    if (!validated.success) {
      return errorResponse("验证失败，请重试......");
    }

    const newUser = {
      id: generateId(),
      name: body.name,
      age: body.age,
      describe: body.describe || "",
      email: body.email,
      role: body.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    userList.push(newUser);

    return successResponse(newUser, 200);
  } catch (error) {
    return errorResponse("添加失败....", 400);
  }
}
