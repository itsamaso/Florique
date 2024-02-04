import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((currentCart) => {
      const itemIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);

      if (itemIndex > -1) {
        // Update quantity if item exists
        return currentCart.map((cartItem, index) => 
          index === itemIndex ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        // Add new item with quantity 1 if it doesn't exist
        return [...currentCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart((currentCart) => currentCart.filter(item => item.id !== itemId));
  };

  const clearCart = () => setCart([]);

  const increaseQuantity = (itemId) => {
    setCart((currentCart) => 
      currentCart.map((item) => 
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (itemId) => {
    setCart((currentCart) => 
      currentCart.map((item) => 
        item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      )
    );
  };

  // Calculate total cost of items in the cart
  const getTotalCost = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity, getTotalCost }}>
      {children}
    </CartContext.Provider>
  );
};
