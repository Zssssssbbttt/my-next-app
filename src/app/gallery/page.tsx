import Image from "next/image";
import styles from "./Gallery.module.css";
import {getSessionServer} from 'next-auth'
import { redirect } from "next/navigation";
import { Link } from "next/link";
import { authConfig } from "@/auth.config";
import {LogoutButton} from './component/LogOut'


export default async function Gallery() {

    const session = await getSessionServer(authConfig)

    if(!Session.user){
        redirect('/login')
    }



    const data = [
        { id: 1, title: "图片1", src: "/image/USD.png" },
        {id:2,title:"兔子2",src:"/image/Rabbit.jpg"}
    ]

    return(
        <div className='styles.container'>

             <LogoutButton />

            <h1 className={styles.title}>图片画廊</h1>

            <div className={styles.grid}>
                {data.map((image)=>(
                    <div key={image.id} className={styles.card}>
            <div className={styles.imageWrapper}>

                <Image src={image.src} alt={image.title} width={300} height={200} 
                priority={image.id === 1} 
                quality={60} />
            </div>
            <p className={styles.caption}>图片 {image.id}</p>
            </div>
                ))}
                <div/>
        </div>
        </div>
    )
}