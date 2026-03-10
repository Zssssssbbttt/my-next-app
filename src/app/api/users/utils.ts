import { NextResponse } from "next/server";
import { z } from "zod";

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// 成功响应
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    {
      status,
    },
  );
}

// 失败响应
export function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      data: message,
    },
    {
      status,
    },
  );
}

// 表单验证

const UserSchema = z.object({
  name: z.string().min(1, "名称不能为空").max(10),
  age: z.string().min(1, "年级不能为空").max(130, "年龄最大不超过130"),
  email: z.string().max(50, "描述不能超过50个字符").optional(),
});

export function validateResult(data: any) {
  console.log("验证信息 validateResult:", data);
  try {
    // 判断传入的是 FormData 还是普通对象
    let validationData: { title: string; age: string; email: string };

    if (data instanceof FormData) {
      // 如果是 FormData，使用 get 方法
      validationData = {
        title: data.get("name")?.toString() || "",
        age: data.get("age")?.toString() || "",
        email: data.get("email")?.toString() || "",
      };
    } else {
      validationData = {
        title: data.name || data.title || "", // 注意：打印显示是 name，但验证用的是 title
        age: data.age?.toString() || "",
        email: data.email || "",
      };
    }

    console.log('验证信息',validationData)

    const validation = UserSchema.safeParse(validationData);

    console.log("验证结果", validation);

    if (!validation.success) {
      return {
        error: validation.error?.flatten().fieldErrors,
        message: "验证失败",
        success: false,
      };
    }

    return {
      message: "验证成功",
      success: true,
    };
  } catch (error) {
    return {
      error,
    };
  }
}
