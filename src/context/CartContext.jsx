// import React, { createContext, useState, useEffect } from 'react';

// export const CartContext = createContext();

// export const CartContextProvider = ({ children }) => {
//     const [cartItems, setCartItems] = useState(() => {
//         try {
//             const localData = localStorage.getItem('cartItems');
//             return localData ? JSON.parse(localData) : [];
//         } catch (error) {
//             return [];
//         }
//     });

//     useEffect(() => {
//         localStorage.setItem('cartItems', JSON.stringify(cartItems));
//     }, [cartItems]);

//     const addToCart = (product, quantity) => {
//         setCartItems(prevItems => {
//             const existingItem = prevItems.find(item => item._id === product._id);
//             if (existingItem) {
//                 return prevItems.map(item =>
//                     item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
//                 );
//             }
//             return [...prevItems, { ...product, quantity }];
//         });
//     };

//     const updateQuantity = (productId, newQuantity) => {
//         if (newQuantity <= 0) {
//             removeFromCart(productId);
//         } else {
//             setCartItems(prevItems =>
//                 prevItems.map(item =>
//                     item._id === productId ? { ...item, quantity: newQuantity } : item
//                 )
//             );
//         }
//     };

//     const removeFromCart = (productId) => {
//         setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
//     };

//     const clearCart = () => {
//         setCartItems([]);
//         localStorage.removeItem('cartItems')
//     };

//     return (
//         <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
//             {children}
//         </CartContext.Provider>
//     );
// };
// export default CartContextProvider;


import React, { createContext, useState, useEffect, useCallback } from 'react';

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
    // Initialize state from localStorage
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Error parsing cart items from localStorage", error);
            return [];
        }
    });

    // Effect to sync state with localStorage whenever cartItems change
    useEffect(() => {
        try {
            if (cartItems.length === 0) {
                // If the cart is empty, remove the item from localStorage
                localStorage.removeItem('cartItems');
            } else {
                // Otherwise, save the cart items
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
            }
        } catch (error) {
            console.error("Error saving cart items to localStorage", error);
        }
    }, [cartItems]);

    const addToCart = (product, quantity) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === product._id);
            if (existingItem) {
                return prevItems.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prevItems, { ...product, quantity }];
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item._id === productId ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
    };

    // Make clearCart a stable function with useCallback.
    // It just needs to set the state to an empty array; the useEffect handles localStorage.
    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []); // Empty dependency array means this function is created only once.

    // Memoize the context value to prevent unnecessary re-renders of consumers
    const contextValue = { cartItems, addToCart, updateQuantity, removeFromCart, clearCart };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContextProvider;
