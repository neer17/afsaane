import Image from 'next/image';
import styles from './page.module.css';
import RootLayout from './layout';

export default function Home() {
  return (
    <div className={styles.page}>
      <main style={{
        width: '100%',
        height: '100%',
      }}></main>
    </div>
  );
}
