import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card } from "antd";
import tableId, { tableBtnColor } from "../api/api";
import InternalAuth from "./InternalAuth";
import BasicTable from "./ui/Table";


// import {useNavigation} from "react-router-dom"
const CounterDashboard = () => {
	const [orders, setOrders] = useState([]);
	const [error, setError] = useState(null);
	const [tables, setTables] = useState([]);
	const [selectedTable, setSelectedTable] = useState(null);
	const [selectedTableOrders, setSelectedTableOrders] = useState([]);
	const [authentication, setAuthentication] = useState(true);
	// const [api, contextHolder] = notification.useNotification();

	// const navi = useNavigation()
	const fetchOrders = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				throw new Error("No authentication token found");
			}

			const response = await axios.get(
				"http://localhost:6060/api/orders",
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			// alert("success")

			if (!response.data) {
				throw new Error("No data received from server");
				// setAuthentication(false);
			}

			setOrders(response.data);
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
				// console.log(authenticationError);

				setAuthentication(false);
				// navi("/login")
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
		fetchOrders();
	}, []);
	
	// const tableOrders = orders.filter(order=> console.log(order))
	// console.log(selectedTableOrders[0].date);
	// console.log(selectedTableOrders.id);
	// console.log(orders)
	return (
		<>
			{authentication ? (
				<section className="mt-10">
					<div className="flex flex-row items-start">
						{/* <Calculator/> */}
						{/* <h1 className="text-4xl font-bold">Order List</h1> */}
						<div className="mt-4 w-1/2">
							<h2 className="text-2xl font-semibold mb-2">
								Tables
							</h2>
							<div className="flex flex-wrap gap-2">
								{tableId.map((id) => (
									<Card
										key={id}
										className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-40 h-40 text-center text-2xl scale:100 hover:scale-110 transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center font-bold tracking-wider hover:shadow-lg"
										onClick={() => {
											const tableOrders = orders.filter(
												(order) =>
													order.table_id === id &&
													order.table_id !== null
											);
											setSelectedTableOrders(tableOrders);
											// console.log(tableOrders)
										}}
										style={{
											backgroundColor:
												tableBtnColor[id - 1],
										}}
									>
										Table {id}
									</Card>
								))}
							</div>
							{error}
						</div>
						<div className="w-1/2 h-full ">
							<h1 className="text-2xl font-semibold mb-2">
								Orders
							</h1>
							{selectedTableOrders &&
							selectedTableOrders.length > 0 ? (
								<div className="mt-4 p-4 w-full">
									<p>
										Date:{" "}
										{new Date(
											selectedTableOrders[0].date
										).toLocaleString()}
									</p>
									<BasicTable orders={selectedTableOrders} />
									
								</div>
							) : (
								<p>Select Table Number</p>
							)}
						</div>

						<p>{error}</p>
					</div>
				</section>
			) : (
				<InternalAuth />
			)}
		</>
	);
};

export default CounterDashboard;
