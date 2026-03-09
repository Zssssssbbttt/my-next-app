// app/blog/[id]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./BlogPost.module.css";
import CommentList from "../component/CommentList";
import { comments } from "../definitions";
import CommentForm from "../component/CommentForm";

// 获取单篇文章
async function getPost(id: string) {
  console.log("博客详情id", id);
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return null; // 返回null，触发notFound
  }

  return res.json();
}

// 获取当前文章的评论
async function getCommentsForPost(postId: string): Promise<Comments[]> {
  return comments.filter((comment) => comment.postId === postId);
}

// 获取用户信息
async function getUser(userId: number) {
  console.log("获取用户信息，userId:", userId);
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
    {
      cache: "force-cache",
    },
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

// 生成metadata
export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return {
      title: "文章未找到",
    };
  }

  return {
    title: post.title,
    description: post.body.slice(0, 150),
  };
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound(); // 触发404
  }

  const [user, comments] = await Promise.all([
    getUser(post.userId),
    getCommentsForPost(id),
  ]);



  return (
    <article className={styles.container}>
      {/* 返回链接 */}
      <div className={styles.backLink}>
        <Link href="/blog">← 返回博客列表</Link>
      </div>

      {/* 文章头部 */}
      <header className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>

        <div className={styles.meta}>
          {user && (
            <div className={styles.author}>
              <strong>作者：</strong> {user.name}
            </div>
          )}
          <div className={styles.stats}>
            <span>💬 {comments.length} 条评论</span>
          </div>
        </div>
      </header>

      {/* 特色图片 */}
      <div className={styles.featuredImage}>
        <Image
          src={`https://picsum.photos/800/400?random=${post.id}`}
          alt={post.title}
          width={800}
          height={400}
          className={styles.image}
          priority
        />
      </div>

      {/* 文章内容 */}
      <div className={styles.content}>
        <p className={styles.body}>{post.body}</p>
        <p className={styles.body}>{post.body}</p>
        <p className={styles.body}>{post.body}</p>
      </div>

      {/* 评论区 */}
      <section className={styles.comments}>
        <CommentForm postId={id} />
        <CommentList comments={comments} postId={id} />
      </section>
    </article>
  );
}
