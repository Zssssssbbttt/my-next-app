import styles from "./BlogError.module.css";
import Link from "next/link";

export default function BlogError() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>文章未找到</h1>
        <p className={styles.message}>
          抱歉，你查找的文章可能已被删除或不存在。
        </p>
        <Link href="/blog" className={styles.backLink}>
          ← 返回博客列表
        </Link>
      </div>
    </div>
  );
}
