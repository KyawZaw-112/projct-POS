import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
const KitchenDashboard = () => {
	const [kitchenDatas, setKitchenDatas] = useState([]);
	const [error, setError] = useState(false);
	const [authentication, setAuthentication] = useState(true);

	const fetchKitchenData = async () => {
		try {
			const token = localStorage.getItem("token");
			const response = await axios.get(
				"http://localhost:6060/api/kitchen-data",
				{
					headers: { Authorization: `Bearer ${token}` },
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

	useEffect(() => {
		fetchKitchenData();
	}, []);

	return (
		<section className=" flex flex-row gap-3 justify-center">
			{kitchenDatas.map((kitchen) => (
				// console.log(kitchen.orders)

				<div className=" border-4 px-4 py-4 border-black">
					<div className=" bg-red-500 w-12 h-12 flex justify-center items-center rounded-full">
						<h1 className=" text-white"> {kitchen.table_id}</h1>
					</div>
					{kitchen.orders.map((order) => (
						<div className="">
							<h2>Order Name : {order.orderName}</h2>
							<p>Quantity: {order.orderQuantity}</p>
							{/* <p>Price: {order.price}</p> */}
						</div>
					))}
					<Button variant="contained" color="success">
						Success
					</Button>
				</div>
			))}
		</section>
	);
};

export default KitchenDashboard;
