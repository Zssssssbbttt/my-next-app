// app/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  getUserList,
  addUser,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
} from "./actions";

// 定义用户类型
interface User {
  id: string | number;
  name: string;
  email?: string;
  age?: number;
  createdAt?: string;
}

// 定义操作日志类型
interface OperationLog {
  id: string;
  operation: string;
  username?: string;
  timestamp: string;
  status: "success" | "error";
  details?: string;
}

// 定义请求记录（用于速率限制）
interface RequestRecord {
  count: number;
  firstRequestTime: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 表单状态
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
  });

  // 添加操作日志
  const addLog = (
    operation: string,
    status: "success" | "error",
    username?: string,
    details?: string,
  ) => {
    const newLog: OperationLog = {
      id: Date.now().toString(),
      operation,
      username,
      timestamp: new Date().toLocaleString(),
      status,
      details,
    };
    setLogs((prev) => [newLog, ...prev].slice(0, 50)); // 只保留最近50条日志
  };

  // 处理表单输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 重置表单
  const resetForm = () => {
    setFormData({ name: "", email: "", age: "" });
    setEditingUser(null);
    setShowForm(false);
  };

  // 编辑用户
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email || "",
      age: user.age?.toString() || "",
    });
    setShowForm(true);
  };

  // 提交表单（添加或更新）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("请输入用户名");
      return;
    }

    // 检查速率限制
    if (!checkRateLimit(editingUser ? "updateUser" : "addUser")) {
      alert("请求过于频繁，请稍后再试");
      return;
    }

    const params = {
      name: formData.name,
      ...(formData.email && { email: formData.email }),
      ...(formData.age && { age: parseInt(formData.age) }),
    };

    let result;
    if (editingUser) {
      // 更新用户
      result = await updateSingleUser(editingUser.id.toString(), params);
      addLog("更新用户", result.success, formData.name, result.error);
    } else {
      // 添加用户
      result = await addUser({ params });
      addLog("添加用户", result.success, formData.name, result.error);
    }

    if (result.success) {
      alert(editingUser ? "更新成功！" : "添加成功！");
      resetForm();
      fetchUsers(); // 刷新列表
    } else {
      alert(result.error || (editingUser ? "更新失败" : "添加失败"));
    }
  };

  // 删除用户（仅管理员）
  const handleDeleteUser = async (user: User) => {
    if (!isAdmin) {
      alert("只有管理员才有删除权限！");
      return;
    }

    if (!confirm(`确定要删除用户 ${user.name} 吗？`)) {
      return;
    }

    // 检查速率限制
    if (!checkRateLimit("deleteUser")) {
      alert("请求过于频繁，请稍后再试");
      return;
    }

    const result = await deleteSingleUser(user.id.toString());
    addLog("删除用户", result.success, user.name, result.error);

    if (result.success) {
      alert("删除成功！");
      fetchUsers(); // 刷新列表
    } else {
      alert(result.error || "删除失败");
    }
  };

  // 权限状态（模拟管理员权限）
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  // 操作日志
  const [logs, setLogs] = useState<OperationLog[]>([]);

  // 速率限制（每个IP每分钟最多10个请求）
  const [requestCounts, setRequestCounts] = useState<
    Record<string, RequestRecord>
  >({});
  const MAX_REQUESTS_PER_MINUTE = 10;

  // 检查速率限制
  const checkRateLimit = (operation: string): boolean => {
    const now = Date.now();
    const key = `${operation}_${Math.random()}`; // 实际应用中应该使用用户IP或ID

    setRequestCounts((prev) => {
      const newCounts = { ...prev };

      // 清理超过1分钟的记录
      Object.keys(newCounts).forEach((k) => {
        if (now - newCounts[k].firstRequestTime > 60000) {
          delete newCounts[k];
        }
      });

      // 检查当前操作
      if (newCounts[key]) {
        if (newCounts[key].count >= MAX_REQUESTS_PER_MINUTE) {
          return prev; // 超过限制
        }
        newCounts[key].count++;
      } else {
        newCounts[key] = { count: 1, firstRequestTime: now };
      }

      return newCounts;
    });

    return true;
  };

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    // 检查速率限制
    if (!checkRateLimit("getUserList")) {
      setError("请求过于频繁，请稍后再试");
      setLoading(false);
      return;
    }

    const result = await getUserList();

    // 添加操作日志
    addLog("获取用户列表", result.success, undefined, result.error);

    if (result.success) {
      setUsers(result.data.users || []);
    } else {
      setError(result.error || "获取用户列表失败");
    }
    setLoading(false);
  };

  // 初始加载
  useEffect(() => {
    fetchUsers();
  }, []);

  // 管理员登录
  const handleAdminLogin = () => {
    // 简单示例：密码是 "admin123" 就认为是管理员
    if (adminPassword === "admin123") {
      setIsAdmin(true);
      addLog("管理员登录", "success", "admin");
      alert("管理员登录成功！");
    } else {
      addLog("管理员登录", "error", undefined, "密码错误");
      alert("密码错误！");
    }
    setAdminPassword("");
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">用户管理系统</h1>

      {/* 管理员登录区域 */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">管理员登录</h2>
        <div className="flex gap-2">
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            placeholder="请输入管理员密码 (admin123)"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={handleAdminLogin}
            className="px-4 py-2 bg-blue-500 text-blue rounded hover:bg-blue-600"
          >
            登录
          </button>
        </div>
        {isAdmin && (
          <p className="text-green-600 mt-2">
            ✓ 当前为管理员模式，拥有删除权限
          </p>
        )}
      </div>

      {/* 添加用户按钮 */}
      <div className="mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-500 text-blue rounded hover:bg-green-600"
        >
          {showForm ? "取消" : "添加新用户"}
        </button>
      </div>

      {/* 添加/编辑用户表单 */}
      {showForm && (
        <div className="mb-6 p-4 border rounded bg-white">
          <h2 className="text-lg font-semibold mb-4">
            {editingUser ? "编辑用户" : "添加新用户"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">姓名 *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">邮箱</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">年龄</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-blue rounded hover:bg-blue-600"
              >
                {editingUser ? "更新" : "添加"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 用户列表 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">用户列表</h2>
        {loading ? (
          <p>加载中...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : users.length === 0 ? (
          <p>暂无用户数据</p>
        ) : (
          <div className="grid gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-4 border rounded flex items-center justify-between"
              >
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  {user.email && <p className="text-sm">邮箱：{user.email}</p>}
                  {user.age && <p className="text-sm">年龄：{user.age}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    disabled={!isAdmin}
                    className={`px-3 py-1 rounded ${
                      isAdmin
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 操作日志 */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">操作日志</h2>
        <div className="bg-gray-900 text-gray-100 p-4 rounded h-64 overflow-y-auto font-mono text-sm">
          {logs.length === 0 ? (
            <p className="text-gray-500">暂无操作记录</p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className={`mb-2 ${
                  log.status === "success" ? "text-green-400" : "text-red-400"
                }`}
              >
                <span className="text-gray-500">[{log.timestamp}]</span>{" "}
                <span className="font-semibold">{log.operation}</span>
                {log.username && <span> - 用户：{log.username}</span>}
                {log.details && (
                  <span className="text-gray-400"> - {log.details}</span>
                )}
                <span className="ml-2">
                  {log.status === "success" ? "✓" : "✗"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 刷新按钮 */}
      <div className="mt-4 text-center">
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          刷新列表
        </button>
      </div>
    </div>
  );
}
