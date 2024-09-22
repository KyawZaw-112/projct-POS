import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button } from "antd";
import axios from "axios";
import { useCart } from "../context/customContext";
import { InputNumber } from "antd";
// import Item from "antd/es/list/Item";
import { PiShoppingCart } from "react-icons/pi";
import { FaPlus } from "react-icons/fa6";
// import { MdOutlineMinusOne } from "react-icons/md";
import { FaMinus } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import InternalAuth from "./InternalAuth";

const WaiterDashboard = () => {
	const [menus, setMenus] = useState([]);
	const [error, setError] = useState(null);
	const [eachItem, setEachItem] = useState([]);
	const [authentication, setAuthentication] = useState(true);
	const {
		cart,
		addToCart,
		increaseQuantityAndPrice,
		decreaseQuantityAndPrice,
		removeFromCart,
		sendOrderToServer,
		setTableNumber,
		tableNumber,
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
				setAuthentication(false);
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
		// cartFetch()
		fetchProducts();
	}, []);

	// console.log(cart);

	return (
		<>
			{error ? (
				<InternalAuth />
			) : (
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
								{menu.productQuantity === 0 ? (
									<p>out of stock</p>
								) : (
									<p className="text-gray-500">
										quantity :{menu.productQuantity}
									</p>
								)}
								{menu.productQuantity === 0 ? (
									<Button
										type="primary"
										onClick={() => addToCart(menu)}
										disabled
										className="w-[50px] text-lg h-[50px] flex justify-center items-center"
									>
										<PiShoppingCart />
									</Button>
								) : (
									<Button
										type="primary"
										onClick={() => addToCart(menu)}
										className="w-[50px] text-lg h-[50px] flex justify-center items-center"
									>
										<PiShoppingCart />
									</Button>
								)}
							</div>
						))}
					</section>
					{cart.length !== 0 && (
						<>
							<section className=" flex flex-col gap-5 md:w-1/4 w-full h-full bg-slate-300 py-6 px-3">
								<h2 className="text-2xl font-bold text-center">
									Cart
								</h2>
								<div className="flex flex-row gap-2 px-3">
									<label htmlFor="">Table Number : </label>
									<InputNumber
										min={1}
										max={10}
										changeOnWheel
										onChange={(value) =>
											setTableNumber(value)
										}
										placeholder="Enter table number"
									/>
								</div>
								{cart.map((item) => (
									<div
										key={item.id}
										className="flex flex-col gap-6 mb-5 h-ful"
									>
										<div className="flex  flex-col gap-5 justify-between px-3">
											<div className="flex flex-row justify-between">
												<div className="flex flex-col">
													<p className="font-bold">
														Name
													</p>
													<p className=" capitalize tracking-wider">
														{item.productName}
													</p>
												</div>
												<div className="flex flex-col">
													<p className="font-bold text-center">
														Quantity
													</p>
													<div className="flex flex-row gap-6  items-center">
														<Button
															type="primary"
															onClick={() =>
																increaseQuantityAndPrice(
																	item._id
																)
															}
														>
															<FaPlus />
														</Button>
														<p className="tracking-wider capitalize text-center">
															{item.quantity}
														</p>
														<Button
															type="primary"
															onClick={() =>
																decreaseQuantityAndPrice(
																	item._id
																)
															}
															// className="w-5 text-sm"
														>
															<FaMinus />
														</Button>
													</div>
												</div>
												<div className="flex flex-col">
													<p className="font-bold">
														Price
													</p>
													<p className="tracking-wider capitalize text-center">
														{item.productPrice *
															item.quantity}{" "}
														kyat
													</p>
												</div>
											</div>
											<div className=" flex flex-row gap-2">
												<Button
													type="primary"
													// className="w-10 h-10 text-xl "
													onClick={() =>
														removeFromCart(item._id)
													}
												>
													<FaRegTrashAlt />
												</Button>
											</div>
										</div>
									</div>
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
					)}
				</section>
			)}
		</>
	);
};

export default WaiterDashboard;
