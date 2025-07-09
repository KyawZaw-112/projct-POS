import {Button, Modal} from "antd";
import React, {useEffect, useState} from "react";
import {useCart} from "../context/customContext";
import {IconButton} from "@mui/material";
import {FaBell} from "react-icons/fa";
import Badge from "@mui/material/Badge";
import axios from "axios";

const Info = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {notifications, fetchNotifications,deleteNotification} = useCart();

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        fetchNotifications();
        // deleteNotification();
    }, [])

    return (
        <>
            <IconButton onClick={showModal}>
                <FaBell className={"text-[#EFEFEF]"}/>
                <Badge anchorOrigin={{vertical: "top", horizontal: "right"}} badgeContent={notifications.length}
                       color="primary" overlap="circular"/>
            </IconButton>
            <Modal
                title="Notifications"
                closable={{'aria-label': 'Custom Close Button'}}
                open={isModalOpen}
                onClose={handleCancel}
                footer={null}
                onCancel={handleCancel}
            >
                {notifications.length === 0 && (
                    <div>
                        <h1 className={"text-xl tracking-wider font-semibold text-center my-4 py-3"}>There is no complete orders</h1>
                    </div>
                )}
                {notifications.map((notification) => (
                    <section className={"my-5 flex flex-col gap-2"}>
                        <p key={notification._id}>Table Number : {notification.table_id}'s orders ready</p>
                        <div className={"flex flex-col gap-4 py-4"}>
                            {
                                notification.orders.map((order) => (
                                    <div className={"flex flex-row"} key={order._id}>
                                        <p className={"flex gap-5 w-[140px]"}>
                                            <p>
                                                {order.orderName}
                                            </p>
                                            <p>:</p>
                                            <p>
                                                {order.quantity}
                                            </p>
                                        </p>
                                    </div>
                                ))
                            }
                        </div>
                        <Button type={"primary"} onClick={() => deleteNotification(notification._id)} className={"w-1/6 h-10"}>
                            <p className={"tracking-widest font-semibold"}>Done</p>
                        </Button>
                        <hr/>
                    </section>
                ))}
            </Modal>
        </>
    )
};

export default Info;