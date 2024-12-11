import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';


function VerifyEmail() {
	// const { token } = useParams(); // Lấy token từ URL
	// console.log('Token:', token);
	// const location = useLocation(); // Lấy URL hiện tại

	const { token } = useParams(); // Lấy token từ URL
	console.log(token);

	// const [dataVerifyToken, setDataVerifyToken] = useState({
	// 	email: '',
	// 	password: '',
	// 	nameVendor: '',
	// 	phoneNumber: ''
	// })

	useEffect(() => {
		// Lấy token từ URL
		// const urlParams = new URLSearchParams(location.search); // Parse query string
		// const token = urlParams.get('token')
		// console.log('location:', location);

	});


	return (
		<div className='container-verify'>
			{/* Xin chào {dataVerifyToken.nameVendor}
			<p>
				Đây là email xác thực tài khoản với số điện thoại định danh là {dataVerifyToken.phoneNumber}
			</p>
			<p>
				Chúc mừng bạn đã tạo tài khoản với vai trò nhà cung cấp thành công
			</p> */}
		</div>
	)
}


export default VerifyEmail
