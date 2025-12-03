"use client";

import styles from "./page.module.css";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Air Max Pulse",
    price: 149.99,
    category: "sneaker",
    image: "/sneakers/1.jpg"
  },
  {
    id: 2,
    name: "Winter Trekker X",
    price: 189.99,
    category: "winter",
    image: "/winter/1.jpg"
  },
  {
    id: 3,
    name: "Jordan Retro High",
    price: 199.99,
    category: "sneaker",
    image: "/sneakers/2.jpg"
  },
  {
    id: 4,
    name: "Arctic Boot Pro",
    price: 229.99,
    category: "winter",
    image: "/winter/2.jpg"
  },
  {
    id: 5,
    name: "Dunk Low Retro",
    price: 119.99,
    category: "sneaker",
    image: "/sneakers/3.jpg"
  },
  {
    id: 6,
    name: "Snow Runner 2025",
    price: 159.99,
    category: "winter",
    image: "/winter/3.jpg"
  },
  {
    id: 7,
    name: "Urban Street",
    price: 129.99,
    category: "sneaker",
    image: "/sneakers/4.jpg"
  },
  {
    id: 8,
    name: "Glacier Hike",
    price: 209.99,
    category: "winter",
    image: "/winter/4.jpg"
  }
];

export default function Buy() {
  const handleAddToCart = (productName) => {
    alert(`Added ${productName} to cart!`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        All <span className={styles.highlight}>Products</span>
      </h1>
      
      <div className={styles.grid}>
        {products.map((product) => (
          <div key={product.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <Image 
                src={product.image} 
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <span className={`${styles.badge} ${product.category === 'sneaker' ? styles.badgeSneaker : styles.badgeWinter}`}>
                {product.category}
              </span>
            </div>
            
            <div className={styles.content}>
              <h2 className={styles.productName}>{product.name}</h2>
              <p className={styles.productPrice}>${product.price}</p>
              
              <button 
                className={styles.addToCartButton}
                onClick={() => handleAddToCart(product.name)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
