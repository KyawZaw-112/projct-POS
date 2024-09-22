import React, { useEffect, useState } from "react";
// import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from "antd";
import { IoFastFood } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const OverviewAdmin = () => {
	const [orderCount, setOrderCount] = useState([]);
	const [userCount, setUserCount] = useState([]);
    const navigate = useNavigate()
	const fetchData = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				throw new Error("No authentication token found");
			}

			const responseOne = await axios.get(
				"http://localhost:6060/api/users",
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setUserCount(responseOne.data);
		} catch (err) {
			console.error("Detailed error:", err);
			if (err.response) {
				console.error("Error responseOne:", err.response.data);
				console.error("Error status:", err.response.status);
				// setAuthentication(false);
			} else if (err.request) {
				console.error("Error request:", err.request);
			} else {
				console.error("Error message:", err.message);
			}
		}
	};

	const fetchOrderCount = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				throw new Error("No authentication token found");
			}

			const response = await axios.get(
				"http://localhost:6060/api/orders",
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			// console.log(response.data);
			setOrderCount(response.data);
		} catch (err) {
			console.error("Detailed error:", err);
		}
	};

	useEffect(() => {
		fetchData();
		fetchOrderCount();
	}, []);

	console.log("users", userCount);
	console.log("orders", orderCount);
	return (
		<div className="">
			<Row gutter={16}>
				<Col span={6}>
					<Card bordered={true} hoverable onClick={()=>navigate('/admin/users')}>
						<Statistic
							title="Employs"
							value={userCount.length}
							// value={3}
							// precision={2}
							valueStyle={{
								color: "#3f8600",
                                fontSize:"40px"
							}}
							prefix={<FaUser />}
							// suffix="%"
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card bordered={true} hoverable>
						<Statistic
							title="Orders"
							value={orderCount.length}
                            valueStyle={
                                {
                                    fontSize:"40px"
                                }
                            }
							// precision={2}
							prefix={<IoFastFood className="text-[#43dde6]" />}
							// suffix="%"
						/>
					</Card>
				</Col>
			</Row>
			{/* {userCount} */}
		</div>
	);
};

export default OverviewAdmin;
