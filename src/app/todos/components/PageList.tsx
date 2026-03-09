import { Todo } from "../definitions";
import styles from "./PageList.module.css";
export default function TodosList({ todos }: { todos: Todo[] }) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>代办事项 (共{todos.length}条)</h3>

      <div className={styles.list}>
        {todos.map((todo) => (
          <div className={styles.line} key={todo.id}>
            <p>
              {todo.title}-{todo.describe}-截止日期{todo.deadLine}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
