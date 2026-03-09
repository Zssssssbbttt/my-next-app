import { NextRequest } from "next/server";
import { todos } from "./type";
import {
  generateId,
  successResponse,
  errorResponse,
  validateCreateTodo,
} from "./utils";

// GET /api/todos - 获取所有待办事项
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const complete = searchParams.get("complete");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "1");

    let filterTodos = [...todos];

    //   按状态查询
    if (complete !== null) {
      const isComplete = complete === "true";
      filterTodos = filterTodos.filter((item) => item.complete === isComplete);
    }

    // 按搜索条件查询
    if (search) {
      filterTodos = filterTodos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(search.toLocaleLowerCase()) ||
          (todo.description &&
            todo.descripition
              .toLowerCase()
              .include(search.toLocaleLowerCase())),
      );
    }

    //   排序最新日期的排在前面
    filterTodos.sort((a, b) => {
      new Date(b.createAt).getTime() - new Date(a.createAt).getTime();
    });

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedTodos = filterTodos.slice(start, end);

    return successResponse({
      todos: paginatedTodos,
      pagination: {
        total: filterTodos.length,
        page,
        limit,
        totalPages: Math.ceil(filterTodos.length / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/todos error:", error);
    return errorResponse("获取待办事项失败", 500);
  }
}

// POST /api/todos/ - 创建新的待办事项
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证输入
    const validation = validateCreateTodo(body);
    if (!validation.valid) {
      return errorResponse(validation.error.join(","), 400);
    }

    // 创建新的待办事项
    const newTodo = {
      id: generateId(),
      title: body.title,
      description: body.description || "",
      completed: false,
      dueDate: body.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 保存到"数据库"
    todos.push(newTodo);

    return successResponse(newTodo, 201);
  } catch (error) {
    console.error("POST /api/todos", error);
    return errorResponse("创建代办事项失败", 500);
  }
}
