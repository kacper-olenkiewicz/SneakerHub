import Link from "next/link";
import styles from "./footer.module.css";

const navLinks = [
  { href: "/buy", label: "All Products" },
  { href: "/sneakers", label: "Sneakers" },
  { href: "/winter", label: "Winter" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <p className={styles.brand}>SneakerHub</p>
          <p className={styles.text}>
            Premium sneakers and winter footwear curated with passion for style
            and performance.
          </p>
        </div>

        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.meta}>
          <p className={styles.text}>hello@sneakerhub.com</p>
          <p className={styles.text}>
            © {new Date().getFullYear()} SneakerHub. All rights reserved.
          </p>
          <div className={styles.socials}>
            <span aria-label="Visit our Facebook" title="Facebook">FB</span>
            <span aria-label="Visit our Instagram" title="Instagram">IG</span>
            <span aria-label="Visit our Twitter" title="Twitter">TW</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
