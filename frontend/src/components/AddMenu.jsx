import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Divider, Flex, Form, Input, notification, Space } from "antd";
import { Select, Tag } from "antd";
import { categories } from "../api/api";

const tagRender = (props) => {
	const [data, setData] = useState([]);
	useEffect(() => {
		setData(categories);
	}, []);
	console.log(data);
	const { label, closable, onClose } = props;
	const onPreventMouseDown = (event) => {
		event.preventDefault();
		event.stopPropagation();
	};
	console.log(data.color);
	return (
		<Tag
			color={data.color}
			onMouseDown={onPreventMouseDown}
			closable={closable}
			onClose={onClose}
			style={{
				marginInlineEnd: 4,
			}}
		>
			{label}
		</Tag>
	);
};

const AddMenu = () => {
	const [productName, setProductName] = useState("");
	const [productPrice, setProductPrice] = useState("");
	const [productQuantity, setProductQuantity] = useState("");
	const [error, setError] = useState(null);
	const [productCategory, setProductCategory] = useState("");
	const [file, setFile] = useState();

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
		const formData = new FormData();
		formData.append('file',file)
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				throw new Error("No authentication token found");
			}
			// console.log(file);
			const response = await axios.post(
				"http://localhost:6060/api/products",
				{
					productName,
					productPrice,
					productQuantity,
					productCategory,
					formData
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			console.log(formData,file);
			// openNotification("New product added successfully", "top");
			if (response.status === 201) {
				openNotification("Product added successfully", "top");
				console.log("Product added successfully:", response.data);
				setProductName("");
				setProductPrice("");
				setProductQuantity("");
				setProductCategory(null);
				setFile(null);
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

	// console.log(
	// 	productName,
	// 	productPrice,
	// 	productQuantity,
	// 	"Prodyvy :",
	// 	productCategory,
	// 	"file",
	// 	file
	// );

	return (
		<div className="flex justify-center items-center h-[80vh] ">
			{contextHolder}
			<form className="w-1/3" onSubmit={handleSubmit}>
				{/* <legend>Add Menu</legend> */}
				<Flex vertical gap={13}>
					<h1 className="text-2xl font-bold text-center">Add Menu</h1>
					<Input
						value={productName}
						onChange={(e) => setProductName(e.target.value)}
						placeholder="Product Name"
					/>
					<Input
						value={productPrice}
						onChange={(e) => setProductPrice(e.target.value)}
						placeholder="Product Price"
					/>
					<Input
						value={productQuantity}
						onChange={(e) => setProductQuantity(e.target.value)}
						placeholder="Product Quantity"
					/>

					<select
						placeholder="Select Category"
						onChange={(e) => setProductCategory(e.target.value)}
						className="border px-3 py-3 rounded-lg"
					>
						<option value="Food">Food</option>
						<option value="Drink">Drink</option>
						<option value="Dessert">Dessert</option>
						<option value="Other">Other</option>
					</select>
					<input
						type="file"
						id=""
						onChange={(e) => setFile(e.target.files[0])}
					/>
					<Button type="primary" htmlType="submit">
						Add Product
					</Button>
				</Flex>
				<p>{error}</p>
			</form>
		</div>
	);
};

export default AddMenu;
