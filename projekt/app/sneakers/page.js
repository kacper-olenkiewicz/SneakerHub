"use client";

import styles from "./page.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { addProductToCart, getCartReservations, getProductStockKey } from "../../lib/cartStorage";
import defaultProducts from "../../lib/defaultProducts";

const normalizeCategory = (category) => {
  const value = typeof category === 'string' ? category.toLowerCase() : '';
  if (value.includes('winter')) return 'winter';
  return 'sneakers';
};

const resolveStockCount = (product) => {
  const raw = Number(product?.stock ?? 0);
  if (!Number.isFinite(raw) || raw < 0) {
    return 0;
  }
  return raw;
};

export default function Sneakers() {
  const [feedback, setFeedback] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reservations, setReservations] = useState({});

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to load products');
        }
        const data = await response.json();
        setProducts(Array.isArray(data) && data.length ? data : defaultProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts(defaultProducts);
        setFeedback({ type: 'error', message: 'Showing default sneakers while offline.' });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const syncReservations = () => {
      setReservations(getCartReservations());
    };

    syncReservations();
    window.addEventListener('cart-updated', syncReservations);
    return () => {
      window.removeEventListener('cart-updated', syncReservations);
    };
  }, []);

  const sneakerProducts = products.filter(
    (product) => normalizeCategory(product.category) === 'sneakers'
  );

  const handleAddToCart = (product) => {
    const stockCount = resolveStockCount(product);
    const stockKey = getProductStockKey(product);
    const alreadyReserved = stockKey ? (reservations[stockKey] ?? 0) : 0;
    if (stockCount - alreadyReserved <= 0) {
      setFeedback({ type: 'error', message: 'This sneaker is sold out right now.' });
      return;
    }

    const result = addProductToCart(product);

    if (!result.success) {
      let message = 'Could not add product to cart. Please try again.';
      if (result.reason === 'NOT_AUTHENTICATED') {
        message = 'Please log in to add products to your cart.';
      } else if (result.reason === 'OUT_OF_STOCK') {
        message = 'This sneaker is no longer available.';
      }
      setFeedback({ type: 'error', message });
      return;
    }

    setFeedback({ type: 'success', message: `${product.name} added to your cart.` });
    setReservations(getCartReservations());
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

      {feedback && (
        <div
          className={`${styles.feedback} ${
            feedback.type === 'error' ? styles.feedbackError : styles.feedbackSuccess
          }`}
        >
          {feedback.message}
        </div>
      )}

      {loading && (
        <div className={styles.feedback}>Loading sneakers...</div>
      )}

      <div className={styles.grid}>
        {!loading && sneakerProducts.length === 0 && (
          <div className={styles.feedback}>No sneakers found. Add some from the worker panel.</div>
        )}

        {sneakerProducts.map((product) => {
          const stockCount = resolveStockCount(product);
          const stockKey = getProductStockKey(product);
          const reservedAmount = stockKey ? (reservations[stockKey] ?? 0) : 0;
          const availableStock = Math.max(0, stockCount - reservedAmount);
          const inStock = availableStock > 0;
          return (
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
              <p className={styles.productPrice}>${Number(product.price ?? 0).toFixed(2)}</p>
              <p className={`${styles.stockLabel} ${inStock ? styles.stockPositive : styles.stockEmpty}`}>
                {inStock ? `${availableStock} in stock` : 'Out of stock'}
              </p>
              
              <button 
                className={styles.addToCartButton}
                onClick={() => handleAddToCart(product)}
                disabled={!inStock}
              >
                {inStock ? 'Add to Cart' : 'Unavailable'}
              </button>
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
}
