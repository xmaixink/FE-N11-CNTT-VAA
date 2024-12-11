import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Pagination, Row, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

import Sidebar from "../../components/Sidebar";
import { createNewCart } from "../../services/cartService";
import { getAllCart, getAllProductService } from "../../services/productService";

import "./ListProduct.css";

const ListProduct = () => {
  const [fetchProductData, setFetchProductData] = useState([]);
  const [getAllCategory, setGetAllCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1); // Thêm state cho trang hiện tại
  const [productsPerPage] = useState(10); // Số sản phẩm trên mỗi trang

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getAllProductService("ALL");
        const categories = response.products.map((product) => product.category);
        const uniqueCategories = [...new Set(categories)];
        setGetAllCategory(uniqueCategories);
        setFetchProductData(response.products);
      } catch (error) {
        console.log("fetch Product error", error);
      }
    };

    fetchProduct();
  }, []);

  const handleAddToCart = async (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.id : null;

    if (!userId) {
      toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    const response = await getAllCart();
    const userCarts = response.carts.filter((cart) => cart.idUser === user.id);
    const currentCart = Array.isArray(userCarts) ? userCarts : [];

    const productExists = currentCart.some(
      (item) => item.nameProduct === product.name
    );

    if (productExists) {
      toast.warning("Sản phẩm đã có trong giỏ hàng");
      return;
    }

    try {
      const res = await createNewCart({
        idUser: userId,
        imageProduct: product.image,
        nameProduct: product.name,
        priceProduct: product.price,
        vendorId: product.vendorId,
      });
      if (res.errCode === 0) {
        toast.success(res.message);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  // Lọc sản phẩm dựa trên category được chọn
  const filteredProducts =
    selectedCategory === "ALL"
      ? fetchProductData
      : fetchProductData.filter((item) => item.category === selectedCategory);

  // Logic phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <>
      <Navbar />
      <div className="product-page">
        <Row>
          <Col span={6}>
            <Sidebar
              getAllCategory={getAllCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </Col>
          <Col span={16}>
            <div>
              {currentProducts && currentProducts.length > 0 ? (
                <div>
                  <div className="product-grid">
                    {currentProducts.map((item) => (
                      <div className="product-card" key={item._id || item.name}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="product-image"
                        />
                        <h3>{truncateText(item.name, 10)}</h3>
                        <p>{truncateText(item.description, 50)}</p>
                        <p className="price">Price: {item.price}</p>
                        <div className="actions">
                          <Link
                            to={`/product/${item._id}`}
                            className="view-details-btn"
                          >
                            View Details
                          </Link>
                          <Tooltip title="Add to Cart">
                            <Button
                              icon={<PlusOutlined />}
                              className="add-to-cart-btn"
                              onClick={() => handleAddToCart(item)}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Pagination
                    current={currentPage}
                    pageSize={productsPerPage}
                    total={filteredProducts.length}
                    onChange={(page) => setCurrentPage(page)}
                    style={{ textAlign: "center", marginTop: "20px" }}
                  />
                </div>
              ) : (
                <p style={{ textAlign: "center" }}>No products found.</p>
              )}
            </div>
          </Col>
        </Row>
      </div>
      <Footer />
    </>
  );
};

export default ListProduct;
