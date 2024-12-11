import { useFormik } from "formik";
import React from "react";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import logo from "../../../assets/img/logo_mealmate.png";
import registerImg from "../../../assets/img/registerImg.jpeg";
import { userRegister } from "../../../services/userService";
import "./Register.css";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
  username: Yup.string().required("Tên đăng nhập không được để trống"),
  password: Yup.string().required("Mật khẩu không được để trống"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
    .required("Xác nhận mật khẩu không được để trống"),
});

const Register = () => {
  const navigator = useNavigate();
  // const [errorMessage, setErrorMessage] = useState("");
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await userRegister({
          name: values.username,
          email: values.email,
          password: values.password,
        });
        console.log('check response', response)

        if (response.errCode === 0) {
          console.log('check ')
          toast.success("Đăng Kí thành công!");
          navigator("/login");
        } else {
          toast.error(
            response?.errMessage || "Có lỗi xảy ra vui lòng thử lại!"
          );
          // setErrorMessage("Tên đăng nhập hoặc mật khẩu không chính xác.");
        }
      } catch (error) {
        // setErrorMessage("Đã xảy ra lỗi trong quá trình đăng nhập.");
        console.error("Login error:", error);
      }
    },
  });

  return (
    <div className="register-container">
      <div className="logo__wrappwer">
        <img src={logo} alt="Delicious meal" className="meal__logo" />
        <span className="logo__title">MEAL MATE</span>
      </div>

      <div className="login__content">
        <div className="login__wrapper">
          <div className="login__form">
            <h2 className="login__title">Đăng Kí</h2>
            <form onSubmit={formik.handleSubmit}>
              {/* Email Field */}
              <div
                className="input-field"
                style={{
                  borderColor: formik.errors.email ? "red" : null,
                  borderWidth: formik.errors.email ? "1px" : null,
                  borderStyle: formik.errors.email ? "double" : null,
                }}
              >
                <FaEnvelope />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </div>
              {formik.errors.email && (
                <p className="error-text">{formik.errors.email}</p>
              )}

              <div
                className="input-field"
                style={{
                  borderColor: formik.errors.username ? "red" : null,
                  borderWidth: formik.errors.username ? "1px" : null,
                  borderStyle: formik.errors.username ? "double" : null,
                }}
              >
                <FaUser />
                <input
                  type="text"
                  name="username"
                  placeholder="Tên đăng nhập"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                />
              </div>
              {formik.errors.username && (
                <p className="error-text">{formik.errors.username}</p>
              )}

              {/* Password Field */}
              <div
                className="input-field"
                style={{
                  borderColor: formik.errors.password ? "red" : null,
                  borderWidth: formik.errors.password ? "1px" : null,
                  borderStyle: formik.errors.password ? "double" : null,
                }}
              >
                <FaLock />
                <input
                  type="password"
                  name="password"
                  placeholder="Mật khẩu"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
              </div>
              {formik.errors.password && (
                <p className="error-text">{formik.errors.password}</p>
              )}

              {/* Confirm Password Field */}
              <div
                className="input-field"
                style={{
                  borderColor: formik.errors.confirmPassword ? "red" : null,
                  borderWidth: formik.errors.confirmPassword ? "1px" : null,
                  borderStyle: formik.errors.confirmPassword ? "double" : null,
                }}
              >
                <FaLock />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu"
                  onChange={formik.handleChange}
                  value={formik.values.confirmPassword}
                />
              </div>
              {formik.errors.confirmPassword && (
                <p className="error-text">{formik.errors.confirmPassword}</p>
              )}
              <button type="submit">Đăng Kí</button>
              <div className="login__links">
                <Link className="links_path" to="/login">
                  Đã có tài khoản? Đăng Nhập?
                </Link>
              </div>
            </form>
          </div>
          <img src={registerImg} alt="Delicious meal" className="meal-image" />
        </div>
      </div>
    </div>
  );
};

export default Register;
