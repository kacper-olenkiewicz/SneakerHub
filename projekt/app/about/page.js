import Link from "next/link";
import styles from "./page.module.css";
import Image from "next/image";

export default function About() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          About <span className={styles.highlight}>SneakerHub</span>
        </h1>
        <p className={styles.heroText}>
          We are more than just a sneaker store. We are a community of enthusiasts dedicated to bringing you the finest footwear from around the globe.
        </p>
      </section>

      {/* Our Story Section */}
      <section className={styles.storyRow}>
        <div className={styles.storySection}>
          <div className={styles.imageContainer}>
             <Image 
               src="/about/bud.png" 
               alt="Store Interior" 
               fill 
               style={{ objectFit: "cover" }}
             />
          </div>
          <div>
            <h2 className={styles.storyTitle}>Our Story</h2>
            <p className={styles.storyText}>
              Founded in 2023, SneakerHub began with a simple mission: to make exclusive and high-quality sneakers accessible to everyone. What started as a small garage project has grown into a premier destination for sneakerheads and fashion enthusiasts alike.
            </p>
            <p className={styles.storyText}>
              We believe that every pair of shoes tells a story. Whether you&apos;re looking for the latest hype drop, a comfortable pair for your daily commute, or winter-ready boots, we curate our collection with passion and expertise.
            </p>
          </div>
        </div>

        <div className={styles.contactSection}>
          <h2 className={styles.contactTitle}>Get in Touch</h2>
          <p className={styles.contactText}>
            Have questions about a product or your order? Our team is here to help you every step of the way.
          </p>
          <div className={styles.contactGrid}>
              <div className={styles.contactCard}>
                  <div className={styles.contactIcon}></div>
                  <div>
                      <h4 className={styles.contactCardTitle}>Visit Us</h4>
                      <p className={styles.contactCardText}>123 Sneaker Street<br/>Warsaw, PL 00-001</p>
                  </div>
              </div>
              <div className={styles.contactCard}>
                  <div className={styles.contactIcon}></div>
                  <div>
                      <h4 className={styles.contactCardTitle}>Email Us</h4>
                      <p className={styles.contactCardText}>support@sneakerhub.com<br/>partners@sneakerhub.com</p>
                  </div>
              </div>
          </div>
          <Link href="/contact" className={styles.contactButton}>
            Go to Contact Page
          </Link>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.valuesSection}>
        <div className={styles.valuesContainer}>
          <h2 className={styles.valuesTitle}>Why Choose Us?</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}></div>
              <h3 className={styles.valueCardTitle}>Authenticity Guaranteed</h3>
              <p className={styles.valueCardText}>Every pair is verified by our experts to ensure 100% authenticity.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}></div>
              <h3 className={styles.valueCardTitle}>Fast Shipping</h3>
              <p className={styles.valueCardText}>Get your kicks delivered to your doorstep in record time.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}></div>
              <h3 className={styles.valueCardTitle}>Community First</h3>
              <p className={styles.valueCardText}>We prioritize our customers and build lasting relationships.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact preview now sits beside Our Story */}
    </div>
  );
}
