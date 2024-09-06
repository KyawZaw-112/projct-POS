import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button } from "antd";
import axios from "axios";
import { useCart } from "../context/customContext";
import { InputNumber } from "antd";

const WaiterDashboard = () => {
	const [menus, setMenus] = useState([]);
	const [error, setError] = useState(null);
	// const [order, setOrder] = useState([]);
	const {
		cart,
		addToCart,
		increaseQuantityAndPrice,
		decreaseQuantityAndPrice,
		removeFromCart,
		sendOrderToServer,
		setTableNumber,
		tableNumber
	} = useCart();
	const fetchProducts = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				throw new Error("No authentication token found");
			}

			const response = await axios.get(
				"http://localhost:6060/api/products",
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (!response.data) {
				throw new Error("No data received from server");
			}

			setMenus(response.data);
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


	
	useEffect(() => {
		fetchProducts();
	}, []);

	// console.log(tableNumber);

	console.log(cart);

	return (
		<section className="flex lg:flex-row flex-col gap-4 my-10">
			<section className="flex flex-wrap flex-col md:flex-row gap-6 flex-1 h-full justify-center">
				{menus.map((menu) => (
					<div
						key={menu._id}
						className=" border-2 gap-2 flex flex-col border-gray-300 p-4 lg:w-1/4"
					>
						<h2 className="text-xl font-bold ">
							{menu.productName}
						</h2>
						<p className="text-gray-500">
							price :{menu.productPrice}
						</p>
						<p className="text-gray-500">
							quantity :{menu.productQuantity}
						</p>
						<Button type="primary" onClick={() => addToCart(menu)}>
							add to cart
						</Button>
					</div>
				))}
			</section>
			<>
				<section className=" flex flex-col gap-5 md:w-1/4 w-full h-screen bg-slate-300 py-6 px-3">
					<h2 className="text-2xl font-bold text-center">Cart</h2>
					<div className="flex flex-row gap-2 px-3">
						<label htmlFor="">Table Number : </label>
						<InputNumber
							min={1}
							max={10}
							changeOnWheel
							onChange={(value) => setTableNumber(value)}
							placeholder="Enter table number"
						/>
					</div>
					{cart.map((item) => (
						<>
							<div
								key={item._id}
								className="flex md:flex-row flex-col gap-2 justify-between px-3"
							>
								<p>{item.productName} - Quantity: {item.quantity} {item.productPrice}</p>
								<div className=" flex flex-row gap-2">
									<Button
										type="primary"
										onClick={() => decreaseQuantityAndPrice(item._id)}
									>
										-
									</Button>
									<Button
										type="primary"
										onClick={() =>
											increaseQuantityAndPrice(item._id)
										}
									>
										+
									</Button>
									<Button
										type="primary"
										onClick={() => removeFromCart(item._id)}
									>
										remove
									</Button>
								</div>
							</div>
						</>
					))}
					{cart.length > 0 && (
						<Button
							type="primary"
							// onClick={() => sendOrder()}
							onClick={() => sendOrderToServer(cart)}
							className="mx-3 text-xl py-5 tracking-wider"
						>
							Order
						</Button>
					)}
				</section>
			</>
		</section>
	);
};

export default WaiterDashboard;
