import { blogPosts } from "../data";
import { notFound } from "next/navigation";
import styles from "./BlogSlug.module.css";
import Link from "next/link";

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  console.log(slug, "11111");
  const post = blogPosts.find((p:any) => p.slug === slug);

  return (
    <div>
      <article className={styles.container}>
        <h1 className={styles.title}>{post?.title}</h1>

        <div className={styles.content}>
          {post?.content.split("\n").map((paragraph:string, index:number) => {
            // 简单的Markdown解析（实际项目可用marked等库）
            if (paragraph.startsWith("## ")) {
              return (
                <h2 key={index} className={styles.subtitle}>
                  {paragraph.slice(3)}
                </h2>
              );
            } else if (paragraph.startsWith("### ")) {
              return (
                <h3 key={index} className={styles.subtitle3}>
                  {paragraph.slice(4)}
                </h3>
              );
            } else if (paragraph.startsWith("- ")) {
              return (
                <li key={index} className={styles.listItem}>
                  {paragraph.slice(2)}
                </li>
              );
            } else if (paragraph.trim()) {
              return (
                <p key={index} className={styles.paragraph}>
                  {paragraph}
                </p>
              );
            }
            return null;
          })}
        </div>

        <div className={styles.footer}>
            <Link href='/blog' className={styles.backLink}>返回博客列表</Link>
        </div>
      </article>
    </div>
  );
}

// 生成所有可能的slug（预渲染用）
export async function generateStaticParams() {
  return blogPosts.map(post => ({
    slug: post.slug,
  }))
}
