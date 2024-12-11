import React, { useState, useEffect } from 'react';
import './HistoryOrder.css';
import { getAllOrder } from "../../services/orderService";
import Navbar from "../../components/Navbar";

function HistoryOrder() {
	const [fetchHistoryOrder, setFetchHistoryOrder] = useState([]);

	const userInfo = localStorage.getItem("user");
	const user = userInfo ? JSON.parse(userInfo) : null;

	useEffect(() => {
		console.log('check user', user.id);

		const fetchProduct = async () => {
			try {
				const response = await getAllOrder("ALL");
				const userOrders = response.carts.filter((cart) => cart.userId === user.id);
				setFetchHistoryOrder(userOrders);
			} catch (error) {
				console.log("fetch Product error", error);
			}
		};
		fetchProduct();
	}, [user.id]);

	return (
		<>
			<Navbar />
			<div className="history-order-container">
				<h2>Lịch sử đơn hàng</h2>
				<div className="table-wrapper">
					<table className="order-table">
						<thead>
							<tr>
								<th>#</th>
								<th>Order ID</th>
								<th>Product</th>
								<th>Side Dishes</th>
								<th>Payment</th>
								<th>Status</th>
								<th>Datetime</th>
								<th>Address</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>
							{fetchHistoryOrder.map((order, index) => (
								<tr key={order._id}>
									<td>{index + 1}</td>
									<td>{order._id}</td>
									<td>
										{order.products.length > 0 ? order.products.join(", ") : "Không có sản phẩm"}
									</td>
									<td>
										{order.side_dishes.length > 0 ? order.side_dishes.join(", ") : "Không có món thêm"}
									</td>
									<td>{order.method}</td>
									<td>{order.status}</td>
									<td>{new Date(order.createdAt).toLocaleString()}</td>
									<td>{order.address}</td>
									<td>{order.total.toLocaleString()} VND</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}

export default HistoryOrder;
