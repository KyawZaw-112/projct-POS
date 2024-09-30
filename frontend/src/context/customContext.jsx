import React, { createContext, useContext, useState } from "react";
import axios from "axios";
const CartContext = createContext();
import { notification } from "antd";

export const CartProvider = ({ children }) => {
	const [cart, setCart] = useState([]);
	const [tableNumber, setTableNumber] = useState(null);
	const [api, contextHolder] = notification.useNotification();

	const openNotifications = (text, placement) => {
		api.info({
			message: `Notification`,
			description: `${text}`,
			placement,
		});
	};

	
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
			return prevCart
				.map((item) => {
					if (item._id === productId && item.quantity > 1) {
						const newQuantity = item.quantity - 1;
						const newPrice =
							(item.price / item.quantity) * newQuantity;
						return {
							...item,
							quantity: newQuantity,
							price: newPrice,
						};
					}
					return item;
				})
				.filter((item) => item.quantity > 0);
		});
	};

	const removeFromCart = (productId) => {
		setCart((prevCart) => {
			const updatedCart = prevCart.filter(
				(item) => item._id !== productId
			);
			return updatedCart;
		});
	};

	const sendOrderToServer = async () => {
		if (!tableNumber) {
			alert("Please select table number ");
			return;
		}
		const orders = cart.map((item) => ({
			orderName: item.productName,
			orderQuantity: item.productQuantity,
			orderPrice: item.productPrice,
		}));

		// console.log(orders, tableNumber);

		if (orders.length === 0) {
			console.error("Order cannot be empty");/*  */
			return;
		}
		const token = localStorage.getItem("token");
		try {
			if (!token) {
				throw new Error("No authentication token found");
			}
			const response = await axios.post(
				"http://localhost:6060/api/orders",
				{ orders, tableNumber: tableNumber, date: Date.now() },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
		} catch (error) {
			console.error("Error sending order to server:", error);
		}
	};

	return (
		<CartContext.Provider
			value={{
				cart,
				setTableNumber,
				tableNumber,
				addToCart,
				removeFromCart,
				sendOrderToServer,
				increaseQuantityAndPrice,
				decreaseQuantityAndPrice,
				contextHolder,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => useContext(CartContext);
