import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./components/AdminDashboard";
import WaiterDashboard from "./components/WaiterDashboard";
import CounterDashboard from "./components/CounterDashboard";
import KitchenDashboard from "./components/KitchenDashboard";
import AddMenu from "./components/AddMenu";
import { Button } from "antd";
import { CartProvider } from './context/customContext';
import RegisterForm from "./components/RegisterForm";

const App = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		const role = localStorage.getItem("role");
		if (token && role) {
			setIsAuthenticated(true);
			setUserRole(role);
		}
	}, []);

	const handleLoginSuccess = (role) => {
		setIsAuthenticated(true);
		setUserRole(role);
		navigate("/");
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("role");
		setIsAuthenticated(false);
		setUserRole(null);
		navigate("/login");
	};

	return (
		<CartProvider>
		<div className="container mx-auto p-4">
			{isAuthenticated && (
				<nav className="flex justify-between items-center">
					<p
						className="text-2xl font-bold capitalize cursor-pointer"
						onClick={() => navigate("/")}
					>
						{userRole} section
					</p>
					<div className="flex gap-4">
						{userRole === "counter" && (
							<Button
								onClick={() => navigate("/counter/add-menu")}
							>
								Add Menu
							</Button>
						)}
						{
							userRole === "admin" && (
								<Button type="primary" onClick={()=>navigate("/admin/register")} >
									Register
								</Button>
							)
						}
						<Button type="primary" onClick={handleLogout} danger>
							Log Out
						</Button>
					</div>
				</nav>
			)}
			<Routes>
				<Route
					path="/login"
					element={
						isAuthenticated ? (
							<Navigate to="/" replace />
						) : (
							<AuthForm onLoginSuccess={handleLoginSuccess} />
						)
					}
				/>
				<Route path="/counter/add-menu" element={<AddMenu />} />
				<Route path="/admin/register" element={<RegisterForm />} />
				<Route
					path="/"
					element={
						<ProtectedRoute>
							{userRole === "admin" && <AdminDashboard />}
							{userRole === "waiter" && <WaiterDashboard />}
							{userRole === "counter" && <CounterDashboard />}
							{userRole === "kitchen" && <KitchenDashboard />}
						</ProtectedRoute>
					}
				/>
				<Route path="/unauthorized" element={<h2>Unauthorized</h2>} />
			</Routes>
		</div>
		</CartProvider>
	);
};

export default App;
