import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className={styles.videoBackground}
        >
          <source src="/butwid.mp4" type="video/mp4" />
        </video>
        <div className={styles.heroOverlay}></div>
        
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Welcome to <span className={styles.highlight}>SneakerHub</span>
          </h1>
          <p className={styles.description}>
            Discover the latest trends in footwear. From classic sneakers to winter essentials, 
            we bring you premium quality and style.
          </p>
          
          <div className={styles.actions}>
            <Link href="/buy" className={styles.buttonPrimary}>
              Shop Now
            </Link>
            <Link href="/about" className={styles.buttonSecondary}>
              Learn More
            </Link>
          </div>
        </div>
      </section>
      
      
      {/* Categories Section */}
      <section className={styles.categories}>
        <h2 className={styles.sectionTitle}>Our Collections</h2>
        <div className={styles.grid}>
          <Link href="/sneakers" className={styles.card}>
            <div className={styles.cardOverlaySneakers} />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Sneakers</h3>
              <p className={styles.cardText}>Check out our latest collection of sneakers for every style.</p>
              <span className={styles.cardLink}>
                Shop Sneakers &rarr;
              </span>
            </div>
          </Link>

          <Link href="/winter" className={styles.card}>
            <div className={styles.cardOverlayWinter} />
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Winter Collection</h3>
              <p className={styles.cardText}>Stay warm and stylish with our winter footwear selection.</p>
              <span className={styles.cardLink}>
                Shop Winter &rarr;
              </span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
