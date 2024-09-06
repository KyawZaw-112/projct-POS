import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const [cart, setCart] = useState([]);
	const [tableNumber, setTableNumber] = useState(null);

	const addToCart = (product) => {
		setCart((prevCart) => {
			const existingItem = prevCart.find(
				(item) => item._id === product._id
			);
			if (existingItem) {
				return prevCart.map((item) =>
					item._id === product._id
						? { ...item, quantity: item.quantity + 1 }
						: item
				);
			} else {
				return [...prevCart, { ...product, quantity: 1 }];
			}
		});
	};
	const increaseQuantityAndPrice = (productId) => {
		setCart((prevCart) => {
			return prevCart.map((item) => {
				if (item._id === productId) {
					const newQuantity = item.quantity + 1;
					const newPrice = (item.price / item.quantity) * newQuantity;
					return { ...item, quantity: newQuantity, price: newPrice };
				}
				return item;
			});
		});
	};

	const decreaseQuantityAndPrice = (productId) => {
		setCart((prevCart) => {
			return prevCart.map((item) => {
				if (item._id === productId && item.quantity > 1) {
					const newQuantity = item.quantity - 1;
					const newPrice = (item.price / item.quantity) * newQuantity;
					return { ...item, quantity: newQuantity, price: newPrice };
				}
				return item;
			}).filter((item) => item.quantity > 0);
		});
	};



    const removeFromCart = (productId) => {
		setCart((prevCart) => {
			const updatedCart = prevCart.filter((item) => item._id !== productId);
			return updatedCart;
		});
	};

	const sendOrderToServer = async (order) => {
		try {
			const response = await fetch('http://localhost:6060/api/orders', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
				},
				body: JSON.stringify({ items: cart, tableNumber: tableNumber }),
			});

			if (!response.ok) {
				throw new Error('Failed to send order to server');
			}

			const data = await response.json();
			console.log('Order sent successfully:', data);

			// Clear the cart after successful order
			setCart([]);
		} catch (error) {
			console.error('Error sending order:', error);
		}
	};

	return (
		<CartContext.Provider value={{ cart,setTableNumber,tableNumber, addToCart,  removeFromCart, sendOrderToServer,increaseQuantityAndPrice,decreaseQuantityAndPrice }}>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => useContext(CartContext);
