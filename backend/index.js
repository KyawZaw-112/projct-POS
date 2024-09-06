import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
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

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	role: {
		type: String,
		enum: ["admin", "counter", "waiter", "kitchen"],
		required: true,
	},
});

const UserModel = mongoose.model("users", userSchema);

const menuSchema = new mongoose.Schema({
	productName: String,
	productPrice: Number,
	productDescription: String,
	productImage: String,
	productCategory: String,
	productAvailability: Boolean,
	productQuantity: Number,
	productPrice: Number,
	productStatus: String,
	productDate: Date,
	productTime: Date,
	productLocation: String,
	productRating: Number,
	// productReviews: [String],
	// productTags: [String],
	// productImages: [String],
});

const MenuModel = mongoose.model("menu", menuSchema);

// Login route
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
			{ expiresIn: "24h" }
		);
		res.json({ token, role: user.role });
	} catch (error) {
		res.status(500).json({ message: error.message });
		console.log(error);
	}
});
// Registration route
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

// Authentication middleware
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

// Make sure this middleware is applied correctly
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

const orderSchema = new mongoose.Schema({
	productName: String,
	productPrice: Number,
	productQuantity: Number,
	table_id: Number,
	date:Number,
	// status: String
});

const OrderModel = mongoose.model("orders", orderSchema);

app.post("/api/orders", authenticate, async (req, res) => {
	try {
		const { items, tableNumber } = req.body;
		const userId = req.user.id;

		if (!Array.isArray(items) || items.length === 0) {
			return res.status(400).json({ message: "Invalid order items" });
		}

		const orders = items.map(item => ({
			productName: item.productName,
			productPrice: item.productPrice,
			productQuantity: item.quantity,
			table_id: tableNumber,
			userId: userId,
			date:new Date(req.body.year,req.body.month,req.body.day)
		}));

		const result = await OrderModel.insertMany(orders);

		res.status(201).json({
			message: "Orders placed successfully",
			orders: result
		});
	} catch (error) {
		console.error("Error placing orders:", error);
		res.status(500).json({
			message: "Failed to place orders",
			error: error.message
		});
	}
});


app.get(
	"/api/orders",
	authenticate,
	(req, res, next) => {
		if (req.user.role !== "counter") {
			return res
				.status(403)
				.json({ message: "Access denied. Waiter role required." });
		}
		next();
	},
	async (req, res) => {
		// Your existing code to fetch products
		const orders = await OrderModel.find();
		res.json(orders);
	}
);

app.get("/api/users", authenticate, async (req, res) => {
	try {
		const users = await UserModel.find();
		res.json(users);
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ message: "Failed to fetch users", error: error.message });
	}
});

app.delete("/api/users/:id", authenticate, async (req, res) => {
	try {
		const userId = req.params.id;
		await UserModel.findByIdAndDelete(userId);
		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		console.error("Error deleting user:", error);
		res.status(500).json({ message: "Failed to hi user", error: error.message });
	}
});

app.post("/api/products", authenticate, async (req, res, next) => {
	if (req.user.role !== "counter") {
		return res
			.status(403)
			.json({ message: "Access denied. Counter role required." });
	}

	try {
		const { productName, productPrice, productQuantity } = req.body;

		// Validate input
		if (!productName || !productPrice || !productQuantity) {
			return res.status(400).json({ message: "All fields are required" });
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
		});

		await newProduct.save();

		res.status(201).json({
			message: "Product added successfully",
			product: newProduct,
		});
	} catch (error) {
		console.error("Error adding product:", error);
		next(error); // Pass error to error handling middleware
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
