import React, { useState } from 'react'
import { loginVendor } from "../../../services/vendorAdminService"
import { useNavigate } from 'react-router-dom';
import './LoginVendor.css'
import { toast } from "react-toastify";

function LoginVendor() {

      const [dataLogin, setDataLogin] = useState({
            email: '',
            password: '',
      })
      const navigate = useNavigate();


      let onChangeInput = (event, id) => {
            let copyState = { ...dataLogin };
            copyState[id] = event.target.value;
            setDataLogin({
                  ...copyState
            })
      }

      let checkValidateInput = () => {
            let isValid = true;
            let arrCheck = ['email', 'password']
            for (let i = 0; i < arrCheck.length; i++) {
                  if (!dataLogin[arrCheck[i]]) {
                        isValid = false;
                        alert('This input is required: ' + arrCheck[i])
                        break;
                  }
            }
            return isValid;
      }

      let handleLoginVendor = async () => {
            let userValid = checkValidateInput();

            if (userValid === false) return;
            try {
                  const response = await loginVendor(dataLogin);
                  console.log('check response', response)
                  if (response.errCode === 0) {
                        const dataVendor = response.vendor
                        localStorage.setItem("dataVendor", JSON.stringify(dataVendor)); // Lưu dataUser vào localStorage
                        navigate('/vendor-admin');
                        toast.success("Đăng nhập thành công ");

                  } else {
                        toast.error("Thông tin không đúng ");
                  }

            } catch (error) {
                  console.error('Error adding user:', error);
            }
      }


      return (
            <div className='login-page'>
                  <div className=''>
                        <div className='header-register'>
                              <i className="fa-solid fa-shop"></i>
                              Dang nhap
                        </div>

                        <div className='center-register'>
                              <div>
                                    <label>Email</label>
                                    <input placeholder='Nhap email '
                                          onChange={(event) => { onChangeInput(event, 'email') }}
                                    />
                              </div>
                              <div>
                                    <label>Password</label>
                                    <input placeholder='Nhap password '
                                          onChange={(event) => { onChangeInput(event, 'password') }}
                                    />
                              </div>

                              <button
                                    onClick={() => handleLoginVendor()}
                              >Dang nhap </button>

                              <div>
                                    Ban chua co tai khoan?
                                    <a href="/register-vendor">Dang ky</a>
                              </div>
                        </div>

                  </div>





            </div>
      )
}


export default LoginVendor
