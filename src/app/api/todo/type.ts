export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateTodoInput {
  title?: string;
  desctiption?: string;
  completed?: boolean;
  dueDate?: string;
}

export const todos: Todo[] = [
  {
    id: "1",
    title: "学习Next.js路由处理器",
    description: "掌握GET、POST、PUT、DELETE方法",
    completed: false,
    dueDate: "2024-03-10",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "创建RESTful API",
    description: "为Todo应用构建完整的API",
    completed: true,
    dueDate: "2024-03-08",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
