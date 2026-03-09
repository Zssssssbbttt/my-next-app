// app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import { users } from "../../../../auth.config";
import { use } from "react";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // 验证输入
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "请填写所有必填字段" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "密码至少需要6个字符" },
        { status: 400 },
      );
    }

    // 检查用户是否已存在
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return NextResponse.json({ error: "该邮箱已被注册" }, { status: 400 });
    }

    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      password,
      role: "user" as const,
    };

    users.push(newUser);

    return NextResponse.json(
      { message: "注册成功", user: { id: newUser.id, name, email } },
      { status: 201 },
    );

  } catch (error) {

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "注册失败，请稍后重试" },
      { status: 500 },
    );
    
  }
}
