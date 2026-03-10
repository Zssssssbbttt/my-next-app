import { NextRequest } from "next/server";
import { UpdateTodoInput, todos } from "../type";
import { successResponse, errorResponse } from "../utils";

// GET /api/todos/[id] - 获取单个待办事项
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const todo = todos.find((t) => t.id === id);
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
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateTodoInput;

    // 查询待办事项索引
    const todoIndex = todos.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
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
      ...todos[todoIndex],
      ...body,
      updateAt: new Date().toISOString(),
    };

    todos[todoIndex] = updateTodo;
    return successResponse(updateTodo);
  } catch (error) {
    console.error("PUT /api/todos/[id] error:", error);
    return errorResponse("更新待办事项失败", 400);
  }
}

// PATCH /api/todos/[id] - 部分更新（例如切换完成状态）
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 查找待办事项索引
    const todoIndex = todos.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
      return errorResponse("待办事项不存在", 404);
    }

    // 只更新提供的字段
    const updatedTodo = {
      ...todos[todoIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    todos[todoIndex] = updatedTodo;

    return successResponse(updatedTodo);
  } catch (error) {
    console.error("PATCH /api/todos/[id] error:", error);
    return errorResponse("更新待办事项失败", 500);
  }
}

// DELETE /api/todos/[id] - 删除待办事项
// DELETE /api/todos/[id] - 删除待办事项
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },  // ✅ 添加 Promise
) {
  try {
    const { id } = await params;

    const deleteTodoIndex = todos.findIndex((t) => t.id === id);
    if (deleteTodoIndex === -1) {
      return errorResponse("删除待办事项不存在", 404);  // 建议添加状态码
    }

    const deleteTodo = todos[deleteTodoIndex];
    todos.splice(deleteTodoIndex, 1);

    return successResponse({
      message: "删除成功",
      deleteTodo,
    });
  } catch (error) {
    console.error("DELETE /api/todos/[id] error:", error);
    return errorResponse("删除待办事项失败", 500);
  }
}


// 处理不支持的HTTP方法
export async function HEAD() {
  return errorResponse("Method not allowed", 405);
}
