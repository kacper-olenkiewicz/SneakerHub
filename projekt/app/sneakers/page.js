
"use client";

import styles from "./page.module.css";
import Image from "next/image";

const sneakerProducts = [
  {
    id: 1,
    name: "Air Max Pulse",
    price: 149.99,
    image: "/sneakers/1.jpg",
    description: "Iconic style meets modern comfort"
  },
  {
    id: 2,
    name: "Jordan Retro High",
    price: 199.99,
    image: "/sneakers/2.jpg",
    description: "The legend returns"
  },
  {
    id: 3,
    name: "Dunk Low Retro",
    price: 119.99,
    image: "/sneakers/3.jpg",
    description: "Classic hoops style"
  },
  {
    id: 4,
    name: "Urban Street",
    price: 129.99,
    image: "/sneakers/4.jpg",
    description: "Everyday urban essential"
  },
  {
    id: 5,
    name: "Speed Runner",
    price: 159.99,
    image: "/sneakers/5.jpg",
    description: "Performance running shoe"
  },
  {
    id: 6,
    name: "Court Vision",
    price: 89.99,
    image: "/sneakers/6.jpg",
    description: "Retro basketball look"
  }
];

export default function Sneakers() {
  const handleAddToCart = (productName) => {
    alert(`Added ${productName} to cart!`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Sneaker <span className={styles.highlight}>Collection</span>
        </h1>
        <p className={styles.subtitle}>
          Step up your game with our latest arrivals. 
          From classic retros to modern performance, find your perfect pair.
        </p>
      </header>

      <div className={styles.grid}>
        {sneakerProducts.map((product) => (
          <div key={product.id} className={styles.card}>
            <div className={styles.imageContainer}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
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
