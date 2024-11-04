import Image from 'next/image';
import styles from './page.module.css';
import Banner from '@/components/banner/banner';
import Card from '@/components/card/card';
import CoupleCards from '@/components/couple_cards/coupleCards';

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
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

      {/* Favorites section */}
      <section className={styles.bestSellersSection}>
        <Banner title="a few of our" description="Favorites" />

        <div className={styles.cardsContainer}>
          {[
            { title: 'The Bigger Carry-On', price: 2400 },
            { title: 'The Bigger Carry-On', price: 2400 },
            { title: 'The Bigger Carry-On', price: 2400 },
            { title: 'The Bigger Carry-On', price: 2400 },
          ].map(({ title, price }) => (
            <Card key={title} productDescription={title} price={price} />
          ))}
        </div>
      </section>

      <section className={styles.varietySection}>
        <CoupleCards
          image="https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800"
          altText="Product Variety 1"
          texts={[
            'Where function meets family',
            'The Double Diaper Backpack and Tote',
            'With separate compartments for you and baby, a changing pad, and stroller straps, we’ve taken care of the details so you can focus on the journey ahead without a fuss. Shop online now and available in store 12/15.',
            'Shop Now',
          ]}
        />
        <CoupleCards
          image="https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800"
          altText="Product Variety 1"
          texts={[
            'Where function meets family',
            'The Double Diaper Backpack and Tote',
            'With separate compartments for you and baby, a changing pad, and stroller straps, we’ve taken care of the details so you can focus on the journey ahead without a fuss. Shop online now and available in store 12/15.',
            'Shop Now',
          ]}
          doReverse
        />
        <CoupleCards
          image="https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800"
          altText="Product Variety 1"
          texts={[
            'Where function meets family',
            'The Double Diaper Backpack and Tote',
            'With separate compartments for you and baby, a changing pad, and stroller straps, we’ve taken care of the details so you can focus on the journey ahead without a fuss. Shop online now and available in store 12/15.',
            'Shop Now',
          ]}
        />
      </section>
    </div>
  );
}
