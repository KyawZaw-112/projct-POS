import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:6060",
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Use this api instance for your requests
api.get("/api/products")
	.then((response) => console.log(response.data))
	.catch((error) => console.error("Error fetching products:", error));
