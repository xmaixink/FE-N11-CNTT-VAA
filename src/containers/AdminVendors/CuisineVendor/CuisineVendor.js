import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { createNewProductService, deleteProductService, getAllProductService, updateProduct } from '../../../services/vendorAdminService';
import './CuisineVendor.css';

function CuisineVendor() {

	const [fetchProducts, setfetchProducts] = useState([]);
	const [productVendor, setProductVendor] = useState({
		vendorId: "",
		id: "",
		name: "",
		image: "",
		description: "",
		ingredients: "",
		price: "",
	});

	const navigate = useNavigate();

	const storedVendor = localStorage.getItem("dataVendor");
	const vendor = storedVendor ? JSON.parse(storedVendor) : null;

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				if (!vendor) {
					console.error("Vendor not found in localStorage");
					return;
				}
				const response = await getAllProductService("ALL");

				if (response && response.products) {
					const filteredProducts = response.products.filter(
						(product) => product.vendorId === vendor.id
					);
					setfetchProducts(filteredProducts);
				}
			} catch (error) {
				console.log('fetch product error', error)
			}

		}
		fetchProduct();
	}, [])

	const [actionEdit, setActionEdit] = useState(false)

	let onChangeInput = (event, id) => {
		let copyState = { ...productVendor };
		copyState[id] = event.target.value;
		console.log('check copyState', copyState)
		setProductVendor({
			...copyState
		})
	}

	let checkValidateInput = () => {
		let isValid = true;
		let arrCheck = ['name', 'price', 'image', 'description', 'ingredients']
		for (let i = 0; i < arrCheck.length; i++) {
			if (!productVendor[arrCheck[i]]) {
				isValid = false;
				alert('This input is required: ' + arrCheck[i])
				break;
			}
		}

		return isValid;
	}

	let handleDeleteProduct = async (id) => {
		const deleteUser = deleteProductService(id);
		if (deleteUser) {
			setfetchProducts(prevProducts => prevProducts.filter(product => product._id !== id));
			toast.success("Xoá sản phẩm thành công");
		}
	}

	let handleSaveProductAndEdit = async () => {
		productVendor.vendorId = vendor.id

		if (actionEdit === false) {
			let userValid = checkValidateInput();
			if (userValid === false) return;
			try {

				const response = await createNewProductService(productVendor);
				if (response && response.errCode === 0) {
					const responseProduct = await getAllProductService("ALL");
					if (responseProduct && responseProduct.products) {
						const filteredProducts = responseProduct.products.filter(
							(product) => product.vendorId === vendor.id
						);
						setfetchProducts((prev) => [...prev, response.newProduct]); // Thêm trực tiếp sản phẩm mới
						setfetchProducts(filteredProducts);
					}
					setProductVendor({
						name: "",
						image: "",
						description: "",
						ingredients: "",
						price: "",
						category: "",
					});
					toast.success("Tạo sản phẩm thành công");

				}

			} catch (error) {
				console.error('Error adding user:', error);
			}
		} else {
			try {
				const response = await updateProduct(productVendor);
				console.log('check response', response)
				if (response && response.errCode === 0) {
					const responseProduct = await getAllProductService("ALL");
					if (responseProduct && responseProduct.products) {
						const filteredProducts = responseProduct.products.filter(
							(product) => product.vendorId === vendor.id
						);
						setfetchProducts(filteredProducts);
					}
					setProductVendor({
						name: "",
						image: "",
						description: "",
						ingredients: "",
						price: "",
						category: "",
					});
					toast.success("Sửa sản phẩm thành công");

				}
				setActionEdit(false);
			} catch (error) {
				console.error('Error saving user:', error);
			}
		}
	}

	let handleEditProduct = (item) => {
		setProductVendor({
			id: item._id,
			name: item.name,
			image: item.image,
			description: item.description,
			ingredients: item.ingredients,
			price: item.price,
		})
	}

	return (
		<>
			<div>
				<h3 className="admin-title">THÊM MỚI SẢN PHẨM </h3>
				<div className="form-row">
					<input
						type="text"
						placeholder="Name product"
						name="name"
						value={productVendor.name}
						onChange={(event) => { onChangeInput(event, 'name') }}
					/>
					<input
						type="text"
						placeholder="Image"
						name="image"
						value={productVendor.image}
						onChange={(event) => { onChangeInput(event, 'image') }}

					/>
					<input
						type="text"
						placeholder="Description"
						name="description"
						value={productVendor.description}
						onChange={(event) => { onChangeInput(event, 'description') }}

					/>
					<input
						type="text"
						placeholder="Ingredients"
						name="ingredients"
						value={productVendor.ingredients}
						onChange={(event) => { onChangeInput(event, 'ingredients') }}
					/>
					<input
						type="number"
						placeholder="Price"
						name="price"
						value={productVendor.price}
						onChange={(event) => { onChangeInput(event, 'price') }}
					/>
					<select
						name="category"
						value={productVendor.category}
						onChange={(event) => onChangeInput(event, 'category')}
					>
						<option value="">Select Category</option>
						<option value="food">Đồ ăn</option>
						<option value="drink">Đồ uống</option>
						<option value="fruit">Trái cây</option>
						<option value="cake">Bánh</option>
						<option value="fastfood">Fast-Food</option>
					</select>

					<button type="submit"
						className={actionEdit === true ? "edit-button" : "save-button"}
						onClick={() => handleSaveProductAndEdit()}
					>
						{actionEdit === false ? "Thêm mới" : " Sửa sản phẩm"}
					</button>
				</div>

			</div>

			<table className="admin-table">
				<thead>
					<tr>
						<th>STT</th>
						<th>Mã đơn hàng</th>
						<th>Name product</th>
						<th>Image</th>
						<th>Description</th>
						<th>Ingredients</th>
						<th>Price</th>
						<th>Category</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{fetchProducts.map((item, index) => (
						<tr key={item.id || index}
							className="table-row"
							onClick={() => navigate(`/admin-detail-cuisine/${item._id}`)}
						>
							<td>{index + 1}</td> 
							<td>{item._id}</td>
							<td>{item.name}</td>
							<td>
								<img
									src={item.image}
									alt={item.image}
									style={{ width: "100px", height: "auto" }}
								/>
							</td>
							<td>{item.description}</td>
							<td>{item.ingredients}</td>
							<td>{item.price}</td>
							<td>{item.category}</td>
							<td
								onClick={(e) => {
									e.stopPropagation();
								}}
							>
								<div className="action-buttons">
									<button
										className="edit-button"
										onClick={(e) => {
											e.stopPropagation();
											handleEditProduct(item)
											setActionEdit(true)
										}}
									>
										Update
									</button>
									<button
										className="delete-button"
										onClick={(e) => {
											handleDeleteProduct(item._id)
											e.stopPropagation(); 
										}
										}
									>
										Delete
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>

		</>

	)
}


export default CuisineVendor
