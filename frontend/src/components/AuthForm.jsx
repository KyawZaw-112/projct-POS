// import React, { useState } from "react";
// import axios from "axios";

// const AuthForm = ({ onLoginSuccess }) => {
// 	const [isLogin, setIsLogin] = useState(true);
// 	const [username, setUsername] = useState("");
// 	const [password, setPassword] = useState("");
// 	const [role, setRole] = useState("waiter");
// 	const [message, setMessage] = useState("");

// 	const handleSubmit = async (e) => {
// 		e.preventDefault();
// 		setMessage("");
// 		try {
// 			const endpoint = isLogin && "/api/login";
// 			const payload = isLogin
// 				? { username, password }``
// 				: { username, password, role };
// 			const response = await axios.post(
// 				`http://localhost:6060${endpoint}`,
// 				payload
// 			);

// 			if (isLogin) {
// 				localStorage.setItem("token", response.data.token);
// 				localStorage.setItem("role", response.data.role);
// 				onLoginSuccess(response.data.role);
// 			} else {
// 				setMessage("Registered successfully. Please log in.");
// 				setIsLogin(true);
// 			}
// 		} catch (error) {
// 			setMessage(error.response?.data?.message || error.message);
// 		}
// 	};

// 	return (
// 		<div className="max-w-md mx-auto mt-10">
// 			<h2 className="text-2xl font-bold mb-5">
// 				{isLogin ? "Login" : "Register"}
// 			</h2>
// 			<form onSubmit={handleSubmit} className="space-y-4">
// 				<input
// 					type="text"
// 					value={username}
// 					onChange={(e) => setUsername(e.target.value)}
// 					placeholder="Username"
// 					required
// 					className="w-full px-3 py-2 border rounded"
// 				/>
// 				<input
// 					type="password"
// 					value={password}
// 					onChange={(e) => setPassword(e.target.value)}
// 					placeholder="Password"
// 					required
// 					className="w-full px-3 py-2 border rounded"
// 				/>
// 				{!isLogin && (
// 					<select
// 						value={role}
// 						onChange={(e) => setRole(e.target.value)}
// 						className="w-full px-3 py-2 border rounded"
// 					>
// 						<option value="waiter">Waiter</option>
// 						<option value="counter">Counter</option>
// 						<option value="kitchen">Kitchen</option>
// 						<option value="admin">Admin</option>
// 					</select>
// 				)}
// 				<button
// 					type="submit"
// 					className="w-full bg-blue-500 text-white py-2 rounded"
// 				>
// 					{isLogin ? "Login" : "Register"}
// 				</button>
// 			</form>
// 			<p className="mt-4 text-center">
// 				{isLogin
// 					? "Don't have an account? "
// 					: "Already have an account? "}
// 				<button
// 					onClick={() => setIsLogin(!isLogin)}
// 					className="text-blue-500"
// 				>
// 					{isLogin ? "Register" : "Login"}
// 				</button>
// 			</p>
// 			{message && (
// 				<p className="mt-4 text-center text-red-500">{message}</p>
// 			)}
// 		</div>
// 	);
// };

// export default AuthForm;

import React, { useState } from "react";
import axios from "axios";

const AuthForm = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await axios.post(
                "http://localhost:6060/api/login",
                { username, password }
            );
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            onLoginSuccess(response.data.role);
        } catch (error) {
            setMessage(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-bold mb-5">Login</h2>
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
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded"
                >
                    Login
                </button>
            </form>
            {message && (
                <p className="mt-4 text-center text-red-500">{message}</p>
            )}
        </div>
    );
};

export default AuthForm;
