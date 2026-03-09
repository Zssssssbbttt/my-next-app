import styles from "./AlbumLoading.module.css";
export default function AlbumLoading() {
  return (
    <div className={styles.container}>
      <div className={styles.albumList}>
        <ul className={styles.albumUl}>
          {[...Array(10)].map((_, i) => (
            <li key={i} className={styles.albumItem}>
              <div className={styles.albumImagePlaceholder}></div>
              <p className={styles.albumTitlePlaceholder}></p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
