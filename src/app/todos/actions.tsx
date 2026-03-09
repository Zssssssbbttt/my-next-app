"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { todos } from "./definitions";

const TodoSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(100, "标题不能超过100个字符"),
  describe: z.string().max(500, "描述不能超过500个字符").optional(),
  deadLine: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "请输入有效的日期字符串",
    })
    .optional(),
});

export async function createTodo(prevState: any, formData) {
  try {
    const validateResult = TodoSchema.safeParse({
      title: formData.get("title")?.toString() || "",
      describe: formData.get("describe")?.toString() || "",
      deadLine: formData.get("deadLine")?.toString() || "",
    });

    if (!validateResult.success) {
      return {
        error: validateResult.error.flatten().fieldErrors,
        message: "验证失败，请检查输入内容",
        success: false,
      };
    }

    const { title, describe, deadLine } = validateResult.data;

    const newTodo = {
      id: Date.now().toString(),
      title,
      describe,
      deadLine,
    };

    todos.push(newTodo);

    console.log("代办事项:", todos);

    revalidatePath("/todos");

    return {
      message: "创建成功",
      success: true,
    };
  } catch (error) {
    return (
      <div>
        <p>处理表单时发生错误。</p>
      </div>
    );
  }
}

// export default function deleteTodo() {}
