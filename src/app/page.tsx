import Image from "next/image";
import styles from "./page.module.css";
import Banner from "@/components/banner/Banner";
import Card from "@/components/card/Card";
import CoupleCards from "@/components/couple_cards/CoupleCards";
import DetailCard from "@/components/detail_card/DetailCard";
import Footer from "@/components/footer/Footer";
import ScrollingText from "@/components/scrolling_banner/ScrollingBanner";
import { images } from "@/utils/constants";
// import SyncedCarousels from "@/components/carousels/SyncedCarousels";

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.textContainer}>
          <span>Long heading about the product</span>
          <span>
            Long description about the product. Long description about the
            product.
          </span>
        </div>
        <Image
          className={styles.heroImage}
          width={0}
          height={0}
          src="https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=1440&h=1440&dpr=2"
          alt="Latest Jewellery Collection"
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </section>

      <section>{/* <SyncedCarousels/> */}</section>

      {/* Favorites section */}
      <section className={styles.bestSellersSection}>
        <Banner title="a few of our" description="Favorites" />

        <div className={styles.cardsContainer}>
          {images.map((value) => (
            <Card
              key={value}
              productDescription="SeggsY tshirt"
              price={1000}
              sizes="20vw"
              imageName="Image name"
              imageSrc={value}
            />
          ))}
        </div>
      </section>

      {/* Variety Section */}
      <section className={styles.varietySection}>
        <CoupleCards
          image="https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800"
          altText="Product Variety 1"
          texts={[
            "Where function meets family",
            "The Double Diaper Backpack and Tote",
            "With separate compartments for you and baby, a changing pad, and stroller straps, we’ve taken care of the details so you can focus on the journey ahead without a fuss. Shop online now and available in store 12/15.",
            "Shop Now",
          ]}
        />
        <CoupleCards
          image="https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800"
          altText="Product Variety 1"
          texts={[
            "Where function meets family",
            "The Double Diaper Backpack and Tote",
            "With separate compartments for you and baby, a changing pad, and stroller straps, we’ve taken care of the details so you can focus on the journey ahead without a fuss. Shop online now and available in store 12/15.",
            "Shop Now",
          ]}
          doReverse
        />
        <CoupleCards
          image="https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800"
          altText="Product Variety 1"
          texts={[
            "Where function meets family",
            "The Double Diaper Backpack and Tote",
            "With separate compartments for you and baby, a changing pad, and stroller straps, we’ve taken care of the details so you can focus on the journey ahead without a fuss. Shop online now and available in store 12/15.",
            "Shop Now",
          ]}
        />
      </section>

      {/* Gifts Section */}
      <section className={styles.giftsSection}>
        <Banner title="Mini reasons to" description="Gift Away" />
        <div className={styles.giftsCardsContainer}>
          {[1, 2, 3].map((value) => (
            <DetailCard
              key={value}
              imageSrc="https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=1440&h=1440&dpr=2"
              title="Small Leather Gifts"
              description="Our accessories are as stylish as they are functional—just another reason to gift Away."
            />
          ))}
        </div>
      </section>

      {/* Shipping Info Section */}
      <section className={styles.shippingInfoSection}>
        <span>
          Free shipping on all luggage. Designed by travelers, for travelers.
        </span>
        <span>
          We want you to love everything about getting Away—which is why we
          offer free returns and exchanges on unused items for the first 100
          days.
        </span>
        <span>Exclusions apply. Learn more</span>
      </section>

      {/* Scrolling Section */}
      <section>
        <ScrollingText />
      </section>

      {/* Footer Section */}
      <section>
        <Footer />
      </section>
    </div>
  );
}
