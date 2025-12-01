import React, { useState } from "react";
import axios from "axios";
import { Button, Divider, notification, Space } from "antd";
import { useNavigate } from "react-router-dom";
const RegisterForm = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("waiter");
	const [message, setMessage] = useState("");
    const navigate = useNavigate();

	const [api, contextHolder] = notification.useNotification();
	const openNotification = (placement, text,type) => {
		api[type]({
			message: text,
			placement,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage("");
		try {
			const response = await axios.post(
				"http://localhost:6060/api/register",
				{ username, password, role }
			);
			setMessage("Registered successfully. Please log in.");
			openNotification("top", "Registered successfully. Please log in.","success");
            navigate("/");
		} catch (error) {
			setMessage(error.response?.data?.message || "Registration failed");
			openNotification("top", error.response?.data?.message || "Registration failed","error");
		}
	};

	return (
		<div className="max-w-md mx-auto mt-10">
			{contextHolder}
			<h2 className="text-2xl font-bold mb-5">Register</h2>
			<form onSubmit={handleSubmit} className="space-y-4">
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Username"
					required
					className="w-full px-3 py-2 border rounded"
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					required
					className="w-full px-3 py-2 border rounded"
				/>
				<select
					value={role}
					onChange={(e) => setRole(e.target.value)}
					className="w-full px-3 py-2 border rounded"
				>
					<option value="waiter">Waiter</option>
					<option value="counter">Counter</option>
					<option value="kitchen">Kitchen</option>
					<option value="admin">Admin</option>
				</select>
				<button
					type="submit"
					className="w-full bg-blue-500 text-white py-2 rounded"
				>
					Register
				</button>
			</form>
		</div>
	);
};

export default RegisterForm;
