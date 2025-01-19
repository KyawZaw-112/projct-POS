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
		contextHolder,
		isPacked,
		handlePacked,
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

	return (
		<>
			{contextHolder}
			{error ? (
				<InternalAuth />
			) : (
				<section className="flex lg:flex-row flex-col gap-4 my-10">
					<section className="flex flex-wrap flex-col md:flex-row gap-6 h-full md:w-[700px] justify-center lg:w-[900px] ">
						{menus.map((menu) => (
							<div
								key={menu._id}
								className=" border-2 gap-5 rounded-lg flex flex-col border-gray-300 p-4 md:w-[200px] lg:w-[200px]"
							>
								<h2 className="text-xl font-bold ">
									အမည် : {menu.productName}
								</h2>
								<p className="text-gray-500">
									စျေးနှုန်း : {menu.productPrice}
								</p>
								{menu.productQuantity === 0 ? (
									<p className=" text-rose-600">ပစ္စည်းမရှိတော့ပါ</p>
								) : (
									<p className="text-gray-500">
										အရေအတွက် : {menu.productQuantity}
									</p>
								)}
								{menu.productQuantity === 0 ? (
									<Button
										type="primary"
										onClick={() => addToCart(menu)}
										disabled
										className="w-full text-lg h-[50px] flex justify-center items-center"
									>
										ဝယ်ယူမည်
									</Button>
								) : (
									<Button
										type="primary"
										onClick={() => addToCart(menu)}
										className="w-full text-lg h-[50px] flex justify-center items-center"
									>
										ဝယ်ယူမည်
									</Button>
								)}
							</div>
						))}
					</section>
					{cart.length !== 0 && (
						<>
							<section className=" flex flex-col gap-5 md:w-full lg:w-[800px] h-full bg-slate-300 py-6 px-3">
								<h2 className="text-2xl font-bold text-center">
									စျေးခြင်းတောင်း
								</h2>
								<div className="flex flex-row gap-2 px-3">
									<label htmlFor="">ထိုင်ခုံအမှတ် : </label>
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
													<p className="font-bold mb-5">
														အမည်
													</p>
													<p className=" capitalize text-lg tracking-wider">
														{item.productName}
													</p>
												</div>
												<div className="flex flex-col">
													<p className="font-bold mb-5 text-center">
														အ‌ရေအတွက်
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
													<p className="font-bold mb-5">
														စျေးနှုန်း
													</p>
													<p className="tracking-wider capitalize text-center">
														{item.productPrice *
															item.quantity}{" "}
														kyat
													</p>
												</div>
												<div className="flex flex-col">
													<p className="font-bold mb-5">
														ပါဆယ်
													</p>
													<p className="tracking-wider capitalize text-center">
														<input
															type="checkbox"
															value={isPacked}
															onChange={
																handlePacked
															}
														/>
													</p>
												</div>
												<div className="ml-5 flex flex-col">
													<p className="font-bold mb-5">လုပ်ဆောင်ချက်</p>
													<Button
														type="primary"
														// className="w-10 h-10 text-xl "
														onClick={() =>
															removeFromCart(
																item._id
															)
														}
													>
														<FaRegTrashAlt />
													</Button>
												</div>
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
										လုပ်ဆောင်မည်
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
