import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button } from "antd";
import axios from "axios";
import { useCart } from "../context/customContext";
import { InputNumber } from "antd";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import InternalAuth from "./InternalAuth";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Card, Badge } from "antd";
import { CiShoppingCart } from "react-icons/ci";
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
	console.log(menus);

	return (
		<>
			{contextHolder}
			{error ? (
				<InternalAuth />
			) : (
				<section className="flex lg:flex-row flex-col gap-4 my-10">
					<section className="flex flex-wrap flex-col md:flex-row gap-6 h-full md:w-[700px] justify-center lg:w-screen ">
						{menus.map((menu) => (
							<Badge.Ribbon
								text={menu?.productCategory}
								color="volcano"
							>
								<Card
									title={menu.productName}
									bordered={false}
									style={{
										width: 300,
									}}
									key={menu._id}
									className=" cursor-pointer"
								>
									<p className=" mb-4">
										စျေးနှုန်း : {menu.productPrice}
									</p>
									<p className=" mb-4">Card content</p>
									{menu.productQuantity === 0 ? (
										<Button
											variant="outlined"
											onClick={() => addToCart(menu)}
											disabled
											className="w-[20%] text-lg h-[50px] flex justify-center items-center"
										>
											<CiShoppingCart />
										</Button>
									) : (
										<Button
											variant="outlined"
											onClick={() => addToCart(menu)}
											className="w-[20%] text-lg h-[50px] flex justify-center items-center"
										>
											<CiShoppingCart />
										</Button>
									)}
								</Card>
							</Badge.Ribbon>
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
								{/* {cart.map((item) => (
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
															name={
																item.productName
															}
															onChange={
																handlePacked
															}
														/>
													</p>
												</div>
												<div className="ml-5 flex flex-col">
													<p className="font-bold mb-5">
														လုပ်ဆောင်ချက်
													</p>
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
								))} */}
								<TableContainer component={Paper}>
									<Table
										sx={{ minWidth: 650 }}
										aria-label="simple table"
									>
										<TableHead>
											<TableRow>
												<TableCell>အမည်</TableCell>
												<TableCell align="left">
													အရေအတွက်
												</TableCell>
												<TableCell align="right">
													‌‌စျေးနှုန်း
												</TableCell>
												<TableCell align="right">
													လုပ်ဆောင်ချက်
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{cart.map((row) => (
												<TableRow
													key={row._id}
													sx={{
														"&:last-child td, &:last-child th":
															{ border: 0 },
													}}
												>
													<TableCell
														component="th"
														scope="row"
													>
														{row.productName}
													</TableCell>
													<TableCell align="center">
														<div className="flex flex-row gap-6  items-center">
															<Button
																type="primary"
																onClick={() =>
																	increaseQuantityAndPrice(
																		row._id
																	)
																}
															>
																<FaPlus />
															</Button>
															<p className="tracking-wider capitalize text-center">
																{row.quantity}
															</p>
															<Button
																type="primary"
																onClick={() =>
																	decreaseQuantityAndPrice(
																		row._id
																	)
																}
																// className="w-5 text-sm"
															>
																<FaMinus />
															</Button>
														</div>
													</TableCell>
													<TableCell align="right">
														{row.productPrice}
													</TableCell>
													<TableCell align="right">
														<Button
															type="primary"
															danger
															onClick={() =>
																removeFromCart(
																	row._id
																)
															}
														>
															<FaRegTrashAlt />
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
								{cart.length > 0 && (
									<Button
										type="primary"
										// onClick={() => sendOrder()}
										onClick={() => sendOrderToServer(cart)}
										className="mx-3 py-4 px-3 tracking-wider w-[150px] h-[40px] text-base"
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
