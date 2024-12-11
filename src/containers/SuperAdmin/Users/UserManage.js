import React, { useState, useEffect } from 'react'
import "./UserManage.css";
import { createNewUserService, getUserService, deleteUserService, updateUser } from '../../../services/superAdminService'
import { toast } from "react-toastify";

function UserManage() {

	const [dataUser, setDataUser] = useState({
		idEditUser: '',
		id: "",
		email: '',
		password: '',
		name: '',
		phoneNumber: ''
	});

	const [actionEdit, setActionEdit] = useState(false)

	const [fetchUserData, setFetchUserData] = useState([])

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await getUserService("ALL");
				setFetchUserData(response.users); // Lưu dữ liệu vào state
			} catch (error) {
				console.log('fetch User error', error)
			}

		}

		fetchUser();

	}, [])

	let onChangeInput = (event, id) => {
		let copyState = { ...dataUser };
		copyState[id] = event.target.value;
		setDataUser({
			...copyState
		})
	}

	let checkValidateInput = () => {
		let isValid = true;
		let arrCheck = ['email', 'password', 'name', 'phoneNumber']
		for (let i = 0; i < arrCheck.length; i++) {
			if (!dataUser[arrCheck[i]]) {
				isValid = false;
				alert('This input is required: ' + arrCheck[i])
				break;
			}
		}

		return isValid;
	}

	let handleSaveUserAndEdit = async () => {
		if (actionEdit === false) {
			let userValid = checkValidateInput();
			if (userValid === false) return;
			try {
				const response = await createNewUserService(dataUser);
				if (response && response.errCode === 0) {
					const getALLUser = await getUserService("ALL");
					console.log('check getALLUser', getALLUser)
					setFetchUserData(getALLUser.users);
					setDataUser({
						email: "",
						password: "",
						name: "",
						phoneNumber: "",
					});
					toast.success("Tạo sản phẩm thành công");
				}
			} catch (error) {
				console.error('Error adding user:', error);
			}
		} else {
			try {
				const response = await updateUser(dataUser);
				console.log('check response', response)

				setDataUser({
					email: '',
					password: '',
					name: '',
					phoneNumber: ''
				});
				setActionEdit(false);
			} catch (error) {
				console.error('Error saving user:', error);
			}
		}

	}

	let handleDeleteUser = async (id) => {
		const deleteUser = await deleteUserService(id);
		if (deleteUser) {
			setFetchUserData(prevProducts => prevProducts.filter(product => product._id !== id));
			toast.success("Tạo sản phẩm thành công");
		}
	}

	let handleUpdateUser = async (item) => {
		console.log('check item', item)
		setDataUser({
			id: item.id,
			idEditUser: item.id,
			email: item.email,
			password: item.password,
			name: item.name,
			phoneNumber: item.phoneNumber,
		})
	}

	return (
		<>
			<div className='content-container'>
				<div className='title' style={{ margin: "10px" }}>
					Thêm mới người dùng
				</div>

				<div className="user-body" style={{ margin: "10px 120px" }}>
					<div className="container">
						<div className="row">
							<div className="col-3 ">
								<label> Email</label>
								<input className='form-control' type="email"
									value={dataUser.email}
									onChange={(event) => { onChangeInput(event, 'email') }}
								/>
							</div>
							<div className="col-3">
								<label> Mật khẩu</label>
								<input className='form-control' type="text"
									value={dataUser.password}
									onChange={(event) => { onChangeInput(event, 'password') }}
								/>
							</div>
							<div className="col-3">
								<label>Tên</label>
								<input className='form-control' type="text"
									value={dataUser.name}
									onChange={(event) => { onChangeInput(event, 'name') }}
								/>
							</div>
							<div className="col-3">
								<label>Phone Number</label>
								<input className='form-control' type="text"
									value={dataUser.phoneNumber}
									onChange={(event) => { onChangeInput(event, 'phoneNumber') }}
								/>
							</div>
							<div className="col-12 my-3">
								<button
									className={actionEdit === true ? "btn btn-warning" : "btn btn-primary"}
									onClick={() => handleSaveUserAndEdit()}
								>Lưu user</button>
							</div>
						</div>
					</div>
				</div>


			</div>

			<table id="TableManageUser" >
				<tbody>
					<tr>
						<th>Email</th>
						<th>Name</th>
						<th>Phone Number</th>
						<th>Actions</th>
					</tr>
					{fetchUserData && fetchUserData.length > 0 &&
						fetchUserData.map((item, index) => {
							return (
								<tr key={index}>
									<td>{item.email}</td>
									<td>{item.name}</td>
									<td>{item.phoneNumber}</td>
									<td>
										<button
											onClick={() => {
												handleUpdateUser(item);
												setActionEdit(true)
											}}
											className="btn-edit" > <i className="fas fa-edit"></i> </button>
										<button
											onClick={() => handleDeleteUser(item._id)}
											className="btn-delete" > <i className="fas fa-trash"></i> </button>
									</td>
								</tr>
							)
						})

					}

				</tbody>
			</table >
		</>


	)
}


export default UserManage
