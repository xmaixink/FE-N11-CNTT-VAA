import React, { useState, useEffect } from 'react';
import './HeaderVendor.css';
import { useNavigate, NavLink, Outlet } from 'react-router-dom';

function HeaderVendor() {
      const navigate = useNavigate();

      const [vendor, setVendor] = useState(null); // State lưu thông tin người dùng

      useEffect(() => {
            const storedVendor = localStorage.getItem("dataVendor");
            if (storedVendor) {
                  setVendor(JSON.parse(storedVendor)); // Cập nhật state từ localStorage
            }

      }, []);

      const handleLogout = () => {
            localStorage.removeItem("dataVendor"); // Xóa dữ liệu khỏi localStorage
            setVendor(null); // Reset state
            navigate('/login-vendor');

      };

      return (
            <div className="page-layout">
                  {/* Khung bên trái */}
                  <div className="container-admin">
                        <div className="title">
                              {vendor ? (
                                    <>
                                          <span> {vendor.name}</span>
                                    </>
                              ) : (
                                    <span>Xin hãy đăng nhập</span>
                              )}

                        </div>
                        <NavLink to="/vendor-admin/home"
                              className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
                        >
                              <i className="fas fa-house"></i>
                              Home
                        </NavLink>

                        <div className='container-general'>

                              <NavLink to="/vendor-admin/cuisine"
                                    className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
                              >
                                    <i className="fa-solid fa-burger"></i>
                                    Cuisines
                              </NavLink>

                              <NavLink to="/vendor-admin/side-dishes"
                                    className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
                              >
                                    <i className="fa-solid fa-utensils"></i>
                                    Side Dishes
                              </NavLink>

                              <NavLink to="/vendor-admin/order"
                                    className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
                              >
                                    <i className="fa-solid fa-motorcycle"></i>
                                    Orders
                              </NavLink>


                        </div>

                        <div className='container-management'>
                              <div className='title'>management</div>

                              <NavLink to="/vendor-admin/cuisines"
                                    className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
                              >
                                    <i className="fa-solid fa-burger"></i>
                                    Management
                              </NavLink>
                        </div>

                        <button onClick={handleLogout}>Đăng xuất</button>


                  </div>
                  <div className="container-right">
                        <Outlet />
                  </div>

            </div>
      );
}

export default HeaderVendor;
