"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { clearCart as clearStoredCart } from "../../lib/cartStorage";

const createOrderLine = () => ({
  productId: "",
  name: "",
  price: "",
  quantity: 1,
  image: ""
});

export default function WorkerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("products");
  
  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    stock: ""
  });
  
  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [ordersMessage, setOrdersMessage] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productMessage, setProductMessage] = useState(null);
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    userId: "",
    items: [createOrderLine()]
  });
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderFormError, setOrderFormError] = useState(null);

  useEffect(() => {
    // Check if user is logged in and is a worker
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    
    // Check if user has WORKER role
    if (parsedUser.role !== 'WORKER') {
      alert('Access denied. This page is for workers only.');
      router.push('/dashboard');
      return;
    }
    
    setUser(parsedUser);
  }, [router]);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    } else {
      fetchProducts();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    setOrdersMessage(null);
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        setOrdersError('Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrdersError('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    setProductMessage(null);
    try {
      const response = await fetch('/api/products', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProductMessage({ type: 'error', text: 'Unable to load products. Showing latest known data.' });
    } finally {
      setProductsLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setProductSubmitting(true);
    setProductMessage(null);
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...productForm,
          stock: Number(productForm.stock) || 0,
        }),
      });

      if (response.ok) {
        setProductMessage({ type: 'success', text: `Product added: ${productForm.name}` });
        setProductForm({ name: "", price: "", category: "", image: "", stock: "" });
        fetchProducts();
      } else {
        setProductMessage({ type: 'error', text: 'Failed to add product' });
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setProductMessage({ type: 'error', text: 'Error adding product' });
    } finally {
      setProductSubmitting(false);
    }
  };

  const handleProductDelete = async (productId) => {
    const confirmDelete = window.confirm('Delete this product? Orders will keep their history.');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/products?id=${productId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed request');
      }
      setProductMessage({ type: 'success', text: 'Product removed.' });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setProductMessage({ type: 'error', text: 'Could not delete product.' });
    }
  };

  const handleOrderCreate = () => {
    setOrderForm({ userId: "", items: [createOrderLine()] });
    setOrderFormError(null);
    setOrderModalOpen(true);
    if (!products.length) {
      fetchProducts();
    }
  };

  const handleOrderItemChange = (index, field, value) => {
    setOrderForm((prev) => {
      const updatedItems = prev.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      );
      return { ...prev, items: updatedItems };
    });
  };

  const handleOrderProductSelect = (index, productId) => {
    const product = products.find((item) => String(item.id) === productId);
    if (!product) {
      handleOrderItemChange(index, 'productId', "");
      return;
    }

    setOrderForm((prev) => {
      const updatedItems = prev.items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              productId,
              name: product.name ?? item.name,
              price: product.price ?? item.price,
              image: product.image ?? item.image
            }
          : item
      );
      return { ...prev, items: updatedItems };
    });
  };

  const addOrderItem = () => {
    setOrderForm((prev) => ({
      ...prev,
      items: [...prev.items, createOrderLine()]
    }));
  };

  const removeOrderItem = (index) => {
    setOrderForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const handleOrderSubmit = async (event) => {
    event.preventDefault();
    setOrderFormError(null);

    const parsedUserId = Number(orderForm.userId);
    if (!Number.isFinite(parsedUserId) || parsedUserId <= 0) {
      setOrderFormError('Customer ID must be a positive number.');
      return;
    }

    const sanitizedItems = orderForm.items
      .map((item) => ({
        productId: item.productId ? Number(item.productId) : undefined,
        name: item.name.trim(),
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        image: item.image?.trim() || undefined
      }))
      .filter((item) => item.name && item.price > 0);

    if (!sanitizedItems.length) {
      setOrderFormError('Add at least one product with a name and price.');
      return;
    }

    setOrderSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: parsedUserId, items: sanitizedItems })
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setOrderModalOpen(false);
      setOrderSubmitting(false);
      setOrdersMessage('Order created successfully.');
      fetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
      setOrderFormError('Failed to create order. Check the customer ID and try again.');
      setOrderSubmitting(false);
    }
  };

  const handleCloseOrderModal = () => {
    if (orderSubmitting) {
      return;
    }
    setOrderModalOpen(false);
  };

  const handleOrderDelete = async (orderId) => {
    const confirmDelete = window.confirm('Delete this order? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/orders?id=${orderId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed request');
      }
      setOrdersMessage('Order removed.');
      setOrdersError(null);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      setOrdersError('Could not delete order.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    clearStoredCart();
    window.dispatchEvent(new Event('auth-change'));
    router.push('/login');
  };

  if (!user) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.header}>
          <h1 className={styles.title}>Worker Dashboard</h1>
          <p className={styles.subtitle}>Manage products and orders</p>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === "products" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Products Management
        </button>
        <button 
          className={`${styles.tab} ${activeTab === "orders" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Add New Shoe</h2>
          {productMessage && (
            <div className={styles.subtitle} style={{ color: productMessage.type === 'error' ? '#dc2626' : '#059669' }}>
              {productMessage.text}
            </div>
          )}
          <form className={styles.form} onSubmit={handleProductSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Shoe Name</label>
              <input
                type="text"
                className={styles.input}
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                placeholder="Air Max 90"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Price ($)</label>
              <input
                type="number"
                step="0.01"
                className={styles.input}
                value={productForm.price}
                onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                placeholder="149.99"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <select
                className={styles.input}
                value={productForm.category}
                onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                <option value="sneakers">Sneakers</option>
                <option value="winter">Winter Boots</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Image URL</label>
              <input
                type="text"
                className={styles.input}
                value={productForm.image}
                onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                placeholder="/sneakers/1.jpg"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Stock</label>
              <input
                type="number"
                className={styles.input}
                value={productForm.stock}
                onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                placeholder="50"
                min="0"
              />
            </div>

            <button type="submit" className={styles.submitButton} disabled={productSubmitting}>
              {productSubmitting ? 'Adding...' : 'Add Shoe'}
            </button>
          </form>

          <div className={styles.ordersTable} style={{ marginTop: '2rem' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productsLoading ? (
                  <tr>
                    <td colSpan="7" className={styles.emptyMessage}>Loading inventory...</td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className={styles.emptyMessage}>No products yet. Add your first pair above.</td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>#{product.id}</td>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>${Number(product.price).toFixed(2)}</td>
                      <td>{Number.isFinite(product.stock) ? product.stock : '—'}</td>
                      <td>{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '—'}</td>
                      <td>
                        <button
                          type="button"
                          className={styles.logoutButton}
                          style={{ padding: '0.5rem 1rem' }}
                          onClick={() => handleProductDelete(product.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className={styles.section}>
          <div className={styles.ordersHeader}>
            <h2 className={styles.sectionTitle}>All Orders</h2>
            <button className={styles.createOrderButton} onClick={handleOrderCreate}>
              Create New Order
            </button>
          </div>
          {ordersMessage && (
            <div className={styles.subtitle} style={{ color: '#059669', marginBottom: '1rem' }}>
              {ordersMessage}
            </div>
          )}

          <div className={styles.ordersTable}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ordersLoading ? (
                  <tr>
                    <td colSpan="8" className={styles.emptyMessage}>
                      Loading orders...
                    </td>
                  </tr>
                ) : ordersError ? (
                  <tr>
                    <td colSpan="8" className={styles.emptyMessage}>{ordersError}</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className={styles.emptyMessage}>
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.user?.email || 'N/A'}</td>
                      <td>{order.orderItems?.length || 0} items</td>
                      <td>{order.orderItems?.reduce((sum, item) => sum + (item.quantity ?? 0), 0)}</td>
                      <td>${Number(order.total ?? 0).toFixed(2)}</td>
                      <td>
                        <span className={styles.status}>{order.status}</span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          type="button"
                          className={styles.logoutButton}
                          style={{ padding: '0.5rem 1rem' }}
                          onClick={() => handleOrderDelete(order.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {orderModalOpen && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                  <h3 className={styles.modalTitle}>Create Order</h3>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={handleCloseOrderModal}
                    disabled={orderSubmitting}
                  >
                    Close
                  </button>
                </div>

                <form className={styles.modalForm} onSubmit={handleOrderSubmit}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Customer ID</label>
                    <input
                      type="number"
                      className={styles.input}
                      value={orderForm.userId}
                      onChange={(e) => setOrderForm((prev) => ({ ...prev, userId: e.target.value }))}
                      placeholder="Enter user ID"
                      min="1"
                      required
                    />
                  </div>

                  {orderForm.items.map((item, index) => (
                    <div key={index} className={styles.lineItemCard}>
                      <div className={styles.lineItemHeader}>
                        <strong>Product #{index + 1}</strong>
                        {orderForm.items.length > 1 && (
                          <button
                            type="button"
                            className={styles.linkButton}
                            onClick={() => removeOrderItem(index)}
                            disabled={orderSubmitting}
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className={styles.inlineGrid}>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Link stock item</label>
                          <select
                            className={styles.input}
                            value={item.productId}
                            onChange={(e) => handleOrderProductSelect(index, e.target.value)}
                          >
                            <option value="">Manual entry</option>
                            {products.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name} (${Number(product.price).toFixed(2)})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className={styles.formGroup}>
                          <label className={styles.label}>Product name</label>
                          <input
                            type="text"
                            className={styles.input}
                            value={item.name}
                            onChange={(e) => handleOrderItemChange(index, 'name', e.target.value)}
                            placeholder="Retro Runner"
                            required
                          />
                        </div>
                      </div>

                      <div className={styles.inlineGrid}>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Price ($)</label>
                          <input
                            type="number"
                            className={styles.input}
                            value={item.price}
                            onChange={(e) => handleOrderItemChange(index, 'price', e.target.value)}
                            step="0.01"
                            min="0"
                            required
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.label}>Quantity</label>
                          <input
                            type="number"
                            className={styles.input}
                            value={item.quantity}
                            onChange={(e) => handleOrderItemChange(index, 'quantity', e.target.value)}
                            min="1"
                            required
                          />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.label}>Image URL (optional)</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={item.image}
                          onChange={(e) => handleOrderItemChange(index, 'image', e.target.value)}
                          placeholder="https://example.com/pair.jpg"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className={styles.addItemButton}
                    onClick={addOrderItem}
                    disabled={orderSubmitting}
                  >
                    + Add another product
                  </button>

                  {orderFormError && (
                    <div className={styles.errorMessage}>{orderFormError}</div>
                  )}

                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={handleCloseOrderModal}
                      disabled={orderSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={orderSubmitting}
                    >
                      {orderSubmitting ? 'Creating...' : 'Create Order'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
