import Image from 'next/image';
import styles from './page.module.css';
import RootLayout from './layout';

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.heroContainer}>
        <div className={styles.textContainer}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae ut nobis repellendus accusamus obcaecati
          reprehenderit adipisci, esse ea. Omnis magnam iure mollitia repellat, nisi eligendi accusantium! Error similique
          vel facilis.
        </div>
        <Image
          className={styles.heroImage}
          width={0}
          height={0}
          src="https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Latest Jewellery Collection"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </section>
    </div>
  );
}
