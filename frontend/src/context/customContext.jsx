import React, { createContext, useContext, useState } from "react";
import axios from "axios";
const CartContext = createContext();

export const CartProvider = ({ children }) => {
	const [cart, setCart] = useState([]);
	const [tableNumber, setTableNumber] = useState(null);
	// const [error, setError] = useState(true);

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
		console.log(tableNumber);
		if (!tableNumber) {
			// throw new Error('No table number found');
			// setError(!error);
			alert('No table number found');
			return;
		}
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				throw new Error('No authentication token found');
			}

			const response = await axios.post(
				'http://localhost:6060/api/orders',
				{ items: cart, tableNumber: tableNumber,date:Date.now() },
				{
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`,
					},
				}
			);

			if (response.status !== 201) {
				throw new Error('Failed to send order to server');
			}

			console.log('Order sent successfully:', response.data);

			// Clear the cart after successful order
			setCart([]);
			setTableNumber(null);
		} catch (error) {
			console.error('Error sending order:', error.message);
			// You might want to handle this error in the UI
		}
	};


	return (
		<CartContext.Provider value={{ cart,setTableNumber,tableNumber, addToCart,  removeFromCart, sendOrderToServer,increaseQuantityAndPrice,decreaseQuantityAndPrice }}>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => useContext(CartContext);
