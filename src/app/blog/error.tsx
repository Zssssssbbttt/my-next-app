"use client";

import styles from "./Error.module.css";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.errorContent}>
        <h1 className={styles.errorTitle}>页面出错了</h1>
        <p className={styles.message}>
          {error.message || "加载博客列表出现问题"}
        </p>
      </div>

      <div className={styles.action}>
        <button onClick={reset} className={styles.retryButton}>
          重试
        </button>
        <Link href="/blog" className={styles.homeButton}>
          返回首页
        </Link>
      </div>
    </div>
  );
}
