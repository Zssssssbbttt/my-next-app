"use client";
import Image from "next/image";
import styles from "./Products.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { products } from "./data";

export default function Products() {
  const router = useRouter();

  const toDetail = (id: string) => {
    // 跳转到详id情页
    console.log(id);
    router.push(`/products/${id}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>产品列表</h1>

      <div className={styles.grid}>
        {products.map((product) => (
          <div
            key={product.id}
            className={styles.card}
            // onClick={() => {
            //   toDetail(product.id);
            // }}
          >
            <Image
              src={product.image}
              alt={product.name}
              width={400}
              height={300}
            />
            <h2 className={styles.productName}>{product.name}</h2>
            <p className={styles.productPrice}>¥{product.price}</p>
            <Link href={`/products/${product.id}`}>查看详情</Link>
          </div>
        ))}
      </div>

      <Link href="/products">回到首页</Link>
    </div>
  );
}
