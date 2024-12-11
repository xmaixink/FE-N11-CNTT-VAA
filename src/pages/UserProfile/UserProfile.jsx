import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { deleteUserService, updateUser } from '../../services/userService';
import './UserProfile.css';

function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');
  const fetchUser = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/get-all-users?id=${userId}`);
      if (response.data && response.data.user) {
        setUser({
          name: response.data.user.name,
          email: response.data.user.email,
          password: '',
        });
        setError('');
      } else {
        setError('');
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      setError('Lỗi khi lấy thông tin người dùng. Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    } else {
      // setError('Không có ID người dùng.');
    }
  }, [userId]);

  const handleSave = async () => {
    try {
      const updatedUser = {
        userId,
        name: user.name,
        email: user.email,
        password: user.password || "",
      };

      const response = await updateUser(updatedUser);

      console.log('check response', response)

      if (response && response.data) {

        if (response.data.success) {
          alert('Thông tin đã được cập nhật!');
        } else {
          alert(`Cập nhật thất bại: ${response.data.message || 'Vui lòng thử lại'}`);
        }
      } else {
        alert('Thanh cong rui');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error);
      alert('Cập nhật thông tin thất bại. Vui lòng thử lại.');
    }
  };


  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn xoá tài khoản?');
    if (!isConfirmed) return;

    try {
      const response = await deleteUserService(userId);
      if (response && response.data) {
        if (response.data.success) {
          setUser({ name: '', email: '', password: '' });
          localStorage.removeItem('userId');
          window.location.href = '/login';
        }
      } else {
        alert('Xóa tài khoản thành công.');
      }
    } catch (error) {
      console.error('Lỗi khi xoá tài khoản:', error);
      alert('Xoá tài khoản thất bại. Vui lòng thử lại.');
    }
  };


  return (
    <div className="profile-container">
      <div className="header">
        <h2>Thông tin người dùng</h2>
      </div>
      {error && <div className="error-message">{error}</div>}

      <div className="info-section">
        <label>Tên</label>
        <input
          type="text"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          placeholder="Nhập tên"
        />
        <label>Email</label>
        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Nhập email"
        />
        <label>Mật khẩu</label>
        <input
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Nhập mật khẩu"
        />
        <button className="save-button" onClick={handleSave}>
          Lưu thay đổi
        </button>
        <button className="delete-button" onClick={handleDeleteAccount}>
          Xoá tài khoản
        </button>
      </div>
    </div>
  );
}

export default UserProfile;
