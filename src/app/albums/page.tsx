import Link from "next/link";
import Image from "next/image";
import styles from "./Albums.module.css";

type Album = { id: number; title: string; userId: number };
type Photo = {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

async function getData() {
  const [albumsRes, photosRes] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/albums", {
      next: { revalidate: 60 },
    }),
    fetch("https://jsonplaceholder.typicode.com/photos", {
      next: { revalidate: 60 },
    }),
  ]);

  if (!albumsRes.ok || !photosRes.ok) {
    throw new Error("无法获取相册数据");
  }

  const albums: Album[] = await albumsRes.json();
  const photos: Photo[] = await photosRes.json();

  const counts = photos.reduce<Record<number, number>>((acc, p) => {
    acc[p.albumId] = (acc[p.albumId] || 0) + 1;
    return acc;
  }, {});

  return { albums, counts };
}

export default async function AlbumsPage() {
  const { albums, counts } = await getData();

  return (
    <div className={styles.container}>
      <h1>相册列表</h1>
      <ul className={styles.albumGrid}>
        {albums.map((album) => (
          <li key={album.id} className={styles.albumItem}>
            <Link href={`/albums/${album.id}`} className={styles.link}>
              <Image
                src={`https://picsum.photos/id/${(album.id % 100) + 1}/400/300`}
                width={400}
                height={300}
                alt={album.title}
                className={styles.cover}
                priority={false}
              />
              <div className={styles.meta}>
                <h2 className={styles.title}>{album.title}</h2>
                <span className={styles.count}>
                  {counts[album.id] ?? 0} 张照片
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
