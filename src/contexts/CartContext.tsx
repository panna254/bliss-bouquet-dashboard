import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Product } from '@/adapters/productAdapter';
import { useToast } from '@/hooks/use-toast';
import { checkoutCartPersistencePolicy } from '@/services/checkout.service';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isCartItem = (value: unknown): value is CartItem => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.price === "number" &&
    typeof value.image === "string" &&
    typeof value.rating === "number" &&
    typeof value.reviewCount === "number" &&
    typeof value.description === "string" &&
    typeof value.category === "string" &&
    typeof value.quantity === "number" &&
    Number.isInteger(value.quantity) &&
    value.quantity > 0
  );
};

const restoreCartItems = (): CartItem[] => {
  try {
    const persistedCart = window.localStorage.getItem(checkoutCartPersistencePolicy.key);

    if (!persistedCart) {
      return [];
    }

    const parsedCart: unknown = JSON.parse(persistedCart);

    if (!isRecord(parsedCart) || !Array.isArray(parsedCart.items) || typeof parsedCart.persistedAt !== "string") {
      return [];
    }

    const persistedAt = Date.parse(parsedCart.persistedAt);
    const maxAgeMs = checkoutCartPersistencePolicy.ttlHours * 60 * 60 * 1000;

    if (!Number.isFinite(persistedAt) || Date.now() - persistedAt > maxAgeMs) {
      window.localStorage.removeItem(checkoutCartPersistencePolicy.key);
      return [];
    }

    return parsedCart.items.filter(isCartItem);
  } catch {
    window.localStorage.removeItem(checkoutCartPersistencePolicy.key);
    return [];
  }
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => restoreCartItems());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      window.localStorage.setItem(
        checkoutCartPersistencePolicy.key,
        JSON.stringify({
          persistedAt: new Date().toISOString(),
          items,
        }),
      );
    } catch {
      // Cart persistence should not interrupt shopping.
    }
  }, [items]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      
      if (existingItem) {
        toast({
          title: "Updated cart",
          description: `${product.name} quantity updated to ${existingItem.quantity + quantity}`,
        });
        
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        toast({
          title: "Added to cart",
          description: `${product.name} has been added to your cart`,
        });
        
        return [...currentItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(currentItems => {
      const item = currentItems.find(item => item.id === productId);
      if (item) {
        toast({
          title: "Removed from cart",
          description: `${item.name} has been removed from your cart`,
        });
      }
      return currentItems.filter(item => item.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
