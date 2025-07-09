import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card } from "antd";
import tableId, { tableBtnColor } from "../api/api";
import InternalAuth from "./InternalAuth";
import BasicTable from "./ui/Table";
import {useCart} from "../context/customContext.jsx";

// import {useNavigation} from "react-router-dom"
const CounterDashboard = () => {
	const {orders,fetchOrders} = useCart()
	const [error, setError] = useState(null);
	const [tables, setTables] = useState([]);
	const [selectedTable, setSelectedTable] = useState(null);
	const [selectedTableOrders, setSelectedTableOrders] = useState([]);
	const [authentication, setAuthentication] = useState(true);
	// const [api, contextHolder] = notification.useNotification();

	// const navi = useNavigation()


	useEffect(() => {
		fetchOrders();
	}, []);

	return (
		<>
			{authentication ? (
				<section className="mt-10 h-screen">
					<div className="flex flex-row items-start">
						{/* <Calculator/> */}
						{/* <h1 className="text-4xl font-bold">Order List</h1> */}
						<div className=" w-1/2">
							<h2 className="text-2xl font-semibold mb-8 text-[#EFEFEF]">
								Tables
							</h2>
							<div className="flex flex-wrap gap-2">
								{tableId.map((id) => (
									<Card
										key={id}
										className="px-4 py-2 bg-blue-500 select-none text-white rounded hover:bg-blue-600 w-40 h-40 text-center text-2xl scale:100 hover:scale-110 transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center font-bold tracking-wider hover:shadow-lg"
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
						<div className="w-[700px] h-full ">
							<h1 className="text-2xl font-semibold mb-2 text-[#EFEFEF]">
								Orders
							</h1>
							{selectedTableOrders &&
							selectedTableOrders.length > 0 ? (
								<div className=" w-full">
									<p className={"text-[#EFEFEF] my-4"}>
										Date:{" "}
										{new Date(
											selectedTableOrders[0].date
										).toLocaleString()}
									</p>
									<BasicTable orders={selectedTableOrders} />
								</div>
							) : (
								<p className={"text-[#EFEFEF] text-xl font-bold tracking-wider"}>Select Table Number</p>
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
