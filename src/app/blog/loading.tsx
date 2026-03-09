import styles from "./Loading.module.css";

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSkeleton}></div>
        <div className={styles.subtitleSkeleton}></div>
      </div>

      <div className={styles.grid}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.cardSkeleton}>
            <div className={styles.imageSkeleton}></div>
            <div className={styles.contentSkeleton}>
              <div className={styles.lineSkeleton}></div>
              <div className={styles.lineSkeleton}></div>
              <div className={styles.lineSkeletonShort}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
