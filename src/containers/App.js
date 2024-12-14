import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import "./App.css";
//Admin 
import Cuisine from './SuperAdmin/Cuisine/Cuisine';
import HeaderAdmin from './SuperAdmin/HeaderAdmin/HeaderAdmin';
import HomeAdmin from './SuperAdmin/HomeAdmin/HomeAdmin';
import Restaurant from './SuperAdmin/Restaurants/Restaurant';
import Rider from './SuperAdmin/Riders/Rider';
import UserManage from './SuperAdmin/Users/UserManage';
import Vendor from './SuperAdmin/Vendors/Vendor';

//Vendor
import LoginVendor from './AdminVendors/Auth/LoginVendor';
import RegisterVendor from './AdminVendors/Auth/RegisterVendor';
import VerifyEmail from './AdminVendors/Auth/VerifyEmail';
import CuisineVendor from './AdminVendors/CuisineVendor/CuisineVendor';
import DetailCuisine from './AdminVendors/DetailCuisine/DetailCuisine';
import HeaderVendor from './AdminVendors/HeaderVendor/HeaderVendor';
import HomeVendor from './AdminVendors/HomeVendor/HomeVendor';
import OrderVendor from './AdminVendors/OrderVendor/OrderVendor';
import SideDishes from './AdminVendors/SideDishes/SideDishes';

// Home
import SearchResults from "../components/SearchResults";
import Login from "../pages/auth/Login/Login";
import Register from "../pages/auth/Register/Register";
import CartPage from "../pages/Cart/CartPage";
import ContactPage from "../pages/Contactpage/Contactpage";
import HistoryOrder from '../pages/HistoryOrder/HistoryOrder';
import HomePage from "../pages/HomePage/HomePage";
import ListProduct from "../pages/ListProduct/ListProduct";
import Payment from '../pages/Payment/Payment';
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import UserProfile from "../pages/UserProfile/UserProfile";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { path } from "../utils";

function App() {

	return (
		<div className='App'>
			<Router >
				<div className="main-container">
					<div className="content-container">
						<Routes>

							{/* Home */}
 
							<Route path="/" element={<HomePage />} />
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route path="/contactpage" element={<ContactPage />} />
							<Route path="/listproduct" element={<ListProduct />} />
							<Route path="/product/:id" element={<ProductDetail />} />
							<Route path="/cart" element={<CartPage />} />
							<Route path="/profile" element={<UserProfile />} />
							<Route path="/search-results" element={<SearchResults />} /> 
							<Route path="/payment" element={<Payment />} />
							<Route path="/history-order" element={<HistoryOrder />} />

							{/* SuperAdmin */}
								<Route path={path.SUPERADMIN} element={<HeaderAdmin />} >
								{/* Home */}
								<Route path="home" element={<HomeAdmin />} />

								{/* General */}
								<Route path={path.VENDORS} element={<Vendor />} />
								<Route path={path.RESTAURANTS} element={<Restaurant />} />
								<Route path={path.USERS} element={<UserManage />} />
								<Route path={path.RIDERS} element={<Rider />} />
								<Route path={path.CUISINES} element={<Cuisine />} />
							</Route>

							<Route path={path.LOGIN} element={<LoginVendor />} />
							<Route path={path.REGISTER} element={<RegisterVendor />} />
							<Route path={path.VERIFY_EMAIL} element={<VerifyEmail />} />

							{/* Vendor */}
							<Route path={path.VENDORADMIN} element={<HeaderVendor />}>								{/* <Route path="home" element={<HeaderVendor />} /> */}
								<Route path="home" element={<HomeVendor />} />
								<Route path="cuisine" element={<CuisineVendor />} />
								<Route path="order" element={<OrderVendor />} />
								<Route path="side-dishes" element={<SideDishes />} />
							</Route>

							<Route path="/admin-detail-cuisine/:id" element={<DetailCuisine />} />


						</Routes>

						<ToastContainer />

					</div>
				</div>

			</Router>
		</div>

	)
}

export default App;
