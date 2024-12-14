import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { getAllProductService, updateSideDishProductService } from "../../../services/productService";
import { getAllSideDishService } from '../../../services/sideDishService';
import './DetailCuisine.css';



function DetailCuisine() {
      const { id } = useParams();
      const navigate = useNavigate();
      const [product, setProduct] = useState([]);
      const [fetchSideDishes, setfetchSideDishes] = useState([]);

      const storedVendor = localStorage.getItem("dataVendor");
      const vendor = storedVendor ? JSON.parse(storedVendor) : null;

      const [isActive, setIsActive] = useState(false);

      useEffect(() => {
            const fetchProductDetail = async () => {
                  try {
                        const response = await getAllProductService(`${id}`)
                        if (response.errCode === 0) {
                              setProduct(response.products);

                              const selectSideDishesId = response.products.sideDishId
                              console.log('check selectSideDishesId', selectSideDishesId)

                              // Kiểm tra sideDishId từ sản phẩm
                              // setfetchSideDishes(updatedSideDishes);
                        } else {
                              console.log(response.errMessage || "Không có sản phẩm");
                        }
                  } catch (err) {
                        console.log("Lỗi khi tải chi tiết sản phẩm");
                        console.error("API lỗi:", err);
                  }
            };

            const fetchAllSideDishes = async () => {
                  try {
                        if (!vendor) {
                              console.error("Vendor not found in localStorage");
                              return;
                        }
                        const response = await getAllSideDishService("ALL");
                        if (response && response.sideDishes) {
                              const filteredProducts = response.sideDishes.filter(
                                    (sideDish) => sideDish.vendorId === vendor.id
                              );
                              setfetchSideDishes(filteredProducts);
                        }
                  } catch (error) {
                        console.log('fetch product error', error)
                  }

            }
            fetchAllSideDishes();

            fetchProductDetail();
      }, []);

      const addSideDishToProduct = async (item) => {
            item.idProduct = id
            const response = await updateSideDishProductService(item)
            console.log('check response', response)
      }

      return (
            <>
                  <button
                        onClick={() => navigate("/vendor-admin/cuisine")}
                  >
                        Trở về trang Sản phẩm như cũ
                  </button>
                  <div>
                        <h1>{product.name}</h1>
                        <img src={product.image} alt={product.name} />
                        <p>{product.description}</p>
                        <p>
                              <strong>Nguyên liệu:</strong>{" "}
                              {product.ingredients
                                    ? "co nguyen lieu"
                                    : "Không khả dụng"}
                        </p>
                        <p>
                              <strong>Giá:</strong> ${product.price}
                        </p>
                        <p>
                              <strong>Danh mục:</strong> {product.category}
                        </p>
                        {/* Hiển thị thêm thông tin chi tiết dựa trên ID */}
                  </div>

                  <div>
                        Các món ăn đi kèm
                  </div>

                  Thêm các món ăn đi kèm sản phẩm này

                  <table className="admin-table">
                        <thead>
                              <tr>
                                    <th>STT</th>
                                    <th>Tên món ăn đi kèm</th>
                                    <th>Ảnh</th>
                                    <th>Giá</th>
                                    <th>Action</th>
                              </tr>
                        </thead>
                        <tbody>
                              {fetchSideDishes.map((item, index) => (
                                    <tr key={item.id || index}>
                                          <td>{index + 1}</td> {/* STT bắt đầu từ 1 */}
                                          <td>{item.name}</td>
                                          <td>
                                                <img
                                                      src={item.image}
                                                      alt={item.image}
                                                      style={{ width: "100px", height: "auto" }}
                                                />
                                          </td>
                                          <td>{item.price}</td>
                                          <td >
                                                <button
                                                      onClick={() => addSideDishToProduct(item)}
                                                      className={isActive ? "active" : "unactive"}>
                                                      {isActive ? "Active" : "Unactive"}
                                                </button>
                                          </td>
                                    </tr>
                              ))}
                        </tbody>
                  </table>
            </>

      )
}


export default DetailCuisine
