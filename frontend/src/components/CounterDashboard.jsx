import React,{useState,useEffect} from 'react'
import axios from 'axios';
const CounterDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);



	const fetchOrders = async () => {
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

			if (!response.data) {
				throw new Error("No data received from server");
			}

			setOrders(response.data);
		} catch (err) {
			console.error("Detailed error:", err);
			if (err.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				console.error("Error response:", err.response.data);
				console.error("Error status:", err.response.status);
				setError(
					`Server error: ${err.response.status} - ${
						err.response.data.message || "Unknown error"
					}`
				);
			} else if (err.request) {
				// The request was made but no response was received
				console.error("Error request:", err.request);
				setError("No response received from server");
			} else {
				// Something happened in setting up the request that triggered an Error
				console.error("Error message:", err.message);
				setError(`Error: ${err.message}`);
			}
		}
	};

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <section>
      <div>
            <h1 className='text-4xl font-bold'>Order List</h1>
            <div>
                {orders.map((order) => (
                    <div key={order._id}>
						<p> tabel : {order.table_id}</p>
                        <p> product : {order.productName}</p>
                        <p> quantity : {order.quantity}</p>
                        <p> price : {order.productPrice}</p>
                    </div>
                ))}
            </div>
            <p>{error}</p>
        </div>
    </section>
  )
}

export default CounterDashboard