const CART_KEY = 'cart';
const USER_KEY = 'user';

const isBrowser = () => typeof window !== 'undefined';

const hasOwn = (object, key) =>
  Object.prototype.hasOwnProperty.call(object ?? {}, key);

const randomCartId = () =>
  `cart-item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const resolveStockValue = (product) => {
  if (!product || typeof product !== 'object') {
    return null;
  }

  const candidateFields = ['stock', 'availableStock', 'inventory', 'quantityAvailable'];
  for (const field of candidateFields) {
    if (hasOwn(product, field)) {
      const numericValue = Number(product[field]);
      if (Number.isFinite(numericValue)) {
        return Math.max(0, numericValue);
      }
    }
  }

  return null;
};

const resolveStockKey = (product, explicitProductId = null, fallbackKey = null) => {
  const candidates = [
    product?.stockKey,
    explicitProductId,
    product?.productId,
    product?.id,
    product?.databaseId,
    product?.dbId,
    product?.sku,
    product?.slug,
    product?.name,
    fallbackKey
  ];

  for (const candidate of candidates) {
    if (candidate === undefined || candidate === null || candidate === '') {
      continue;
    }
    const value = String(candidate).trim();
    if (value.length === 0) {
      continue;
    }
    return value;
  }

  return null;
};

const resolveCartKey = (product) => {
  if (!product || typeof product !== 'object') {
    return randomCartId();
  }

  const candidates = [
    product.cartId,
    product.id,
    product.slug,
    product.sku,
    product.name
  ];

  for (const candidate of candidates) {
    if (candidate !== undefined && candidate !== null && candidate !== '') {
      return candidate;
    }
  }

  return randomCartId();
};

const resolveProductId = (product) => {
  if (!product || typeof product !== 'object') {
    return null;
  }

  const candidateKeys = ['productId', 'databaseId', 'dbId'];
  for (const key of candidateKeys) {
    if (hasOwn(product, key)) {
      const numericValue = Number(product[key]);
      if (Number.isFinite(numericValue)) {
        return numericValue;
      }
    }
  }

  return null;
};

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch (_error) {
    return fallback;
  }
};

const dispatchCartEvent = () => {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event('cart-updated'));
};

export const getStoredUser = () => {
  if (!isBrowser()) return null;
  const raw = window.localStorage.getItem(USER_KEY);
  return raw ? safeParse(raw, null) : null;
};

export const getCartItems = () => {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(CART_KEY);
  if (!raw) return [];
  const parsed = safeParse(raw, []);
  if (!Array.isArray(parsed)) {
    return [];
  }
  return parsed;
};

const persistCart = (items) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const setCartItems = (items) => {
  persistCart(items);
  dispatchCartEvent();
  return items;
};

export const clearCart = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(CART_KEY);
  dispatchCartEvent();
};

const normalizeProduct = (product) => {
  const cartKey = resolveCartKey(product);
  const dbProductId = resolveProductId(product);
  const stock = resolveStockValue(product);
  const stockKey = resolveStockKey(product, dbProductId, cartKey) ?? cartKey;

  return {
    id: cartKey,
    productId: dbProductId,
    stockKey,
    stock,
    name: product?.name ?? 'Unknown product',
    price: Number(product?.price) || 0,
    image: product?.image ?? product?.imageUrl ?? null,
    description: product?.description ?? '',
    category: product?.category ?? null
  };
};

export const addProductToCart = (product) => {
  if (!isBrowser()) {
    return { success: false, reason: 'NOT_READY' };
  }

  const user = getStoredUser();
  if (!user) {
    return { success: false, reason: 'NOT_AUTHENTICATED' };
  }

  if (!product) {
    return { success: false, reason: 'INVALID_PRODUCT' };
  }

  const normalized = normalizeProduct(product);
  const cart = getCartItems();
  const existingIndex = cart.findIndex((item) => {
    if (normalized.id === null) {
      return item.name === normalized.name;
    }
    return item.id === normalized.id;
  });

  const existingQuantity = existingIndex >= 0
    ? Number(cart[existingIndex].quantity ?? 1)
    : 0;

  const stockLimit = Number.isFinite(normalized.stock)
    ? normalized.stock
    : (existingIndex >= 0 && Number.isFinite(cart[existingIndex].stock)
        ? cart[existingIndex].stock
        : null);

  if (stockLimit !== null && stockLimit <= existingQuantity) {
    return { success: false, reason: 'OUT_OF_STOCK' };
  }

  if (existingIndex >= 0) {
    cart[existingIndex] = {
      ...cart[existingIndex],
      stock: stockLimit ?? cart[existingIndex].stock ?? null,
      stockKey: cart[existingIndex].stockKey ?? normalized.stockKey,
      quantity: existingQuantity + 1
    };
  } else {
    if (stockLimit !== null && stockLimit <= 0) {
      return { success: false, reason: 'OUT_OF_STOCK' };
    }

    cart.push({
      ...normalized,
      quantity: 1,
    });
  }

  setCartItems(cart);
  return { success: true, cart };
};

export const removeCartItemByIndex = (index) => {
  const cart = getCartItems();
  if (index < 0 || index >= cart.length) {
    return cart;
  }
  const updated = cart.filter((_, idx) => idx !== index);
  setCartItems(updated);
  return updated;
};

export const updateCartItemQuantity = (index, quantity) => {
  const cart = getCartItems();
  if (!cart[index]) return cart;
  let nextQuantity = Math.max(1, quantity);
  const stockLimit = Number.isFinite(cart[index].stock) ? cart[index].stock : null;
  if (stockLimit !== null) {
    nextQuantity = Math.min(nextQuantity, stockLimit);
  }
  cart[index].quantity = nextQuantity;
  setCartItems(cart);
  return cart;
};

export const getCartTotal = (items = null) => {
  const source = items ?? getCartItems();
  const total = source.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    return sum + price * quantity;
  }, 0);
  return Number(total.toFixed(2));
};

const buildReservationMap = (items) => {
  return items.reduce((acc, item) => {
    const key = item?.stockKey ?? resolveStockKey(item, item?.productId, item?.id);
    if (!key) {
      return acc;
    }
    const quantity = Number(item?.quantity) || 0;
    acc[key] = (acc[key] ?? 0) + quantity;
    return acc;
  }, {});
};

export const getCartReservations = () => {
  const items = getCartItems();
  return buildReservationMap(items);
};

export const getProductStockKey = (product) => {
  const productId = resolveProductId(product);
  return resolveStockKey(product, productId, resolveCartKey(product));
};
