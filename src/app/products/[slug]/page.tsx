import { products } from "../data";
import styles from "./Detail.module.css";
import Image from "next/image";
import Link from "next/link";
export default async function ProductDetail({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  console.log(slug, 111);
  const data = products.find((item) => item.id === Number(slug));
  if (!data) {
    return <div>没有找到相关产品</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/products">返回列表</Link>
      </div>

      <div className={styles.detail}>
        <div className={styles.imageWrapper}>
          <Image
            src={data.image}
            alt={data.name}
            width={600}
            height={400}
            className={data.image}
            priority
          />
        </div>

        <div className={styles.info}>
          <h1>{data.name}</h1>
          <p className={styles.price}>¥{data.price.toLocaleString()}</p>
          <p className={styles.description}>{data.description}</p>
        </div>
      </div>
    </div>
  );
}
