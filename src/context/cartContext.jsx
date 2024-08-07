import { createContext, useEffect, useState } from "react";
import Proptypes from "prop-types";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart items from localStorage on initial render
    const storedCartItems = localStorage.getItem("cartItems");
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  // Save cart data
  useEffect(() => {
    console.log("Saving cart data to localStorage:", cartItems);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Load cart data
  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      console.log(
        "Loading cart data from localStorage:",
        JSON.parse(storedCartItems)
      );
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  const addToCart = (item) => {
    const isItem = cartItems.find((i) => i.id === item.id);
    if (isItem) {
      setCartItems(
        cartItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (item) => {
    setCartItems(cartItems.filter((i) => i.id !== item.id));
  };

  const handleDecrease = (item) => {
    setCartItems(
      cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
      )
    );
  };

  const handleIncrease = (item) => {
    setCartItems(
      cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  };

  const handleQuantityChange = (item, newQuantity) => {
    setCartItems(
      cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: newQuantity } : i
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        handleDecrease,
        handleIncrease,
        handleQuantityChange,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: Proptypes.node.isRequired,
};
