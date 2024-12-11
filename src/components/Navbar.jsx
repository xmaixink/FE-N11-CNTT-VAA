import { ShoppingCartOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import flag from "../assets/img/Co-Vietnam.webp";
import logo from "../assets/img/logo_mealmate.png";
import "../css/Navbar.css";
import { getAllCart } from "../services/productService";


function Navbar() {
  const [searchQuery, setSearchQuery] = useState(""); // State lưu từ khóa tìm kiếm
  const [cartItemCount, setCartItemCount] = useState(0); // Số lượng sản phẩm trong giỏ hàng
  const [user, setUser] = useState(null); // Thông tin người dùng
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false); // Trạng thái dropdown người dùng

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    const user = userInfo ? JSON.parse(userInfo) : null;

    const showQuantityCart = async () => {
      try {
        const response = await getAllCart();

        const userCarts = response.carts.filter(
          (cart) => cart.idUser === user.id
        );
        setCartItemCount(userCarts.length)
      } catch (error) {
        console.log("fetch showQuantityCart error", error);
      }
    };

    showQuantityCart()

    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    console.log("Searching for:", e.target.value); // Log giá trị tìm kiếm
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      console.log("Navigating to search-results with query:", searchQuery); // Log trước khi chuyển hướng
      if (searchQuery.trim()) {
        navigate(`/search-results?name=${searchQuery}`);
      } else {
        console.log("Search query is empty!");
      }
    }
  };


  const handleCartClick = () => {
    navigate("/Cart");
  };

  const handleFoodClick = () => {
    navigate("/ListProduct");
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsUserDropdownOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        <img src={logo} alt="Meal Mate Logo" className="logo-image" />
        Meal Mate
      </div>

      <div className="find_product">
        <input
          type="text"
          placeholder="Tìm kiếm"
          className="search-bar"
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={handleKeyDown} // Bắt sự kiện khi nhấn Enter
        />
      </div>

      <div className="menu">
        <div
          className="menu-item"
          onClick={handleFoodClick}
          style={{ cursor: "pointer" }}
        >
          <span>Sản phẩm</span>
        </div>

        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/Contactpage");
          }}
        >
          Liên Hệ
        </a>
      </div>

      <div className="dropdown-item" onClick={handleCartClick}>
        <Badge count={cartItemCount} offset={[10, 0]}>
          <ShoppingCartOutlined className="cart-icon" />
        </Badge>
      </div>

      {user?.id ? (
        <div className="userInfo-wrapper">
          <span
            className="login-button"
            onClick={toggleUserDropdown}
            style={{ cursor: "pointer" }}
          >
            {user.name}
          </span>
          {isUserDropdownOpen && (
            <div className="dropdown user-dropdown">
              <div
                className="dropdown-item"
                onClick={() => navigate("/profile")}
              >
                Profile
              </div>
              <div
                className="dropdown-item"
                onClick={() => navigate("/history-order")}
              >
                Lịch sử đơn hàng
              </div>
              <div className="dropdown-item" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="login">
          <button className="login-button" onClick={() => navigate("/login")}>
            Đăng nhập
          </button>
        </div>
      )}

      <div className="language">
        <img src={flag} className="flag" alt="Vietnam Flag" />
      </div>
    </nav>
  );
}

export default Navbar;
