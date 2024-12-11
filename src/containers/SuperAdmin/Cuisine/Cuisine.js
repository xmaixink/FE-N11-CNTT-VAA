
import React, { useState, useEffect } from "react";
import { getAllCuisineService } from "../../../services/cuisineService"
import './Cuisine.css'

function Cuisine() {
      const [fetchCuisines, setfetchCuisines] = useState([]);
      const [cuisine, setCuisine] = useState({
            id: "",
            name: "",
            image: "",
            description: "",
            ingredients: "",
            price: "",
      });

      const [actionEdit, setActionEdit] = useState(false)

      useEffect(() => {
            const fetchCuisine = async () => {
                  try {
                        const response = await getAllCuisineService("ALL");
                        setfetchCuisines(response.products); // Lưu dữ liệu vào state
                        console.log('check response', response)
                  } catch (error) {
                        console.log('fetch User error', error)
                  }

            }

            fetchCuisine();

      }, [])

      let onChangeInput = (event, id) => {
            let copyState = { ...cuisine };
            copyState[id] = event.target.value;
            setCuisine({
                  ...copyState
            })
      }


      return (
            <div>
                  <div className="cuisine-container">
                        <div className="cuisine-background"></div>
                        <h3 className="cuisine-title">THÊM MỚI SẢN PHẨM</h3>
                        <div className="form-row">
                              <input
                                    type="text"
                                    placeholder="Name cuisine"
                                    name="name"
                                    value={cuisine.name}
                                    onChange={(event) => { onChangeInput(event, 'name') }}
                              />
                              <input
                                    type="text"
                                    placeholder="Image"
                                    name="image"
                                    value={cuisine.image}
                                    onChange={(event) => { onChangeInput(event, 'image') }}

                              />
                              <input
                                    type="text"
                                    placeholder="Description"
                                    name="description"
                                    value={cuisine.description}
                                    onChange={(event) => { onChangeInput(event, 'description') }}

                              />
                              <input
                                    type="text"
                                    placeholder="Ingredients"
                                    name="ingredients"
                                    value={cuisine.ingredients}
                                    onChange={(event) => { onChangeInput(event, 'ingredients') }}

                              />
                              <input
                                    type="number"
                                    placeholder="Price"
                                    name="price"
                                    value={cuisine.price}
                              // onChange={(event) => { onChangeInput(event, 'price') }}

                              />
                              <button type="submit" /*className="save-button" */
                                    className={actionEdit === true ? "edit-button" : "save-button"}
                              // onClick={() => handleSaveProductAndEdit()}
                              >
                                    {actionEdit === false ? "Thêm mới" : " Sửa sản phẩm"}
                              </button>
                        </div>


                        <table className="cuisine-table">
                              <thead>
                                    <tr>
                                          <th>Name cuisine</th>
                                          <th>Image</th>
                                          <th>Description</th>
                                          <th>Ingredients</th>
                                          <th>Price</th>
                                          <th>Action</th>
                                    </tr>
                              </thead>
                              <tbody>
                                    {fetchCuisines.map((prod, index) => (
                                          <tr key={index}>
                                                <td>{prod.name}</td>
                                                <td>
                                                      <img
                                                            src={prod.image}
                                                            alt={prod.name}
                                                            style={{ width: "100px", height: "auto" }}
                                                      />
                                                </td>
                                                <td>{prod.description}</td>
                                                <td>{prod.ingredients}</td>
                                                <td>{prod.price}</td>
                                                <td>
                                                      <div className="action-buttons">
                                                            <button
                                                                  className="edit-button"
                                                                  onClick={() => {
                                                                        // handleEditProduct(prod)
                                                                        setActionEdit(true)
                                                                  }}

                                                            >
                                                                  Update
                                                            </button>
                                                            <button
                                                                  className="delete-button"
                                                            // onClick={() => handleDeleteProduct(prod._id)}
                                                            >
                                                                  Delete
                                                            </button>
                                                      </div>
                                                </td>
                                          </tr>
                                    ))}
                              </tbody>
                        </table>
                  </div>
            </div>
      )
}


export default Cuisine
