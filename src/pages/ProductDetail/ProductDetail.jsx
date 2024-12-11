import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import "./ProductDetail.css";
import { getAllProductService } from "../../services/productService";
import { toast } from "react-toastify";
import { getAllCart } from "../../services/productService";
import { createNewCart } from "../../services/cartService";
import { getAllSideDishService } from "../../services/sideDishService";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [selectAddProduct, setSelectAddProduct] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectSideDishes, setSelectSideDishes] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [vendorId, setVendorId] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage] = useState(4); // Số sản phẩm mỗi trang

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/get-all-product?id=${id}`
        );
        setVendorId(response.data.products.vendorId);
        setProduct(response.data.products);

        const responseSideDishes = await getAllSideDishService("ALL");
        if (responseSideDishes && responseSideDishes.sideDishes) {
          const filteredSideDishes = responseSideDishes.sideDishes.filter(
            (sideDish) => response.data.products.sideDishId.includes(sideDish._id)
          );
          setSelectSideDishes(filteredSideDishes);
        }

        const responseAddProduct = await getAllProductService("ALL");
        if (responseAddProduct && responseAddProduct.products) {
          const filteredProducts = responseAddProduct.products.filter(
            (product) => product.vendorId === response.data.products.vendorId
          );

          const finalProducts = filteredProducts.filter(
            (product) => product._id !== id
          );

          setSelectAddProduct(finalProducts);
        }

        if (response.data.errCode === 0) {
          setProduct(response.data.products);
        } else {
          console.log(response.data.errMessage || "Không có sản phẩm");
        }
      } catch (err) {
        console.log("Lỗi khi tải chi tiết sản phẩm");
        console.error(err);
      }
    };

    fetchProductDetail();
  }, [id]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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

    const productExists = currentCart.some((item) => item.nameProduct === product.name);

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
        sideDishId: selectedItems,
        vendorId: vendorId,
      });
      if (res.errCode === 0) {
        toast.success(res.message);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleSelectDish = (dishId) => {
    if (selectedItems.includes(dishId)) {
      setSelectedItems(selectedItems.filter((id) => id !== dishId));
    } else {
      setSelectedItems([...selectedItems, dishId]);
    }
  };

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = selectAddProduct.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(selectAddProduct.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Navbar />
      <div className="product-detail">
        <div className="left-section" onClick={openModal}>
          <img src={product.image} alt={product.name} />
        </div>
        <div className="right-section">
          <h1>{product.name}</h1>
          <p>
            <strong>Mô tả:</strong> {product.description}
          </p>
          <p>
            <strong>Nguyên liệu:</strong> {product.ingredients || "Không có thông tin"}
          </p>
          <p>
            <strong>Giá:</strong> {product.price}đ
          </p>
          <p>
            <strong>Danh mục:</strong> {product.category}
          </p>
          <button onClick={() => handleAddToCart(product)}>Thêm vào giỏ hàng</button>
        </div>
      </div>

      <div className="list-product-category">
        <div className="product-carousel">
          {currentProducts.map((product) => (
            <div
              key={product._id}
              className="product-card"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <img src={product.image} alt={product.name} className="product-image" />
              <p className="product-name">{product.name}</p>
            </div>
          ))}
        </div>

        <div className="pagination">
          <ul>
            {pageNumbers.map((number) => (
              <li key={number}>
                <button onClick={() => paginate(number)}>{number}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`modal ${isModalOpen ? "open" : ""}`} onClick={closeModal}>
        <img src={product.image} alt="Phóng to" />
      </div>

      <div className="show-add-side-dishes">
        <h3>Các món ăn thêm có thể chọn</h3>
        <ul className="side-dishes-list">
          {selectSideDishes.map((dish) => (
            <li
              key={dish._id}
              className="side-dish-item"
              onClick={() => handleSelectDish(dish._id)}
            >
              <div className="selection-indicator">
                {selectedItems.includes(dish._id) && <div className="circle"></div>}
              </div>
              <img src={dish.image} alt={dish.name} className="side-dish-img" />
              <div className="side-dish-info">
                <h4>{dish.name}</h4>
                <p>{dish.price}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;
