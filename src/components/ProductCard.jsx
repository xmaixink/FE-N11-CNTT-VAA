import React from "react";
import "../css/ProductCard.css";
// import img_sp from './img/hamburger.jpg';

function ProductCard({ name, rating, price, img_sp }) {
  return (
    <div className="product-card">
      <img src={img_sp} alt={name} className="product_image" />
      <h3>{name}</h3>
      <p>⭐ {rating}</p>
      <p>{price} đ</p>
    </div>
  );
} 

export default ProductCard;
