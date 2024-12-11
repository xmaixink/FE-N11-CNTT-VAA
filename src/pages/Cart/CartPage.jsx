import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";

import { deleteCart, updateCart } from "../../services/cartService";
import { getAllCart } from "../../services/productService";
import { getAllSideDishService } from "../../services/sideDishService";
import "./CartPage.css";

import { toast } from "react-toastify";

const Cart = () => {
	const [cartItems, setCartItems] = useState([]);
	const [sideDishes, setSideDishes] = useState([]);
	const [selectedItems, setSelectedItems] = useState([]); // Lưu các sản phẩm được chọn
	const [total, setTotal] = useState(0);

	const navigate = useNavigate();

	const fetchCart = async () => {
		try {
			const storedUser = localStorage.getItem("user");
			const user = storedUser ? JSON.parse(storedUser) : null;

			if (user) {
				const response = await getAllCart();

				const userCarts = response.carts.filter(
					(cart) => cart.idUser === user.id
				);

				const sideDishIds = userCarts[0]?.sideDishId || [];

				console.log('check sideDishIds',sideDishIds)

				const responseAllSideDishes = await getAllSideDishService("ALL");

				const filteredSideDishes = responseAllSideDishes.sideDishes.filter(sideDish =>
					sideDishIds.includes(sideDish._id)
				);

				setSideDishes(filteredSideDishes);

				setCartItems(userCarts);
				const total = userCarts.reduce((accumulator, cart) => {
					let itemTotal = cart.priceProduct * cart.number;

					const sideDishTotal = filteredSideDishes
						.filter(sideDish => cart.sideDishId?.includes(sideDish._id))
						.reduce((sideDishAcc, sideDish) => sideDishAcc + sideDish.price, 0);

					itemTotal += sideDishTotal;

					return accumulator + itemTotal;
				}, 0);

				setTotal(total);
			} else {
				alert("Xin hãy đăng nhập");
			}
		} catch (error) {
			console.log("fetch cart error", error);
		}
	};

	useEffect(() => {
		fetchCart();
	}, []);

	const toggleSelectItem = (item) => {
		if (selectedItems.includes(item)) {
			setSelectedItems(selectedItems.filter((i) => i !== item));
		} else {
			setSelectedItems([...selectedItems, item]);
		}
	};

	const handleDeleteCart = async (id) => {
		try {
			const res = await deleteCart(id);
			if (res.errCode === 0) {
				toast.success(res.message);
				fetchCart();
			}
		} catch (error) {
			toast.error("Có lỗi xảy ra.");
		}
	};

	const handleUpdateQuantiy = async (cart, type) => {
		try {
			if ((cart.number > 1 && type === "esc") || type === "desc") {
				type === "desc"
					? (cart.number = cart.number + 1)
					: (cart.number = cart.number - 1);

				const res = await updateCart(cart);

				if (res.errCode === 0) {
					fetchCart();
				}
			} else handleDeleteCart(cart);
		} catch (error) {
			toast.error("Có lỗi xảy ra.");
		}
	};

	return (
		<>
			<Navbar />

			<div className="cart-container">
				<div className="cart">
					{/* <h1>Giỏ hàng của bạn</h1> */}
					{cartItems.length === 0 ? (
						<p style={{ color: "orange" }}>Giỏ hàng trống</p>
					) : (
						<div>
							{cartItems.map((item) => (
								<div key={item.id} className="cart-item">
									<div
										className={`select-indicator ${selectedItems.includes(item) ? "selected" : ""}`}
										onClick={() => toggleSelectItem(item)}
									>
										{/* Biểu tượng hiển thị trạng thái */}
										{selectedItems.includes(item) ? "✔" : "○"}
									</div>
									<img
										src={item.imageProduct}
										alt={item.nameProduct}
										className="item-image"
									/>
									<div className="item-details">
										<h3 className="item-name">{item.nameProduct}</h3>
										<div>
											<p>Món ăn thêm:</p>
											{sideDishes
												.filter((sideDish) => item.sideDishId?.includes(sideDish._id))
												.map((sideDish) => (
													<div key={sideDish._id} className="side-dish">
														<span className="side-dish-name">{sideDish.name}</span> -{' '}
														<span className="side-dish-price">{sideDish.price} </span>
													</div>
												))}
										</div>
									</div>
									<p className="item-price">
										{Number(item.priceProduct) * Number(item.number)} $
									</p>
									<div className="cart-item-actions">
										<div className="quantity-controls">
											<button
												className="quantity-btn"
												onClick={() => handleUpdateQuantiy(item, "esc")}
											>
												-
											</button>
											<span>{item.number}</span>
											<button
												className="quantity-btn"
												onClick={() => handleUpdateQuantiy(item, "desc")}
											>
												+
											</button>
										</div>
										<button className="remove-button" onClick={() => handleDeleteCart(item._id)}>Xóa</button>
									</div>
								</div>
							))}
							<div className="cart-total">
								<h2>Tổng tiền: <span>{total} $</span></h2>
								<button
									className="checkout-button"
									onClick={() => navigate("/payment", { state: { selectedItems } })}
									disabled={selectedItems.length === 0}
								>
									Mua hàng
								</button>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* <Footer /> */}
		</>


	);
};

export default Cart;