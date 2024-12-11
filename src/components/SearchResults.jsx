import { PlusOutlined } from "@ant-design/icons";
import { Button, Pagination, Tooltip } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../css/searchResults.css";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // State cho phân trang
  const [productsPerPage] = useState(10); // Số sản phẩm mỗi trang
  const { search } = useLocation(); // Lấy query từ URL
  const queryParams = new URLSearchParams(search);
  const searchQuery = queryParams.get("name");
  const navigate = useNavigate();

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/search-product?name=${searchQuery}`
        );
        if (response.data.errCode === 0) {
          setProducts(response.data.products.data || []);
        } else {
          setError(response.data.errMessage || "Không có sản phẩm");
        }
      } catch (err) {
        setError("Lỗi khi tải kết quả tìm kiếm");
        console.error("API lỗi:", err);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchSearchResults();
    } else {
      setLoading(false); 
    }
  }, [searchQuery]);

  const handleViewProductDetail = (id) => {
    navigate(`/product-detail/${id}`);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <>
      <Navbar />
      <div className="search-results">
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <h1>Kết quả tìm kiếm cho: {searchQuery}</h1>
            <div className="product-list">
              {products.length === 0 ? (
                <p>Không có sản phẩm nào</p>
              ) : (
                <>
                  {currentProducts.map((product) => (
                    <div key={product._id} className="product-card">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                      />
                      <h3>{truncateText(product.name, 10)}</h3>
                      <p>
                        <strong>Price:</strong> {product.price}
                      </p>
                      <button onClick={() => handleViewProductDetail(product._id)}>
                        View Details
                      </button>

                      <Tooltip title="Add to Cart">
                        <Button
                          icon={<PlusOutlined />}
                          className="add-to-cart-btn"
                        />
                      </Tooltip>
                    </div>
                  ))}
                  {/* Phân trang */}
                  <Pagination
                    current={currentPage}
                    pageSize={productsPerPage}
                    total={products.length}
                    onChange={(page) => setCurrentPage(page)}
                    style={{ textAlign: "center", marginTop: "20px" }}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default SearchResults;
