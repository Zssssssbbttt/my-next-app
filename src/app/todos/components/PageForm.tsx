// src/app/todos/components/PageForm.tsx
"use client";

import { useActionState } from "react";
import { createTodo } from "../actions";
import styles from './PageForm.module.css'


export default function TodoForm() {
  const [state, formAction, isPending] = useActionState(
    createTodo,
    {
      error: {},
      message: "",
      success: false,
    }
  );

  return (
    <div>
      {/* ✅ 使用类型断言或检查 */}
      {('message' in state) && state.message && (
        <div
          className={`${styles.message} ${state.success ? styles.success : styles.error}`}
        >
          {state.message}
        </div>
      )}

      <form className="flex gap-2" action={formAction}>
        <input
          type="text"
          placeholder="输入新的代办事项....."
          className="flex-1 px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          name="title"
        />

        <textarea
          placeholder="代办事项描述....."
          className="border p-2 rounded-lg border-zinc-300"
          name="describe"
        />

        <input
          type="datetime-local"
          name="deadLine"
          className="border p-2 rounded border-zinc-300"
        />

        <button 
          type="submit" 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium" 
          disabled={isPending}
        >
          {isPending ? "添加中..." : "添加"}
        </button>
      </form>

      {/* ✅ 显示验证错误 */}
      {('error' in state) && state.error && (
        <div className={styles.errors}>
          {state.error.title && (
            <p className={styles.errorText}>{state.error.title[0]}</p>
          )}
          {state.error.describe && (
            <p className={styles.errorText}>{state.error.describe[0]}</p>
          )}
          {state.error.deadLine && (
            <p className={styles.errorText}>{state.error.deadLine[0]}</p>
          )}
        </div>
      )}
    </div>
  );
}
