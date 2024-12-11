import React, { useState } from 'react'
import { registerNewVendor } from "../../../services/vendorAdminService"
import './RegisterVendor.css'

function RegisterVendor() {

	const [dataRegister, setDataRegister] = useState({
		email: '',
		password: '',
		nameVendor: '',
		phoneNumber: ''
	})

	let onChangeInput = (event, id) => {
		let copyState = { ...dataRegister };
		copyState[id] = event.target.value;
		setDataRegister({
			...copyState
		})
	}

	let checkValidateInput = () => {
		let isValid = true;
		let arrCheck = ['email', 'password', 'nameVendor', 'phoneNumber']
		for (let i = 0; i < arrCheck.length; i++) {
			if (!dataRegister[arrCheck[i]]) {
				isValid = false;
				alert('This input is required: ' + arrCheck[i])
				break;
			}
		}

		return isValid;
	}

	let handleRegisterVendor = async () => {
		let userValid = checkValidateInput();

		if (userValid === false) return;
		try {
			console.log('check dataRegister',dataRegister)
			const response = await registerNewVendor(dataRegister);
			console.log('check response', response)

		} catch (error) {
			console.error('Error adding user:', error);
		}
	}

	return (
		<div className='container-resgiter'>
			<div className=''>
				<div className='header-register'>
					<i className="fa-solid fa-shop"></i>
					Đăng ký
				</div>

				<div className='center-register'>
					<div className="col-3-center">
						<label>Số điện thoại</label>
						<input placeholder='Nhap số điện thoại '
							onChange={(event) => { onChangeInput(event, 'phoneNumber') }}
						/>
					</div>
					<div className="col-3-center">
						<label>Tên đại diện nhà cung cấp </label>
						<input placeholder='Nhập tên nhà cung cấp'
							onChange={(event) => { onChangeInput(event, 'nameVendor') }}
						/>
					</div>
					<div className="col-3-center">
						<label>Email</label>
						<input placeholder='Nhập email '
							onChange={(event) => { onChangeInput(event, 'email') }}
						/>
					</div>
					<div className="col-3-center">
						<label>Password</label>
						<input placeholder='Nhập mật khẩu '
							onChange={(event) => { onChangeInput(event, 'password') }}
						/>
					</div>


					<button
						onClick={() => handleRegisterVendor()}
					>Đăng ký </button>

					<div>
						Bạn đã có tài khoản
						<a href="/login-vendor">Đăng nhập </a>
					</div>
				</div>

			</div>





		</div>
	)
}


export default RegisterVendor
