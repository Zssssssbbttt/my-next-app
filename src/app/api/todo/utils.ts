import { NextResponse } from "next/server";

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status },
  );
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    }, 
    { status },
  );
}

export function validateCreateTodo(input: any): {
  valid: boolean;
  error: string[];
} {
  const errors: string[] = [];

  if (!input.title || typeof input.title !== "string") {
    errors.push("标题是必填项");
  } else if (input.title.length < 2) {
    errors.push("标题至少需要2个字符");
  } else if (input.title.length > 100) {
    errors.push("标题不能超过100个字符");
  }

   if (input.description && typeof input.description !== 'string') {
    errors.push('描述必须是文本')
  }
  
  if (input.dueDate && !isValidDate(input.dueDate)) {
    errors.push('日期格式无效')
  }

   return {
    valid: errors.length === 0,
    error:errors as string[]
  }
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}
