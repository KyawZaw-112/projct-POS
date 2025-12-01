import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import {io} from  "socket.io-client"
const CartContext = createContext();
import { notification } from "antd";

export const CartProvider = ({ children }) => {
    //region States
	const [cart, setCart] = useState([]);
	const [tableNumber, setTableNumber] = useState();
	const [api, contextHolder] = notification.useNotification();
	const [isPacked, setIsPacked] = useState(false);
	const [notifications, setNotifications] = useState([]);
	const [orders, setOrders] = useState([]);
	const [error, setError] = useState(null);
	const [kitchenDatas, setKitchenDatas] = useState([]);
	const [authentication, setAuthentication] = useState(true);
    //endregion

    //change localhost to backend's
    const socket = io("http://localhost:9900");

	const openNotifications = (text, placement) => {
		api.success({
			message: `Notification`,
			description: `${text}`,
			placement,
			showProgress:true,
			pauseOnHover:false,
		});
	};

	const handlePacked = (e) => {
		const isCheck  = e.target.checked;
		const value = e.target.name;
		// console.log();
		
			setIsPacked(isCheck)
			console.log(`${value} is check ${isCheck}`);
	}

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
					// console.log(item.quantity);
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
			// alert("Please select table number ");
			// openNotifications(,"top")
			const errorMessage = ()=> {
				api.error({
					message:"Please choose the table number.",
					placement:"top",
					showProgress:true,
                    pauseOnHover:false,
				})
			}
			errorMessage()
			return;
		}
		const orders = cart.map((item) => ({
			orderName: item.productName,
			orderQuantity: item.productQuantity,
			orderPrice: item.productPrice,
			isPacked:isPacked,
			quantity:item.quantity
		}));

		if (orders.length === 0) {
			console.error("Order cannot be empty");/*  */
			return;
		}
		const token = localStorage.getItem("token");
		try {
			if (!token) {
				throw new Error("No authentication token found");
			}
            socket.emit("order", {orders: JSON.stringify(orders)})
			const response = await axios.post(
				"http://localhost:6060/api/orders",
				{ orders, tableNumber, date: Date.now() },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			openNotifications("Successful Order","top")
			setCart([])
		} catch (error) {
			console.error("Error sending order to server:", error);
		}
	};

	const fetchNotifications = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				throw new Error("No authentication token found");
			}

			const response = await axios.get(
				"http://localhost:6060/api/notifications",
				{
					headers: {Authorization: `Bearer ${token}`},
				}
			);

			if (!response.data) {
				throw new Error("No data received from server");
			}
			setNotifications(response.data);
		} catch (err) {
			console.error("Detailed error:", err);
			if (err.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				console.error("Error response:", err.response.data);
				console.error("Error status:", err.response.status);
				setError(
					`Server error: ${err.response.status} - ${
						err.response.data.message || "Unknown error"
					}`
				);
			} else if (err.request) {
				// The request was made but no response was received
				console.error("Error request:", err.request);
				setError("No response received from server");
			} else {
				// Something happened in setting up the request that triggered an Error
				console.error("Error message:", err.message);
				setError(`Error: ${err.message}`);
			}
		}
	};

	const sendNotificationToWaiter = async({ kitchenData }) => {

		const token = localStorage.getItem("token");
		try {
			const response = await axios.post("http://localhost:6060/api/notifications",
				{
					kitchenData:kitchenData
				},
				{
					headers: {Authorization: `Bearer ${token}`},
				}
			)
			alert("Notification sent successfully!")

		}catch(error) {
			console.error("Error sending notification to server:", error.message);
		}
	}

	const fetchKitchenData = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.get(
				"http://localhost:6060/api/kitchen-data",
				{
					headers: {Authorization: `Bearer ${token}`},
				}
			);
			if (!response.data) {
				throw new Error("No data received from server");
			}

			setKitchenDatas(response.data);
		} catch (err) {
			console.error("Detailed error:", err);
			if (err.response) {
				console.error("Error response:", err.response.data);
				console.error("Error status:", err.response.status);
				setError(
					`Server error: ${err.response.status} - ${
						err.response.data.message || "Unknown error"
					}`
				);

				setAuthentication(false);
			} else if (err.request) {
				console.error("Error request:", err.request);
				setError("No response received from server");
			} else {
				console.error("Error message:", err.message);
				setError(`Error: ${err.message}`);
			}
		}
	};

	const deleteNotification = async (notiId) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				throw new Error("Token is missing");
			}

			const response = axios.delete("http://localhost:6060/api/delete/notification",
				{
					headers: {Authorization: `Bearer ${token}`},
					data: {notiId}
				});
			alert("Successfully deleted notification");
			window.location.reload();

		} catch (err) {
			console.log(err);
		}

	}

	const fetchOrders = async () => {
		try {
			const response = await axios.get(
				"http://localhost:6060/api/orders"
			);
			if (!response.data) {
				throw new Error("No data received from server");
			}

			setOrders(response.data);
		} catch (err) {
			console.error("Detailed error:", err);
			if (err.response) {
				console.error("Error response:", err.response.data);
				console.error("Error status:", err.response.status);
				setError(
					`Server error: ${err.response.status} - ${
						err.response.data.message || "Unknown error"
					}`
				);

				setAuthentication(false);
			} else if (err.request) {
				console.error("Error request:", err.request);
				setError("No response received from server");
			} else {
				console.error("Error message:", err.message);
				setError(`Error: ${err.message}`);
			}
		}
	};

	//counter confirm order to send kitchen

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
				isPacked,
				handlePacked,
				notifications,
				fetchNotifications,
				sendNotificationToWaiter,
				fetchKitchenData,
				kitchenDatas,
				deleteNotification,
				orders,
				fetchOrders
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => useContext(CartContext);
