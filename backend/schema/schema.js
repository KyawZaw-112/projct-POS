import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	role: {
		type: String,
		enum: ["admin", "counter", "waiter", "kitchen"],
		required: true,
	},
});

export const menuSchema = new mongoose.Schema({
	productName: String,
	productPrice: Number,
	productDescription: String,
	productImage: String,
	productCategory: {
		type: String,
		enum: ["Food", "Drink", "Dessert", "Other"],
		required: true,
	},
	productAvailability: Boolean,
	productQuantity: Number,
	productPrice: Number,
	productStatus: String,
	productDate: Date,
	productTime: Date,
	productLocation: String,
	productRating: Number,
});

export const orderSchema = new mongoose.Schema({
	orderName: String,
	orderPrice: Number,
	orderQuantity: Number,
	table_id: Number,
	date:Number,
	// status: String
});

export const KitchenSchema = new mongoose.Schema({
	date: String,
	table_id: Number,
	productName: String,
	productPrice: Number,
	productQuantity: Number,
	productStatus: String,
});