
"use client";

import styles from "./page.module.css";
import Image from "next/image";

const winterProducts = [
  {
    id: 1,
    name: "Arctic Explorer",
    price: 189.99,
    image: "/winter/1.jpg",
    description: "Extreme cold weather protection"
  },
  {
    id: 2,
    name: "Snow Trekker Pro",
    price: 229.99,
    image: "/winter/2.jpg",
    description: "Waterproof hiking boots"
  },
  {
    id: 3,
    name: "Glacier Runner",
    price: 159.99,
    image: "/winter/3.jpg",
    description: "Lightweight winter performance"
  },
  {
    id: 4,
    name: "Frost Guard Elite",
    price: 199.99,
    image: "/winter/4.jpg",
    description: "Thermal insulated comfort"
  },
  {
    id: 5,
    name: "Alpine Summit",
    price: 249.99,
    image: "/winter/5.jpg",
    description: "Professional mountaineering grade"
  }
];

export default function Winter() {
  const handleAddToCart = (productName) => {
    alert(`Added ${productName} to cart!`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Winter <span className={styles.highlight}>Collection</span>
        </h1>
        <p className={styles.subtitle}>
          Conquer the elements with our premium selection of winter footwear. 
          Designed for warmth, durability, and style.
        </p>
      </header>

      <div className={styles.grid}>
        {winterProducts.map((product) => (
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
