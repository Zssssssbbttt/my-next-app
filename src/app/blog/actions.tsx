"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { comments } from "./definitions";

// 验证评论
const CommentSchema = z.object({
  postId: z.string().min(1, "postId不能为空"),
  author: z
    .string()
    .min(2, "作者至少需要2个字符")
    .max(50, "作者不能超过50个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  content: z
    .string()
    .min(5, "评论内容至少需要5个字符")
    .max(500, "评论内容不能超过500个字符"),
});

export type CommentFormState = {
  errors?: {
    postId?: string[];
    author?: string[];
    email?: string[];
    content?: string[];
  };
  message?: string;
  success?: boolean;
};

// 创建评论
export async function createComment(
  prevState: CommentFormState,
  formData: FormData,
) {
  console.log("formData:", formData);
  try {
    // 验证表单数据
    const validateResult = CommentSchema.safeParse({
      postId: formData.get("postId")?.toString() || "",
      author: formData.get("author"),
      email: formData.get("email"),
      content: formData.get("content"),
    });

    console.log("验证结果:", validateResult);

    if (!validateResult.success) {
      return {
        errors: validateResult.error?.flatten().fieldErrors,
        message: "验证失败，请检查输入内容",
        success: false,
      };
    }

    const { postId, author, email, content } = validateResult.data;

    const newComment = {
      id: Date.now().toString(),
      postId,
      author,
      email,
      content,
      cteateAt: new Date().toISOString(),
    };

    comments.push(newComment as unknown as typeof comments[number]);

    revalidatePath(`/blog/${postId}`);

    return {
      message: "评论发布成功",
      success: true,
    };
  } catch {
    return {
      message: "评论发布失败",
      success: false,
    };
  }
}

// 删除评论
export async function deleteComment(
  { formData }: { formData: FormData }, // 使用对象解构
) {
  const commentId = formData.get("commentId")?.toString() || "";
  const postId = formData.get("postId")?.toString() || "";

  console.log("删除评论，commentId:", commentId, "postId:", postId);

  try {
    const commentIndex = comments.findIndex((c) => c.id === commentId);
    console.log("commentIndex:", commentIndex);

    if (commentIndex === -1) {
      return {
        message: "评论不存在",
        success: false,
      };
    }
    comments.splice(commentIndex, 1);

    // 重新验证路径
    revalidatePath(`/blog/${postId}`);

    return {
      message: "评论删除成功",
      success: true,
    };
  } catch {
    return {
      message: "评论删除失败",
      success: false,
    };
  }
}
