import React from 'react';
import Button from "@mui/material/Button";

const KitchenDataTable = ({kitchenDatas,sendNotificationToWaiter}) => {
    return (
        <div className={"h-screen"}>
            {
                kitchenDatas.length === 0 ?
                    (
                        <div className={"h-[82.5vh] flex items-center justify-center"}>

                        <h1 className={"text-6xl text-[#EFEFEF] font-bold tracking-widest text-center"}>There is no order</h1>
                        </div>
                    )
                    :
                    (

            <table
                className="w-full lg:w-[800px] xl:w-[1300px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead
                    className="text-xs md:text-sm lg:text-lg xl:2xl text-white uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3 xl:py-6 xl:text-center text-white">
                        Table Number
                    </th>
                    <th scope="col" className="px-6 py-3 xl:py-6 text-white">
                        Orders
                    </th>
                    <th scope="col" className="px-6 py-3 xl:py-6 text-white">
                        Action
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    kitchenDatas.map((kitchenData) => (

                        <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
                            <th scope="row"
                                className="px-6 w-[90px] lg:w-[200px] xl:w-[300px] lg:text-center  py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {kitchenData.table_id}
                            </th>
                            {
                                kitchenData.orders.map((order) => (
                                    <ul className="px-6 py-4 list-disc flex">
                                        <li className="flex flex-row gap-2 lg:gap-5 text-white">
                                            <p>
                                                {order.orderName}
                                            </p>
                                            :
                                            <p>
                                                {order.quantity}
                                            </p>
                                        </li>

                                    </ul>
                                ))
                            }
                            <td className="px-6 py-4 w-[50px]">
                                <Button
                                    onClick={() =>
                                        sendNotificationToWaiter({
                                            kitchenData
                                        })
                                    }
                                    variant={"contained"}
                                    color="success"
                                >
                                    Done
                                </Button>
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
                )
            }
        </div>
    );
};

export default KitchenDataTable;