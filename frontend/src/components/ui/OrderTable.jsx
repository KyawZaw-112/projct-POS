import React from 'react';
import {useState, useEffect} from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import {useCart} from "../../context/customContext.jsx";
import KitchenDataTable from "./KitchenDataTable.jsx";

export default function OrderTable() {

    const {sendNotificationToWaiter,fetchKitchenData,kitchenDatas} = useCart()


    useEffect(() => {
        fetchKitchenData();
    }, []);



    return (
        <div className="relative overflow-x-auto lg:flex justify-center my-10  sm:rounded-lg">
            <KitchenDataTable kitchenDatas={kitchenDatas} sendNotificationToWaiter={sendNotificationToWaiter} />
        </div>

    );
}




