import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import {
	userSchema,
	menuSchema,
	orderSchema,
	KitchenSchema,
} from "./schema/schema.js";
const app = express();

app.use(express.json());
app.use(cors());

mongoose
	.connect("mongodb://localhost:27017/menu_db")
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((err) => {
		console.log(err);
	});

const UserModel = mongoose.model("users", userSchema);

const MenuModel = mongoose.model("menu", menuSchema);

const OrderModel = mongoose.model("orders", orderSchema);

const KitchenModel = mongoose.model("kitchen", KitchenSchema);

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, "public/menu_images");
	},
	filename: (req, file, callback) => {
		callback(null, `${Date.now()}_{$file.originalname}`);
	},
});

const upload = multer({ storage: storage });

app.post("/api/login", async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await UserModel.findOne({ username, password });
		if (!user) {
			return res
				.status(400)
				.json({ message: "Invalid username or password" });
		}
		const token = jwt.sign(
			{ id: user._id, role: user.role },
			"your_jwt_secret",
			{ expiresIn: "10h" }
		);
		res.json({ token, role: user.role });
	} catch (error) {
		res.status(500).json({ message: error.message });
		console.log(error);
	}
});

app.post("/api/register", async (req, res) => {
	const { username, password, role } = req.body;
	try {
		const existingUser = await UserModel.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ message: "Username already exists" });
		}
		const newUser = new UserModel({
			username,
			password,
			role,
		});
		await newUser.save();
		res.status(201).json({ message: "User created successfully" });
	} catch (error) {
		// res.status(500).json({ message: error.message });
		console.log(error);
	}
});

const checkRole = (roles) => (req, res, next) => {
	const userRole = req.user.role;
	if (roles.includes(userRole)) {
		next();
	} else {
		res.status(403).json({ message: "Forbidden" });
	}
};

const authenticate = (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN
	if (!token) {
		return res.status(401).json({ message: "No token provided" });
	}

	jwt.verify(token, "your_jwt_secret", (err, decoded) => {
		if (err) {
			console.error("JWT verification error:", err);
			// return res.sendStatus(403).json({ message: "Please login again" });
		}
		req.user = decoded;
		next();
	});
};

app.use(authenticate);

app.get("/api/admin", checkRole(["admin"]), (req, res) => {
	res.json({ message: "Welcome Admin" });
});

app.get("/api/counter", checkRole(["counter"]), (req, res) => {
	res.json({ message: "Welcome Counter Staff" });
});

app.get("/api/waiter", checkRole(["waiter"]), (req, res) => {
	res.json({ message: "Welcome Waiter" });
});

app.get("/api/kitchen", checkRole(["kitchen"]), (req, res) => {
	res.json({ message: "Welcome Kitchen Staff" });
});

//waiter fetch menu data
app.get(
	"/api/products",
	authenticate,
	(req, res, next) => {
		if (req.user.role !== "waiter") {
			return res
				.status(403)
				.json({ message: "Access denied. Waiter role required." });
		}
		next();
	},
	async (req, res) => {
		// Your existing code to fetch products
		const products = await MenuModel.find();
		res.json(products);
	}
);

app.post(
	"/api/orders",
	authenticate,
	async (req, res, next) => {
		if (req.user.role !== "waiter") {
			return res
				.status(403)
				.json({ message: "Access denied. Waiter role required." });
		}
		next();
	},
	async (req, res) => {
		if (!req.body.orders || req.body.orders.length === 0) {
			return res.status(400).json({ error: "Order cannot be empty" });
		}
		try {
			const { orders, tableNumber } = req.body;
			console.log(req.body);
			const existingOrder = await OrderModel.findOne({ table_id: tableNumber });
			// Validate the input data
			if (!orders) {
				return res.status(400).json({ error: "Invalid request data" });
			}
			
			const orderDocuments = orders.map((order) => ({
				orders: orders,
				table_id: tableNumber,
				date: Date.now(),
			}));
			// await order.insertMany();
			await OrderModel.insertMany(orderDocuments);
			if (existingOrder) {
				existingOrder.orders = [...existingOrder.orders, ...orders];
				await existingOrder.save();
			}
			res.status(200).json({ message: "Orders created successfully" });
		} catch (error) {
			console.error("Error creating order:", error);
			// res.status(404).json({ message: "Error creating order})
			res.status(500).json({ error: "Failed to create order" });
		}
	}
);

