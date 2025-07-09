import React, {useState, useEffect} from "react";
import {Route, Routes, Navigate, useNavigate} from "react-router-dom";
import AuthForm from "./components/AuthForm";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./components/AdminDashboard";
import WaiterDashboard from "./components/WaiterDashboard";
import CounterDashboard from "./components/CounterDashboard";
import KitchenDashboard from "./components/KitchenDashboard";
import AddMenu from "./components/AddMenu";
import {CartProvider} from "./context/customContext";
import RegisterForm from "./components/RegisterForm";
import Billing from "./components/Billing";
import UserTable from "./components/UserTable";
import {Button} from "antd";
import Modal from "./components/Modal.jsx";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [username, setUsername] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const showModal = () => {
        setIsModalOpen(!isModalOpen);
    };


    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const username = localStorage.getItem("username");


        if (token && role) {
            setIsAuthenticated(true);
            setUserRole(role);
            setUsername(username);
        }
    }, []);

    const handleLoginSuccess = (role, username) => {
        setIsAuthenticated(true);
        setUserRole(role);
        setUsername(username);
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
            <div className=" mx-auto p-4 bg-[#EC5228]/70 h-full">
                {isAuthenticated && (
                    <nav className="flex justify-between items-center">
                        <div
                            className="text-lg flex capitalize cursor-pointer gap-2 items-center"
                            onClick={() => navigate("/")}
                        >
                            <p className={"text-[#EFEFEF] tracking-widest"}>
                                {username}
                            </p>
                            <p className={"text-sm font-bold text-[#EFEFEF] tracking-widest"}>
                                ({userRole})
                            </p>
                        </div>
                        <div className="flex gap-4">
                            {userRole === "counter" && (
                                <>
                                    <Button
                                        onClick={() =>
                                            navigate("/counter/add-menu")
                                        }
                                    >
                                        Add Menu
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            navigate("/counter/billing")
                                        }
                                    >
                                        Billing
                                    </Button>
                                </>
                            )}
                            {userRole === "admin" && (
                                <Button
                                    type="primary"
                                    onClick={() => navigate("/admin/register")}
                                >
                                    Register
                                </Button>
                            )}

                            {
                                userRole === "waiter" && (
                                    <>
                                    <Modal />
                                    </>

                                )
                            }
                            <Button
                                type="primary"
                                onClick={handleLogout}
                                danger
                            >
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
                                <Navigate to="/" replace/>
                            ) : (
                                <AuthForm onLoginSuccess={handleLoginSuccess}/>
                            )
                        }
                    />
                    <Route path="/counter/add-menu" element={<AddMenu/>}/>
                    <Route path="/counter/billing" element={<Billing/>}/>
                    <Route path="/admin/register" element={<RegisterForm/>}/>
                    <Route path="/admin/users" element={<UserTable/>}/>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                {userRole === "admin" && <AdminDashboard/>}
                                {userRole === "waiter" && <WaiterDashboard/>}
                                {userRole === "counter" && <CounterDashboard/>}
                                {userRole === "kitchen" && <KitchenDashboard/>}
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/unauthorized"
                        element={<h2>Unauthorized</h2>}
                    />
                </Routes>
            </div>
        </CartProvider>
    );
};

export default App;
