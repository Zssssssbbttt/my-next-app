"use client";

import Link from "next/link";
import styles from "./Error.module.css";

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
        <h1 className={styles.errorTitle}>加载失败</h1>
        <p className={styles.message}>{error?.message ?? "获取相册数据失败"}</p>
      </div>
      <div className={styles.action}>
        <button onClick={reset} className={styles.retryButton}>
          重试
        </button>
        <Link href="/albums" className={styles.homeButton}>
          返回相册列表
        </Link>
      </div>
    </div>
  );
}
