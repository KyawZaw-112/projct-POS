import { Button, Space, Table } from "antd";
import { notification } from "antd";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserTable = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("token"));
	const [isPassword, setIsPassword] = useState(true);
	const [filterInfo, setFilterInfo] = useState({});
	const [api, contextHolder] = notification.useNotification();
	const navigate = useNavigate();

	const openNotification = (placement, text) => {
		api.info({
			message: `Notification ${text}`,
			placement,
		});
	};

	const fetchUsers = async () => {
		try {
			const response = await axios.get(
				"http://localhost:6060/api/users",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setUsers(response.data);
			window.reload();
			setLoading(false);
		} catch (err) {
			setError("Failed to fetch users");
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleClick = () => {
		if (isPassword) {
			setIsPassword(false);
		} else {
			setIsPassword(true);
		}
	};

	const handleFilterChange = (pagination, filters) => {
		console.log("Various Parameters", filters, "pagination", pagination);
		setFilterInfo(filters);
	};

	const handleClearFilters = () => {
		setFilterInfo({});
	};

	const columns = [
		{
			title: <p className="text-2xl tracking-widest">Name</p>,
			dataIndex: "name",
			key: "name",
			sorter: (a, b) => a.name.localeCompare(b.name),
			render: (a) => (
				<p className="font-semibold text-lg tracking-widest">{a}</p>
			),
		},
		{
			title: (
				<div className="flex flex-row items-center justify-between">
					<p className="text-2xl tracking-widest">Password</p>{" "}
					<Button onClick={handleClick}>Show password</Button>
				</div>
			),
			dataIndex: "password",
			key: "password",
			render: (a) => (
				<div className="flex flex-row items-center justify-between">
					<p className="font-semibold text-lg tracking-widest">
						{isPassword ? "********" : a}
					</p>
				</div>
			),
		},
		{
			title: <p className="text-2xl tracking-widest">Role</p>,
			dataIndex: "role",
			key: "role",
			// sorter: (a, b) => a.role.localeCompare(b.role),
			filters: [
				{
					text: "Admin",
					value: "admin",
				},
				{
					text: "Waiter",
					value: "waiter",
				},
				{
					text: "Counter",
					value: "counter",
				},
				{
					text: "Kitchen",
					value: "kitchen",
				},
			],
			// onFilter: (value, record) => record.role.includes(value),
			filteredValue: filterInfo.role || null,
			onFilter: (value, record) => {
				console.log(value, record.role);
				return record.role.includes(value);
			},
			render: (a) => (
				<p className="font-semibold text-lg tracking-widest capitalize">
					{a}
				</p>
			),
		},

		{
			title: <p className="text-2xl tracking-widest">Action</p>,
			key: "action",
			render: (text, user) => (
				<Space direction="horizontal">
					<Button>Delete</Button>
				</Space>
			),
		},
	];

	const dataSource = users.map((user) => ({
		key: user._id,
		name: user.username,
		password: user.password,
		role: user.role,
		id: user._id,
	}));

	const handleDelete = async (userId) => {
		try {
			const response = await axios.delete(
				`http://localhost:6060/api/users/${userId}`,
				{
					// Authorization: `Bearer ${token}`,
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				}
			);
			openNotification("top", "User deleted successfully");

			if (response.ok) {
				// Remove the deleted user from the local state
				setUsers(users.filter((user) => user._id !== userId));
				openNotification("top", "User deleted successfully");
				// message.success('User deleted successfully');
			}
			return false;
		} catch (error) {
			openNotification("top", "Failed to  user");
		}
	};

	// Update the 'Action' column in the columns array
	columns[columns.length - 1].render = (text, user) => (
		<Space direction="horizontal">
			<Button onClick={() => handleDelete(user.id)} type="primary" danger>
				Delete
			</Button>
		</Space>
	);

	return (
		<section className="my-10 mx-4">
			{contextHolder}
			<div className="w-full flex flex-row justify-between my-5">
				<Button onClick={handleClearFilters}>Clear Filters</Button>
				<Button onClick={() => navigate(-1)}>Back</Button>
			</div>

			<Table
				className="mt-4"
				columns={columns}
				dataSource={dataSource}
				pagination={{ position: ["none"] }}
				onChange={handleFilterChange}
			/>
		</section>
	);
};

export default UserTable;
