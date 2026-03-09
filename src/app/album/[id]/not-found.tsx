import styles from "./NotFound.module.css";
import Link from "next/link";

export default function BlogError() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>相册未找到</h1>
        <p className={styles.message}>
          抱歉，你查找的相册可能已被删除或不存在。
        </p>
        <Link href="/album" className={styles.backLink}>
          ← 返回相册列表
        </Link>
      </div>
    </div>
  );
}