app.get(
	"/api/orders",
	authenticate,
	async (req, res, next) => {
		// const admin = req.user.role
		const counter = req.user.role;

		if (counter !== "counter") {
			return res.status(403).json({
				message: "Access denied. counter or admin role required.",
			});
		}
		next();
	},
	async (req, res) => {
		// Your existing code to fetch products
		const orders = await OrderModel.find();
		res.json(orders);
	}
);

//admin fetch user data
app.get("/api/users", authenticate, async (req, res) => {
	try {
		const users = await UserModel.find();
		res.json(users);
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({
			message: "Failed to fetch users",
			error: error.message,
		});
	}
});

//admin delete user
app.delete("/api/users/:id", authenticate, async (req, res) => {
	try {
		const userId = req.params.id;
		await UserModel.findByIdAndDelete(userId);
		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		console.error("Error deleting user:", error);
		res.status(500).json({
			message: "Failed to hi user",
			error: error.message,
		});
	}
});

//counter post the new menu
app.post(
	"/api/products",
	upload.single("file"),
	authenticate,
	async (req, res, next) => {
		if (req.user.role !== "counter") {
			return res
				.status(403)
				.json({ message: "Access denied. Counter role required." });
		}

		try {
			const {
				productName,
				productPrice,
				productQuantity,
				productCategory,
			} = req.body;

			// const {productImage} = req.file

			console.log(req.file);

			// Validate input
			if (
				!productName ||
				!productPrice ||
				!productQuantity ||
				!productCategory
			) {
				return res
					.status(400)
					.json({ message: "All fields are required" });
			}

			// Ensure price and quantity are numbers
			if (isNaN(productPrice) || isNaN(productQuantity)) {
				return res
					.status(400)
					.json({ message: "Price and quantity must be numbers" });
			}

			const newProduct = new MenuModel({
				productName,
				productPrice: Number(productPrice),
				productQuantity: Number(productQuantity),
				productCategory,
			});

			await newProduct.save();

			res.status(201).json({
				message: "Product added successfully",
				product: newProduct,
			});
			// console.log(productImage);
		} catch (error) {
			console.error("Error adding:", error);
			next(error); // Pass error to error handling middleware
		}
	}
);

app.delete(
	"/api/selected-table-orders",
	authenticate,
	async (req, res, next) => {
		if (req.user.role !== "counter") {
			return res
				.status(403)
				.json({ message: "Access denied. Counter role required." });
		}
		try {
			const { orderId } = req.body;
			console.log("Received order ID for deletion:", orderId);

			const deletedOrder = await OrderModel.findByIdAndDelete(orderId);

			if (!deletedOrder) {
				return res.status(404).json({ message: "Order not found" });
			}

			console.log("Deleted order:", deletedOrder);

			res.status(200).json({
				message: "Order deleted successfully",
				deletedOrder,
			});
		} catch (error) {
			console.error("Error in order deletion route:", error);
			res.status(500).json({
				message: "Failed to delete order",
				error: error.message,
			});
		}
	}
);

//counter post the kitchen data
app.post("/api/orders/confirm", authenticate, async (req, res, next) => {
	if (req.user.role !== "counter") {
		return res
			.status(403)
			.json({ message: "Access denied. Counter role required." });
	}
	next();

	try {
		const { table_id, productName, productQuantity } = req.body;
		console.log("Received orders for confirmation:", {
			table_id,
			productName,
			productQuantity,
		});

		const confirmedOrders = new KitchenModel({
			table_id,
			productName,
			productQuantity,
		});

		await confirmedOrders.save();

		console.log("Confirmed orders:", confirmedOrders);

		res.status(200).json({
			message: "Orders processed",
			confirmedCount: confirmedOrders.length,
			orders: confirmedOrders,
		});
	} catch (error) {
		console.error("Error in order confirmation route:", error);
		res.status(500).json({
			message: "Failed to process orders",
			error: error.message,
		});
	}
});

//kitchen fetch order data
app.get("/api/orders", authenticate, async (req, res, next) => {
	if (req.user.role !== "counter") {
		return res
			.status(403)
			.json({ message: "Access denied. Kitchen role required." });
	}
	next();
	try {
		const orders = await OrderModel.find();
		res.json(orders);
	} catch (error) {
		console.error("Error fetching orders:", error);
		res.status(500).json({
			message: "Failed to fetch orders",
			error: error.message,
		});
	}
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		message: "Please login again",
		error:
			process.env.NODE_ENV === "development"
				? console.log(err.message)
				: "Error",
	});
});

// 404 Not Found handler
app.use((req, res, next) => {
	res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 6060;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
