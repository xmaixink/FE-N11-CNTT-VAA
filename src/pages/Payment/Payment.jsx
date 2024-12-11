import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";
import axios from "axios";
import { createNewOrder } from "../../services/orderService"
import { getAllSideDishService } from "../../services/sideDishService"

function Payment() {
      const location = useLocation();
      const navigate = useNavigate();
      const itemsToCheckout = location.state?.selectedItems || [];
      const allSideDishIds = itemsToCheckout.map((item) => item.sideDishId).flat();
      const [address, setAddress] = useState("");
      const [paymentMethod, setPaymentMethod] = useState("");
      const [selectItemDishes, setSelectItemDishes] = useState([]);
      const [total, setTotal] = useState(0);

      useEffect(() => {
            const fetchProduct = async () => {
                  try {
                        const responseCart = await getAllSideDishService("ALL");
                        const matchingSideDishes = responseCart.sideDishes
                              .filter((cartItem) => allSideDishIds.includes(cartItem._id))
                              .map((matchedItem) => ({
                                    name: matchedItem.name,
                                    price: matchedItem.price, // Lấy thêm giá
                              }));
                        setSelectItemDishes(matchingSideDishes)

                        // Tính tổng tiền sản phẩm + món ăn thêm
                        const totalProductPrice = itemsToCheckout.reduce(
                              (total, item) => total + item.priceProduct,
                              0
                        );
                        const totalSideDishPrice = matchingSideDishes.reduce(
                              (total, dish) => total + dish.price,
                              0
                        );

                        setTotal(totalProductPrice + totalSideDishPrice); // Cập nhật tổng tiền

                  } catch (error) {
                        console.log("fetch Product error", error);
                  }
            };
            fetchProduct();
      }, []);

      const handlePaymentCash = async () => {
            try {

                  const responseCart = await getAllSideDishService("ALL")
                  const matchingNames = responseCart.sideDishes
                        .filter((cartItem) => allSideDishIds.includes(cartItem._id))
                        .map((matchedItem) => matchedItem.name);

                  console.log('check itemsToCheckout.nameProduct', itemsToCheckout)

                  const nameProducts = itemsToCheckout.map(item => item.nameProduct);
                  console.log('check all nameProducts', nameProducts);

                  await createNewOrder({
                        products: nameProducts,
                        side_dishes: matchingNames,
                        userId: itemsToCheckout[0]?.idUser,
                        method: "Cash",
                        address: address,
                        vendorId: itemsToCheckout[0]?.vendorId,
                        total: total
                  });
                  alert("Thanh toán bằng tiền mặt!");
                  navigate("/");

            } catch (error) {
                  console.error("Error in Cash Payment:", error.message);
            }
      };

      const handlePaymentVNPAY = async () => {
            try {
                  const newPayment = {
                        amount: total, // Tính tổng tiền
                        bankCode: null,
                        language: "vn",
                  };

                  const response = await axios.post(
                        "http://localhost:8080/api/v1/vnpay/create_payment_url",
                        newPayment
                  );

                  const responseCart = await getAllSideDishService("ALL")
                  const matchingNames = responseCart.sideDishes
                        .filter((cartItem) => allSideDishIds.includes(cartItem._id))
                        .map((matchedItem) => matchedItem.name);

                  if (response.status === 200 && response.data) {
                        await createNewOrder({
                              products: itemsToCheckout.nameProduct,
                              side_dishes: matchingNames,
                              userId: itemsToCheckout[0]?.idUser,
                              method: "Vnpay",
                              address: address,
                              vendorId: itemsToCheckout[0]?.vendorId,
                              total: total
                        });
                        window.location.href = response.data; // Chuyển hướng đến trang thanh toán VnPay
                  }
            } catch (error) {
                  console.error("Error in VnPay Payment:", error.message);
            }
      };

      const handleSubmit = async () => {
            if (paymentMethod === "cod") {
                  await handlePaymentCash();
            } else if (paymentMethod === "vn-pay") {
                  await handlePaymentVNPAY();
            } else {
                  alert("Vui lòng chọn phương thức thanh toán!");
            }
      };


      return (
            <div className="payment-container">
                  <h2 className="payment-title">Thanh toán</h2>

                  <div className="cart-summary">
                        <h3>Các sản phẩm được chọn:</h3>
                        {itemsToCheckout.map((item) => (
                              <div key={item.id} className="cart-item-summary">
                                    <img src={item.imageProduct} alt={item.nameProduct} className="item-image" />
                                    <div className="item-details">
                                          <h4 className="item-name">{item.nameProduct}</h4>
                                          <p className="item-price">{item.priceProduct} VND</p>
                                    </div>
                              </div>
                        ))}

                        {selectItemDishes && selectItemDishes.length > 0 && (
                              <div className="toppings">
                                    <h4>Món ăn thêm:</h4>
                                    <ul>
                                          {selectItemDishes.map((dish, index) => (
                                                <li key={index}>{dish.name}: {dish.price}</li>
                                          ))}
                                    </ul>
                              </div>
                        )}

                        <h3>Tổng tiền: {total} VND</h3>
                  </div>

                  <div className="form-group">
                        <label htmlFor="address">Địa chỉ giao hàng:</label>
                        <input
                              type="text"
                              id="address"
                              name="address"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="Nhập địa chỉ của bạn"
                        />
                  </div>

                  <div className="form-group">
                        <label htmlFor="payment-method">Phương thức thanh toán:</label>
                        <select
                              id="payment-method"
                              name="payment-method"
                              value={paymentMethod}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                              <option value="" hidden>
                                    Chọn phương thức thanh toán
                              </option>
                              <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                              <option value="vn-pay">Ví VnPay</option>
                        </select>
                  </div>

                  <button className="payment-button" onClick={handleSubmit}>
                        Xác nhận thanh toán
                  </button>
            </div>
      );
}

export default Payment;
