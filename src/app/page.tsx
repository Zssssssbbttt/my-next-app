"use client";

import { useState, useEffect } from "react";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);

  console.log("111111");

  // 获取所有待办事项
  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 创建新待办事项
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTodo.trim(), completed: false }),
      });

      if (res.ok) {
        const todo = await res.json();
        setTodos([todo, ...todos]);
        setNewTodo("");
      }
    } catch (error) {
      console.error("Failed to create todo:", error);
    }
  };

  // 切换完成状态
  const handleToggle = async (id: number, completed: boolean) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });

      if (res.ok) {
        const updated = await res.json();
        setTodos(todos.map((t) => (t.id === id ? updated : t)));
      }
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  // 删除待办事项
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTodos(todos.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-2xl px-4 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            todo
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Next.js + Prisma + SQLite 完整示例
          </p>
        </div>

        {/* 创建表单 */}
        <form onSubmit={handleCreate} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="输入新的待办事项..."
              className="flex-1 px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              添加
            </button>
          </div>
        </form>

        {/* 待办列表 */}
        <div className="space-y-2">
          {loading ? (
            <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
              加载中...
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
              暂无待办事项，添加一个吧！
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo.id, todo.completed)}
                  className="w-5 h-5 rounded border-zinc-300 dark:border-zinc-700"
                />
                <span
                  className={`flex-1 ${
                    todo.completed
                      ? "line-through text-zinc-500 dark:text-zinc-500"
                      : "text-black dark:text-zinc-50"
                  }`}
                >
                  {todo.title}
                </span>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  删除
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
