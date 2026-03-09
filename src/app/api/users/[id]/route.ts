import { NextRequest } from "next/server";
import { UpdateUser, userList } from "../type";
import { successResponse, errorResponse } from "../utils";

// GET /api/users/[id] - 获取单个用户信息
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const todo = userList.find((t) => t.id === id);
    if (!todo) {
      return errorResponse("待办事项不存在", 404);
    }
    return successResponse(todo);
  } catch (error) {
    console.error("GET /api/todos/[id] error:", error);
    return errorResponse("代办事项不存在", 500);
  }
}

// PUT /api/todos/[id] - 更新待办事项
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = (await request.json()) as UpdateUser;

    // 查询待办事项索引
    const userIndex = userList.findIndex((t) => t.id === id);

    if (userIndex === -1) {
      return errorResponse("待办事项不存在", 400);
    }

    // 验证输入（简化版）
    if (
      body.title &&
      (typeof body.title !== "string" || body.title.length < 2)
    ) {
      return errorResponse("标题至少需要2个字符", 400);
    }

    const updateTodo = {
      ...userList[userIndex],
      ...body,
      updateAt: new Date().toISOString(),
    };

    userList[userIndex] = updateTodo;
    return successResponse(updateTodo);
  } catch (error) {
    console.error("PUT /api/users/[id] error:", error);
    return errorResponse("更新待办事项失败", 400);
  }
}

// PATCH /api/todos/[id] - 部分更新（例如切换完成状态）
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await request.json();

    // 查找待办事项索引
    const userIndex = userList.findIndex((t) => t.id === id);

    if (userIndex === -1) {
      return errorResponse("待办事项不存在", 404);
    }

    // 只更新提供的字段
    const updatedTodo = {
      ...userList[userIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    userList[userIndex] = updatedTodo;

    return successResponse(updatedTodo);
  } catch (error) {
    console.error("PATCH /api/todos/[id] error:", error);
    return errorResponse("更新待办事项失败", 500);
  }
}

// DELETE /api/todos/[id] - 删除待办事项
export async function DELETE(
  requesr: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const deleteUserIndex = userList.findIndex((t) => t.id === id);
    if (deleteUserIndex === -1) {
      return errorResponse("删除待办事项失败");
    }

    const deleteTodo = userList[deleteUserIndex];

    userList.splice(deleteUserIndex, 1);

    return successResponse({
      message: "删除成功",
      deleteTodo,
    });
  } catch (error) {
    console.error("DELETE /api/users/[id] error:", error);
    return errorResponse("删除待办事项失败", 500);
  }
}

// 处理不支持的HTTP方法
export async function HEAD() {
  return errorResponse("Method not allowed", 405);
}
