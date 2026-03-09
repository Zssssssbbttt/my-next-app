// app/users/actions.tsx 接口方法

"use server";

// 获取所有用户信息  app/api/users/route.ts GET
export async function getUserList() {
  console.log('获取用户信息----')
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/users`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
        next: { revalidate: 60 }, // 每60秒重新验证数据
      },
    );

    console.log('获取用户信息----',response)

    if (!response.ok) {
      throw new Error(`获取用户列表失败：${response.status}`);
    }

    const data = await response.json();

    console.log('获取用户信息数据',data)
    return { success: true, data: data.data || data };
  } catch (error) {
    console.error("getUserList error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "获取用户列表失败",
    };
  }
}

// 添加用户信息 app/api/users/route.ts  POST
export async function addUser({
  params,
}: {
  name: string;
  email?: string;
  age?: number;
}) {

  const path = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/users`;

  try {
    const response = await fetch(path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`添加用户失败: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data.data || data };
  } catch (error) {
    console.error("addUser error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "添加用户失败",
    };
  }
}

// 获取单个用户信息 app/api/users/[id]/routes.ts GET
export async function getSingleUser(id: string) {
  try {
    const reponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}}/api/users/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      },
    );

    if (!reponse.ok) {
      throw new Error(`获取单个用户信息失败: ${reponse.status}`);
    }

    const data = await reponse.json();
    return { success: true, data: data.data || data };
  } catch (error) {
    console.error("getSingleUser error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "获取用户信息失败",
    };
  }
}

// 删除单个用户信息 app/api/users/[id]/routes.ts DELETE
export async function deleteSingleUser(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/users/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`删除用户失败: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data.data || data };
  } catch (error) {
    console.error("deleteSingleUser error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "删除用户失败",
    };
  }
}

// 更新用户信息 app/api/users/[id]/routes.ts PATCH
export async function updateSingleUser(
  id: string,
  params: { name?: string; email?: string; age?: number },
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/users/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      },
    );

    if (!response.ok) {
      throw new Error(`更新用户失败: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data.data || data };
  } catch (error) {
    console.error("updateSingleUser error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "更新用户失败",
    };
  }
}
