// 页面 拼接 添加 删除等
import styles from "./TodosPage.module.css";
import TodoList from "./components/PageList.tsx";
import { todos } from "./definitions";
import TodoForm from "./components/PageForm.tsx";

export default function TodosPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Todos Page</h1>
      
      <TodoForm />

      {todos.length ? (
        <TodoList todos={todos} />
      ) : (
        <div>暂无数据，添加一条吧.....</div>
      )}
    </div>
  );
}
