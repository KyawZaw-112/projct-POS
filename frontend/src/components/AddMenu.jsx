import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Divider, notification, Space } from "antd";

const AddMenu = () => {
	const [productName, setProductName] = useState("");
	const [productPrice, setProductPrice] = useState("");
	const [productQuantity, setProductQuantity] = useState("");
	const [error, setError] = useState(null);

	const [api, contextHolder] = notification.useNotification();

	const openNotification = (text, placement) => {
		api.info({
			message: `Notification`,
			description: `${text}`,
			placement,
		});
	};

	useEffect(() => {
		const checkUserRole = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) {
					setError("No authentication token found");
					return;
				}

				const response = await axios.get(
					"http://localhost:6060/api/counter",
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);

				if (response.status !== 200) {
					setError(
						"You don't have permission to add products. Counter role required."
					);
				}
			} catch (err) {
				console.error("Error checking user role:", err);
				setError(
					"Failed to verify user role. Please try logging in again."
				);
			}
		};

		checkUserRole();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				throw new Error("No authentication token found");
			}
			const response = await axios.post(
				"http://localhost:6060/api/products",
				{
					productName,
					productPrice,
					productQuantity,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (response.status === 201) {
				openNotification("Product added successfully", "top");
				console.log("Product added successfully:", response.data);
				setProductName("");
				setProductPrice("");
				setProductQuantity("");
				setError(null);
			}
		} catch (err) {
			openNotification("Error adding product", "top");
			console.error("Error adding product:", err);
			if (err.response && err.response.status === 500) {
				setError(
					"Internal Server Error: Please try again later or contact support"
				);
			} else if (err.response && err.response.status === 401) {
				setError(
					"Unauthorized: Please check your authentication token"
				);
			} else if (err.response && err.response.status === 403) {
				setError(
					"Forbidden: You don't have permission to add products"
				);
			} else {
				setError(
					"Failed to add product: " +
						(err.response?.data?.message || err.message)
				);
			}
		}
	};

	return (
		<div>
			{contextHolder}
			<h1>Add Menu</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Product Name"
					value={productName}
					onChange={(e) => setProductName(e.target.value)}
				/>
				<input
					type="number"
					placeholder="Product Price"
					value={productPrice}
					onChange={(e) => setProductPrice(e.target.value)}
				/>
				<input
					type="number"
					placeholder="Product Quantity"
					value={productQuantity}
					onChange={(e) => setProductQuantity(e.target.value)}
				/>
				<button type="submit">Add Product</button>
				<p>{error}</p>
			</form>
		</div>
	);
};

export default AddMenu;
