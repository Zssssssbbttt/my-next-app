import { NextRequest } from "next/server";
import { UpdateUser, userList } from "../type";
import { successResponse, errorResponse } from "../utils";

// GET /api/users/[id] - 获取单个用户信息
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },  // ✅ Next.js 15
) {
  try {
    const { id } = await params;  // ✅ 需要 await

    const user = userList.find((u) => u.id === id);
    if (!user) {
      return errorResponse("用户不存在", 404);
    }
    return successResponse(user);
  } catch (error) {
    console.error("GET /api/users/[id] error:", error);
    return errorResponse("获取用户失败", 500);
  }
}

// PUT /api/users/[id] - 更新用户信息
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },  // ✅ Next.js 15
) {
  try {
    const { id } = await params;  // ✅ 需要 await
    const body = (await request.json()) as UpdateUser;

    // 查询用户索引
    const userIndex = userList.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return errorResponse("用户不存在", 404);
    }

    // 验证输入（根据用户字段调整）
    if (
      body.name &&
      (typeof body.name !== "string" || body.name.length < 2)
    ) {
      return errorResponse("用户名至少需要 2 个字符", 400);
    }

    const updatedUser = {
      ...userList[userIndex],
      ...body,
      updatedAt: new Date().toISOString(),  // ✅ 统一为 updatedAt
    };

    userList[userIndex] = updatedUser;
    return successResponse(updatedUser);
  } catch (error) {
    console.error("PUT /api/users/[id] error:", error);
    return errorResponse("更新用户失败", 500);
  }
}

// PATCH /api/users/[id] - 部分更新用户信息
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },  // ✅ Next.js 15
) {
  try {
    const { id } = await params;  // ✅ 需要 await
    const body = await request.json();

    // 查找用户索引
    const userIndex = userList.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return errorResponse("用户不存在", 404);
    }

    // 只更新提供的字段
    const updatedUser = {
      ...userList[userIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    userList[userIndex] = updatedUser;

    return successResponse(updatedUser);
  } catch (error) {
    console.error("PATCH /api/users/[id] error:", error);
    return errorResponse("更新用户失败", 500);
  }
}

// DELETE /api/users/[id] - 删除用户
export async function DELETE(
  request: NextRequest,  // ✅ 修复拼写错误
  { params }: { params: Promise<{ id: string }> },  // ✅ Next.js 15
) {
  try {
    const { id } = await params;  // ✅ 需要 await

    const deleteUserIndex = userList.findIndex((u) => u.id === id);
    if (deleteUserIndex === -1) {
      return errorResponse("用户不存在", 404);
    }

    const deletedUser = userList[deleteUserIndex];
    userList.splice(deleteUserIndex, 1);

    return successResponse({
      message: "删除成功",
      deletedUser,  // ✅ 变量名改为 deletedUser
    });
  } catch (error) {
    console.error("DELETE /api/users/[id] error:", error);
    return errorResponse("删除用户失败", 500);
  }
}

// 处理不支持的 HTTP 方法
export async function HEAD() {
  return errorResponse("Method not allowed", 405);
}
