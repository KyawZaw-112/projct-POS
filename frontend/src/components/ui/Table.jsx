import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableFooter } from "@mui/material";
import { Button } from "antd";
import axios from "axios";
import { notification } from "antd";
import {useCart} from "../../context/customContext.jsx";

export default function BasicTable({ orders }) {
	const [api, contextHolder] = notification.useNotification();

	const openNotification = (text, placement) => {
		api.info({
			message: `Notification`,
			description: `${text}`,
			placement,
		});
	};

	const deleteSelectedTableOrders = async (orderId) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				throw new Error("No authentication token found");
			}

			const response = await axios.delete(
				"http://localhost:6060/api/selected-table-orders",
				{
					headers: { Authorization: `Bearer ${token}` },
					data: { orderId },
				}
			);

			if (!response.data) {
				throw new Error("No data received from server");
			}

			console.log("Order deleted successfully");
			openNotification("Order deleted successfully", "top");
			orders = [];
			// alert("Order deleted successfully")
		} catch (err) {
			console.error("Error deleting order:", err);
		}
		window.location.reload();
	};

	const totalPrice = orders[0].orders.reduce(
		(sum, order) => sum + order.quantity * order.orderPrice,
		0
	);

	const confirmOrders = async() => {
		const token = localStorage.getItem("token");
		const order_data = orders.map((order) => {
			return order;
		});
		if(!token) {
			throw new Error("No authentication token found");
			// openNotification("You're not authenticated to order","top");
		}
		try{

			const response = await axios.post(
				"http://localhost:6060/api/counter",
				{
					order_data: order_data,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			openNotification(`success`,"top");
		}catch(e){
			console.error(e)
			openNotification(`${e}`,"top");
		}

	};
	
	return (
		<div>
			{contextHolder}
			<TableContainer component={Paper}>
				<h1 className="text-xl tracking-widest my-3 mx-4 flex gap-2">
					Table No : <p className="font-bold">{orders[0].table_id}</p>{" "}
				</h1>{" "}
				<h1>{orders.productName}</h1>
				<Table sx={{ minWidth: 600 }} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell align="right">Quantity</TableCell>
							<TableCell align="right">Price</TableCell>
							<TableCell align="right">Total Price</TableCell>
							<TableCell align="right">Note</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{/* {orders.orders.map((order) => (
							
						))} */}

						{orders.map((o) =>
							o.orders.map((item) => (
								<TableRow
									key={item.id}
									sx={{
										"&:last-child td, &:last-child th": {
											border: 0,
										},
									}}
								>
									<TableCell component="th" scope="row">
										{item.orderName}
									</TableCell>
									<TableCell align="right">
										{item.quantity}
									</TableCell>
									<TableCell align="right">
										{item.orderPrice}
									</TableCell>
									<TableCell align="right">
										{item.quantity * item.orderPrice}
									</TableCell>
									<TableCell align="right">
										{item.isPacked ? "packed" : "unpacked"}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>

					<TableFooter className=" border-t-2 ">
						<TableRow>
							<TableCell colSpan={3} align="right">
								Total
							</TableCell>
							<TableCell align="right" colSpan={2}>
								{totalPrice}
							</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
				<div className="my-4 mx-4">
					<div className="flex justify-between">
						<Button type="primary" onClick={confirmOrders}>
							Confirm Order
						</Button>
						<Button
							danger
							type="primary"
							onClick={() =>
								deleteSelectedTableOrders(orders[0]._id)
							}
						>
							Delete Order
						</Button>
					</div>
				</div>
				{orders.order}
			</TableContainer>
		</div>
	);
}
