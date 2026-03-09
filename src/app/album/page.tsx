"use client";
import styles from "./PhotoAlbum.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function PhotoAlbum() {
  const route = useRouter();

  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/albums")
      .then((res) => res.json()) // 3. 解析 JSON
      .then((data) => setAlbums(data))
      .catch((err) => console.error("加载失败:", err))
      .finally(() => setLoading(false));
  }, []);

  const toDetail = (albumId: number) => {
    route.push(`/album/${albumId}`);
    console.log(albumId);
  };

  return (
    <div className={styles.container}>
      <h1>相册列表</h1>

      <div className={styles.albumList}>
        <ul className={styles.albumUl}>
          {albums.map((album:any) => (
            <li key={album.id} onClick={() => toDetail(album.id)}>
              <p>{album.title}</p>
             <Image
                width={300}
                height={200}
                src={`https://picsum.photos/id/${album.id}/400/300`}
                alt={album.title}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
