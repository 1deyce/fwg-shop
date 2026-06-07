import { createContext, useEffect, useState } from "react";
import Proptypes from "prop-types";
import Swal from "sweetalert2";
import "../App.css";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const storedCartItems = localStorage.getItem("cartItems");
        return storedCartItems ? JSON.parse(storedCartItems) : [];
    });

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item) => {
        const isItemInCart = cartItems.find((i) => i.id === item.id);

        if (!isItemInCart) {
            setCartItems([...cartItems, { ...item, quantity: 1 }]);
        } else {
            Swal.fire({
                title: "Item already in cart",
                text: "You have already added this item to your cart. Please select a different item if you still wish to add more items.",
                icon: "info",
                color: "grey",
                iconColor: "red",
                className: "bg-black",
                confirmButtonColor: "teal",
                theme: "dark",
                button: {
                    text: "Continue Shopping",
                    className: "bg-black duration-300",
                },
            });
        }
    };

    const removeFromCart = (item) => {
        setCartItems(cartItems.filter((i) => i.id !== item.id));
    };

    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

CartProvider.propTypes = {
    children: Proptypes.node.isRequired,
};
