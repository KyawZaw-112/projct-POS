import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableFooter } from "@mui/material";

function createData(name, calories, fat, carbs, protein) {
	return { name, calories, fat, carbs, protein };
}


export default function BasicTable({orders}) {
    console.log(orders);
    const totalPrice = orders.reduce((sum, order) => sum + (order.productQuantity * order.productPrice), 0);
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell align="right">Protein&nbsp;</TableCell>
						<TableCell>Name</TableCell>
						<TableCell align="right">Quantity</TableCell>
						<TableCell align="right">Price</TableCell>
						<TableCell align="right">Total Price</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{orders.map((order) => (
						<TableRow
							key={order.id}
							sx={{
								"&:last-child td, &:last-child th": {
									border: 0,
								},
							}}
						>
                            <TableCell align="right">
                                {order._id}
                            </TableCell>
							<TableCell component="th" scope="row">
								{order.productName}
							</TableCell>
							<TableCell align="right">{order.productQuantity}</TableCell>
							<TableCell align="right">{order.productPrice}</TableCell>
							<TableCell align="right">{order.productQuantity * order.productPrice}</TableCell>
							{/* <TableCell align="right">Total</TableCell> */}
						</TableRow>
					))}
				</TableBody>
                    
                <TableFooter className=" border-t-2 ">
					<TableRow>
						<TableCell colSpan={3} align="right">Total</TableCell>
						<TableCell align="right">{totalPrice}</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</TableContainer>
	);
}
