// export const metadata = {
//   title:'这是一个博客'
// }

import styles from "./Blog.module.css";
import { blogPosts } from "./data";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "博客列表",
  description: "这是我的博客列表页面",
};

interface Post {
  id: number;
  title: string;
  body: string;
  useId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

// 获取文章列表
async function getPosts() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    next: {
      revalidate: 3600,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

// 获取用户信息（用于展示作者）
async function getUser(userId: number): Promise<User> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
    {
      cache: "force-cache", // 用户信息变化少，可以缓存
    },
  );

  if (!res.ok) {
    throw new Error(`获取用户${userId}失败`);
  }

  return res.json();
}

export default async function Blog() {
  const posts = await getPosts();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>博客列表</h1>
      <p className={styles.subtitle}>最新文章</p>

      <div className={styles.grid}>
        {posts.map(async (post) => {
          const user = await getUser(post.userId);
          return (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className={styles.cardLink}
            >
              <article className={styles.card}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={`https://picsum.photos/400/300?random=${post.id}`}
                    alt={post.title}
                    width={400}
                    height={300}
                    className={styles.image}
                  />
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// export default function Blog() {
//   return (
//     <div className={styles.container}>
//       <h1 className={styles.title}>技术博客</h1>
//       <div className={styles.posts}>
//         {blogPosts.map((post) => (
//           <article key={post.id}>
//             <h2>
//               <Link href={`/blog/${post.slug}`}>{post.title}</Link>
//             </h2>

//             <span>{post.date}</span>
//             <span className={styles.meta}>{post.author}</span>

//             <p className={styles.excerpt}>{post.excerpt}</p>

//             <Link href={`/blog/${post.slug}`}>阅读更多</Link>
//           </article>
//         ))}
//       </div>
//     </div>
//   );
// }
