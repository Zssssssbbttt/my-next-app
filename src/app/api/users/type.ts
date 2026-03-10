// /api/user type -类型

export interface User {
  id: string;
  name: string;
  age: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUser {
  name?: string;
  age:string,
  email?:string,
  desctiption?: string;
  completed?: boolean;
  dueDate?: string;
}


export const userList: User[] = [];
