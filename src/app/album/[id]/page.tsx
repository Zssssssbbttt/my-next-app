import { notFound } from "next/navigation";
import styles from "./PhotoDetail.module.css";
import Image from "next/image";

// 定义类型（可选，但推荐）
interface Photo {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

// 获取图片相册详细信息
async function getAlbum(id: string): Promise<Photo[] | null> {
  try {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/albums/${id}/photos`,
      {
        // 服务器端fetch配置
        cache: "no-store", // 开发阶段使用no-store避免缓存
        // 如果需要 ISR 或静态生成，可以使用以下配置：
        // next: { revalidate: 3600 } // 每小时重新验证
      },
    );

    if (!res.ok) {
      console.error(`API请求失败: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("获取相册数据失败:", error);
    return null;
  }
}

// 使用真实的图片服务（Lorem Picsum）
function getRealImageUrl(photoId: number): string {
  // 使用photoId作为种子，确保同一张照片显示相同图片
  // 限制id范围在1-100之间
  const imageId = (photoId % 100) + 1;
  return `https://picsum.photos/id/${imageId}/400/300`;
}

export default async function AlbumDetail({
  params,
}: {
  params: { id: string };
}) {
  // 在Next.js 15中，params需要await
  const { id } = await params;

  // 服务器端获取数据
  const photos = await getAlbum(id);

  // 如果获取数据失败或没有照片，返回404
  if (!photos || photos.length === 0) {
    notFound();
  }

  // 直接返回JSX - 这是服务器组件渲染的部分
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>相册详情 - Album {id}</h1>
      <div className={styles.content}>
        <p className={styles.photoCount}>共 {photos.length} 张照片</p>
        <ul className={styles.photoList}>
          {photos.map((photo) => (
            <li key={photo.id} className={styles.photoItem}>
              <div className={styles.imageWrapper}>
                <Image
                  src={getRealImageUrl(photo.id)}
                  width={200}
                  height={200}
                  alt={photo.title}
                  className={styles.image}
                  // 优化图片加载
                  priority={photo.id <= 4} // 前4张图片优先加载
                  loading={photo.id > 4 ? "lazy" : undefined}
                />
              </div>
              <p className={styles.photoTitle}>{photo.title}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
