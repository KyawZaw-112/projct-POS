import React from "react";
import {useState} from "react";
import {useEffect} from "react";
import axios from "axios";
import {useCart} from "../context/customContext";
import {Badge, InputNumber} from "antd";
import {FaPlus} from "react-icons/fa6";
import {FaMinus} from "react-icons/fa6";
import {FaTrash} from "react-icons/fa";
import InternalAuth from "./InternalAuth";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {FaCartShopping} from "react-icons/fa6";
import Button from "@mui/material/Button";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {CardActionArea, CardActions, CardMedia, Typography} from "@mui/material";

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
                    headers: {Authorization: `Bearer ${token}`},
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
                <InternalAuth/>
            ) : (
                <section className="flex lg:flex-row flex-col gap-4 my-10 ">
                    <section
                        className="flex flex-wrap flex-col md:flex-row items-center gap-6 h-full md:w-[700px] w-full justify-center lg:w-screen ">
                        {menus.map((menu) => (
                            <Badge.Ribbon
                                text={menu?.productCategory}
                                color="volcano"
                                key={menu._id}
                            >
                                <Card sx={{minWidth: 300}} style={{
                                    width: "375px",
                                    backgroundColor: `#EC5228`
                                }}
                                      className=" cursor-pointer bg-[#3F7D58] text-[#EFEFEF]">

                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image="/static/images/cards/contemplative-reptile.jpg"
                                        alt="green iguana"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom className={"text-2xl tracking-wider text-[#EFEFEF]"}
                                                    component="div">
                                            နာမည် : {menu.productName}
                                        </Typography>
                                        <Typography variant="body2" sx={{color: '#EFEFEF'}}>
                                            စျေးနှုန်း : {menu.productPrice}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        {menu.productQuantity === 0 ? (
                                            <button
                                                variant="outlined"
                                                onClick={() => addToCart(menu)}
                                                className="w-[30px] h-[50px] border-[#EFEFEF]"
                                                disabled
                                            >
                                                <p className={"text-2xl text-[#EFEFEF]/40"}>
                                                    <FaCartShopping/>
                                                </p>
                                            </button>
                                        ) : (
                                            <button
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => addToCart(menu)}
                                                className="w-[30px] h-[50px] border-[#EFEFEF]"
                                            >
                                                <p className={"text-2xl text-[#EFEFEF]"}>
                                                    <FaCartShopping/>
                                                </p>
                                            </button>
                                        )
                                        }
                                    </CardActions>
                                </Card>
                            </Badge.Ribbon>
                        ))}
                    </section>
                    {cart.length !== 0 && (
                        <>
                            <section
                                className=" flex flex-col gap-5 md:w-full lg:w-[800px] h-full bg-[#EFEFEF] py-6 px-3">
                                <h2 className="text-2xl font-bold text-center text-[#EFEFEF]">
                                    စျေးခြင်းတောင်း
                                </h2>
                                <div className="flex flex-row gap-2 px-3">
                                    <label htmlFor="">Table No : </label>
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
                                <TableContainer component={Paper}>
                                    <Table
                                        sx={{minWidth: 650}}
                                        aria-label="simple table"
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Name</TableCell>
                                                <TableCell align="left">
                                                    Quantity
                                                </TableCell>
                                                <TableCell align="center">
                                                    Price
                                                </TableCell>
                                                <TableCell align="center">
                                                    Action
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {cart.map((row) => (
                                                <TableRow
                                                    key={row._id}
                                                    sx={{
                                                        "&h:last-cild td, &:last-child th":
                                                            {border: 0},
                                                    }}
                                                >
                                                    <TableCell
                                                        component="th"
                                                        scope="row"

                                                    >
                                                        <p className={"text-[#EC5228]"}>
                                                            {row.productName}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <div className="flex flex-row gap-6  items-center">
                                                            <button
                                                                variant="contained"
                                                                onClick={() =>
                                                                    increaseQuantityAndPrice(
                                                                        row._id
                                                                    )
                                                                }
                                                                className={"text-[#EC5228]"}
                                                            >
                                                                <FaPlus/>
                                                            </button>
                                                            <p className="tracking-wider capitalize text-center text-[#EC5228]">
                                                                {row.quantity}
                                                            </p>
                                                            <button
                                                                variant="contained"
                                                                onClick={() =>
                                                                    decreaseQuantityAndPrice(
                                                                        row._id
                                                                    )
                                                                }
                                                                className={"text-[#EC5228]"}
                                                                // className="w-5 text-sm"
                                                            >
                                                                <FaMinus/>
                                                            </button>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <p className={"text-[#EC5228]"}>
                                                            {row.productPrice}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <button
                                                            variant="contained"
                                                            color="error"
                                                            onClick={() =>
                                                                removeFromCart(
                                                                    row._id
                                                                )
                                                            }
                                                        >
                                                            <p className={"text-red-500"}>
                                                                <FaTrash/>
                                                            </p>
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {cart.length > 0 && (
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => sendOrderToServer(cart)}
                                        className="mx-3 py-4 px-3 tracking-wider w-[150px] h-[40px] text-base"
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

// <Card sx={{ maxWidth: 345 }}>


//             </Card>