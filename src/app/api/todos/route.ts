import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const todoSchema = z.object({
  title: z.string().min(1).max(200),
  completed: z.boolean().optional().default(false),
});

// GET /api/todos - 获取所有待办事项
export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

// POST /api/todos - 创建新的待办事项
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = todoSchema.parse(body);

    const todo = await prisma.todo.create({
      data: validatedData,
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error },
        { status: 400 }
      );
    }
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}
