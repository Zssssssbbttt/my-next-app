"use client";

import { useActionState } from "react";
import styles from "./CommentForm.module.css";
import { createComment, type CommentFormState } from "../actions.tsx";

export default function CommentForm({ postId }: { postId: string }) {
  const initialState: CommentFormState = {
    errors: {},
    message: "",
    success: false,
  };

  const [state, formAction, isPending] = useActionState(
    createComment,
    initialState,
  );

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>发表评论</h3>

      {state.message && (
        <div
          className={`${styles.message} ${state.success ? styles.success : styles.error}`}
        >
          {state.message}
          {state.message}
        </div>
      )}

      <form action={formAction} className={styles.form}>
        <input type="hidden" name="postId" value={postId} />

        <div className={styles.formGroup}>
          <label htmlFor="author">姓名 *</label>
          <input
            type="text"
            id="author"
            name="author"
            placeholder="请输入您的姓名"
            className={styles.input}
            disabled={isPending}
          />
          
          {state.errors?.author && (
            <p className={styles.errorText}>{state.errors.author[0]}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">邮箱 *</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="请输入您的邮箱"
            className={styles.input}
            disabled={isPending}
          />
          {state.errors?.email && (
            <p className={styles.errorText}>{state.errors.email[0]}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content">评论内容 *</label>
          <textarea
            id="content"
            name="content"
            rows={4}
            placeholder="写下您的评论..."
            className={styles.textarea}
            disabled={isPending}
          />
          {state.errors?.content && (
            <p className={styles.errorText}>{state.errors.content[0]}</p>
          )}
        </div>

        <button type="submit" disabled={isPending} className={styles.submitBtn}>
          {isPending ? "提交中..." : "提交评论"}
        </button>
      </form>
    </div>
  );
}
