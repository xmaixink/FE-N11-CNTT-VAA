import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { loginVendor } from "../../../services/vendorAdminService";
import './LoginVendor.css';

function LoginVendor() {
    const [dataLogin, setDataLogin] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    // Xử lý thay đổi input
    let onChangeInput = (event, id) => {
        let copyState = { ...dataLogin };
        copyState[id] = event.target.value;
        setDataLogin({
            ...copyState
        });
    };

    // Kiểm tra dữ liệu nhập vào
    let checkValidateInput = () => {
        let isValid = true;
        let arrCheck = ['email', 'password'];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!dataLogin[arrCheck[i]]) {
                isValid = false;
                toast.error(`This input is required: ${arrCheck[i]}`);
                break;
            }
        }
        return isValid;
    };

    const handleLoginVendor = async () => {
      let userValid = checkValidateInput();
  
      if (userValid === false) return;
      try {
          const response = await loginVendor(dataLogin);
          console.log('check response', response);
          if (response.errCode === 0) {
              const dataVendor = response.vendor;
              localStorage.setItem("vendorId", dataVendor._id); // Lưu vendorId vào localStorage
              localStorage.setItem("dataVendor", JSON.stringify(dataVendor)); // Lưu dữ liệu khác của vendor nếu cần
              navigate('/vendor-admin');
              toast.success("Đăng nhập thành công ");
          } else {
              toast.error("Thông tin không đúng ");
          }
      } catch (error) {
          console.error('Error adding user:', error);
      }
  };
  

    return (
        <div className='login-page'>
            <div className=''>
                <div className='header-register'>
                    <i className="fa-solid fa-shop"></i>
                    Đăng nhập
                </div>

                <div className='center-register'>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder='Nhập email'
                            value={dataLogin.email}
                            onChange={(event) => { onChangeInput(event, 'email') }}
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder='Nhập password'
                            value={dataLogin.password}
                            onChange={(event) => { onChangeInput(event, 'password') }}
                        />
                    </div>

                    <button onClick={() => handleLoginVendor()}>Đăng nhập</button>

                    <div>
                        Bạn chưa có tài khoản?
                        <a href="/register-vendor">Đăng ký</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginVendor;
