"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import {
  getCartItems,
  removeCartItemByIndex,
  clearCart as clearStoredCart,
  getCartTotal
} from "../../lib/cartStorage";

const parseProductId = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderFeedback, setOrderFeedback] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setCart(getCartItems());
    
    // Fetch user orders
    fetchOrders(parsedUser.id);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const handleCartUpdate = () => {
      setCart(getCartItems());
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    if (!orderFeedback) return;
    const timer = setTimeout(() => setOrderFeedback(null), 4000);
    return () => clearTimeout(timer);
  }, [orderFeedback]);

  const fetchOrders = async (userId) => {
    try {
      const response = await fetch(`/api/orders?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    clearStoredCart();
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login');
  };

  const removeFromCart = (index) => {
    const updated = removeCartItemByIndex(index);
    setCart(updated);
  };

  const getTotalCartPrice = () => {
    return getCartTotal(cart).toFixed(2);
  };

  const handleCheckout = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (cart.length === 0) {
      setOrderFeedback({ type: 'error', message: 'Your cart is empty. Add some products first!' });
      return;
    }

    setCheckoutLoading(true);
    setOrderFeedback({ type: 'info', message: 'Placing your order...' });

    try {
      const payload = {
        userId: user.id,
        items: cart.map((item) => ({
          productId: parseProductId(item.productId),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image ?? null
        }))
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      clearStoredCart();
      setCart([]);
      await fetchOrders(user.id);
      setActiveTab('orders');
      setOrderFeedback({ type: 'success', message: 'Order placed successfully!' });
    } catch (error) {
      console.error('Checkout error:', error);
      setOrderFeedback({ type: 'error', message: 'Could not place order. Please try again.' });
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome, {user.name}!</h1>
          <p className={styles.subtitle}>{user.email}</p>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === "orders" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          My Orders
        </button>
        <button 
          className={`${styles.tab} ${activeTab === "profile" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          My Profile
        </button>
        <button 
          className={`${styles.tab} ${activeTab === "cart" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("cart")}
        >
          Shopping Cart ({cart.length})
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>My Orders</h2>
          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No orders yet</p>
              <a href="/sneakers" className={styles.shopButton}>Start Shopping</a>
            </div>
          ) : (
            <div className={styles.ordersList}>
              {orders.map((order) => {
                const itemCount = order.orderItems?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) || 0;
                const total = Number(order.total ?? 0).toFixed(2);

                return (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <span className={styles.orderId}>Order #{order.id}</span>
                      <span className={styles.orderStatus}>{order.status}</span>
                    </div>
                    <div className={styles.orderDetails}>
                      <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p>Total: ${total}</p>
                      <p>Items: {itemCount}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>My Profile</h2>
          <div className={styles.profileCard}>
            <div className={styles.profileField}>
              <label>Full Name</label>
              <p>{user.name}</p>
            </div>
            <div className={styles.profileField}>
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            <div className={styles.profileField}>
              <label>Account Type</label>
              <p>{user.role}</p>
            </div>
            <div className={styles.profileField}>
              <label>Member Since</label>
              <p>{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cart Tab */}
      {activeTab === "cart" && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Shopping Cart</h2>
          {orderFeedback && (
            <div
              className={`${styles.feedback} ${
                orderFeedback.type === 'error'
                  ? styles.feedbackError
                  : orderFeedback.type === 'success'
                  ? styles.feedbackSuccess
                  : styles.feedbackInfo
              }`}
            >
              {orderFeedback.message}
            </div>
          )}
          {cart.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Your cart is empty</p>
              <a href="/sneakers" className={styles.shopButton}>Start Shopping</a>
            </div>
          ) : (
            <div className={styles.cartContainer}>
              <div className={styles.cartItems}>
                {cart.map((item, index) => (
                  <div key={index} className={styles.cartItem}>
                    <div className={styles.cartItemInfo}>
                      <h3>{item.name}</h3>
                      <p>Quantity: {item.quantity}</p>
                      <p className={styles.price}>${item.price}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(index)}
                      className={styles.removeButton}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className={styles.cartSummary}>
                <h3>Order Summary</h3>
                <div className={styles.summaryRow}>
                  <span>Subtotal:</span>
                  <span>${getTotalCartPrice()}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className={styles.summaryTotal}>
                  <span>Total:</span>
                  <span>${getTotalCartPrice()}</span>
                </div>
                <button 
                  className={styles.checkoutButton}
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
