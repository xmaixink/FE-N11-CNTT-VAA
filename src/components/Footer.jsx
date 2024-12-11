// src/Footer.js
import React from "react";
import "../css/Footer.css";
import logo3 from "../assets/img/icn_instargram.jpg";
import logo2 from "../assets/img/icon_facebook.jpg";
import img1 from "../assets/img/link_appstore.png";
import img2 from "../assets/img/link_chplay.png";
import logo1 from "../assets/img/logo_mealmate.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="icon">
        <div className="icon_1">
          <img src={logo1} className="icon1" alt="" ></img>
        </div>
        <div className="text">Meal Mate</div>
        <div className="icon2_3">
          <img src={logo2} className="icon2" alt=""></img>
          <img src={logo3} className="icon3" alt=""></img>
        </div>
      </div>

      <div className="link_app">
        <div className="link_appstore">
          <img src={img1} className="img1" alt=""></img>
        </div>
        <div className="link_chplay">
          <img src={img2} className="img2" alt=""></img>
        </div>
      </div>

      <div className="info_Mealmate">
        <div className="txt1">Công ty TNHH 5TV GROUP11</div>
        <div className="txt2">
          Toà nhà G, 18A Cộng Hoà, phường 7, quận Tân Bình, TPHCM
        </div>
        <div className="txt2">
          Chịu trách nhiệm quản lý nội dung và vấn đề bảo vệ quyền lợi người
          tiêu dùng: Nguyễn Thị Xuân Mai
        </div>
        <div className="txt2">Điện thoại liên hệ: 0#########</div>
        <div className="txt2">
          Email: <a href="/" alt="" >support@group11.mealmate.com</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
