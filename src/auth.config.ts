// auth.config.ts

import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

interface USERTYPE {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export const users: USERTYPE[] = [
  {
    id: "1",
    name: "张三",
    email: "zhangsan@example.com",
    password: "123456", // 实际项目应该是加密的
    role: "admin",
  },
  {
    id: "2",
    name: "李四",
    email: "lisi@example.com",
    password: "123456",
    role: "user",
  },
];

export const authConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials: { email: string; password: string }) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = users.find((user) => user.email === credentials.email);

        // 验证密码
        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }

        return null;
      },
    }),

    // github 认证
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  // 添加 secret（虽然通常从环境变量读取）
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  // 开启调试模式，方便排查问题
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;
