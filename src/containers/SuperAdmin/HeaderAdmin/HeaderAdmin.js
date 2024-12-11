import React from 'react';
import './HeaderAdmin.css';
import { NavLink, Outlet } from 'react-router-dom'


function HeaderAdmin() {
	return (
		<div className="page-layout">
			{/* Khung bên trái */}
			<div className="container-admin">
				<div className="title">SUPER ADMIN</div>
				<NavLink to="/super-admin/home"
					className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
				>
					<i className="fas fa-house"></i>
					Home
				</NavLink>

				<div className='container-general'>
					<div className='title'>General</div>
					<NavLink to="/super-admin/vendors"
						className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
					>
						<i className="fa-brands fa-elementor"></i>
						Vendors
					</NavLink>
					<NavLink to="/super-admin/restaurants"
						className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
					>
						<i className="fa-solid fa-utensils"></i>
						Restaurants
					</NavLink>
					<NavLink to="/super-admin/users"
						className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
					>
						<i className="fa-solid fa-user-gear"></i>
						Users
					</NavLink>
					<NavLink to="/super-admin/riders"
						className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
					>
						<i className="fa-solid fa-motorcycle"></i>
						Riders
					</NavLink>
				</div>

				<div className='container-management'>
					<div className='title'>management</div>

					<NavLink to="/super-admin/cuisines"
						className={({ isActive }) => (isActive ? 'menu-item active' : 'menu-item')}
					>
						<i className="fa-solid fa-burger"></i>
						Cuisine
					</NavLink>
				</div>

			</div>
			<div className="container-right">
				<Outlet />
			</div>
		</div>
	);
}

export default HeaderAdmin;
