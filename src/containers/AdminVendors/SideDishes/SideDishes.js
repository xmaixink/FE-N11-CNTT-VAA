import React, { useState, useEffect } from "react";
import './SideDishes.css'
import { toast } from "react-toastify";
import { getAllSideDishService, createNewSideDishService, deleteSideDishService } from '../../../services/sideDishService'

function SideDishes() {

      const [fetchSideDishes, setfetchSideDishes] = useState([]);
      const [sideDishesVendor, setSideDishesVendor] = useState({
            vendorId: "",
            id: "",
            name: "",
            image: "",
            price: "",
      });

      const storedVendor = localStorage.getItem("dataVendor");
      const vendor = storedVendor ? JSON.parse(storedVendor) : null;

      useEffect(() => {
            const fetchProduct = async () => {
                  try {
                        if (!vendor) {
                              console.error("Vendor not found in localStorage");
                              return;
                        }
                        const response = await getAllSideDishService("ALL");
                        // console.log('check response', response)

                        if (response && response.sideDishes) {
                              const filteredProducts = response.sideDishes.filter(
                                    (sideDish) => sideDish.vendorId === vendor.id
                              );
                              // console.log('check filteredProducts', filteredProducts)
                              setfetchSideDishes(filteredProducts);
                        }
                  } catch (error) {
                        console.log('fetch product error', error)
                  }

            }
            fetchProduct();
      },)

      const [actionEdit, setActionEdit] = useState(false)

      let onChangeInput = (event, id) => {
            let copyState = { ...sideDishesVendor };
            copyState[id] = event.target.value;
            console.log('check copyState', copyState)
            setSideDishesVendor({
                  ...copyState
            })
      }

      let checkValidateInput = () => {
            let isValid = true;
            let arrCheck = ['name', 'price', 'image',]
            for (let i = 0; i < arrCheck.length; i++) {
                  if (!sideDishesVendor[arrCheck[i]]) {
                        isValid = false;
                        alert('This input is required: ' + arrCheck[i])
                        break;
                  }
            }

            return isValid;
      }

      let handleSaveProductAndEdit = async () => {
            sideDishesVendor.vendorId = vendor.id

            if (actionEdit === false) {
                  let userValid = checkValidateInput();
                  if (userValid === false) return;
                  try {
                        const response = await createNewSideDishService(sideDishesVendor);
                        if (response && response.errCode === 0) {
                              const responseSideDishes = await getAllSideDishService("ALL");
                              if (responseSideDishes && responseSideDishes.sideDishes) {
                                    const filteredProducts = responseSideDishes.sideDishes.filter(
                                          (dishes) => dishes.vendorId === vendor.id
                                    );
                                    setfetchSideDishes(filteredProducts);
                              }
                              setSideDishesVendor({
                                    name: "",
                                    image: "",
                                    description: "",
                                    ingredients: "",
                                    price: "",
                                    category: "",
                              });
                              toast.success("Tạo sản phẩm thành công");

                        }
                  }
                  catch (error) {
                        console.error('Error adding user:', error);
                  }
            } else {

            }
      }

      let handleDeleteProduct = async (id) => {
            const deleteUser = deleteSideDishService(id);
            if (deleteUser) {
                  setfetchSideDishes(prevProducts => prevProducts.filter(sideDish => sideDish._id !== id));
                  toast.success("Xoá sản phẩm thành công");
            }
      }

      return (
            <>
                  <div>
                        <h3 className="admin-title">Danh sách sản phẩm đi kèm </h3>
                        <div className="form-row">
                              <input
                                    type="text"
                                    placeholder="Name product"
                                    name="name"
                                    value={sideDishesVendor.name}
                                    onChange={(event) => { onChangeInput(event, 'name') }}
                              />
                              <input
                                    type="text"
                                    placeholder="Image"
                                    name="image"
                                    value={sideDishesVendor.image}
                                    onChange={(event) => { onChangeInput(event, 'image') }}

                              />
                              <input
                                    type="number"
                                    placeholder="Price"
                                    name="price"
                                    value={sideDishesVendor.price}
                                    onChange={(event) => { onChangeInput(event, 'price') }}
                              />

                              <button type="submit"
                                    className={actionEdit === true ? "edit-button" : "save-button"}
                                    onClick={() => handleSaveProductAndEdit()}
                              >
                                    {actionEdit === false ? "Thêm mới" : " Sửa sản phẩm"}
                              </button>
                        </div>

                  </div>

                  <table className="admin-table">
                        <thead>
                              <tr>
                                    <th>STT</th>
                                    <th>Tên món ăn đi kèm</th>
                                    <th>Ảnh</th>
                                    <th>Giá</th>
                                    <th>Action</th>
                              </tr>
                        </thead>
                        <tbody>
                              {fetchSideDishes.map((item, index) => (
                                    <tr key={item.id || index}>
                                          <td>{index + 1}</td> {/* STT bắt đầu từ 1 */}
                                          <td>{item.name}</td>
                                          <td>
                                                <img
                                                      src={item.image}
                                                      alt={item.image}
                                                      style={{ width: "100px", height: "auto" }}
                                                />
                                          </td>
                                          <td>{item.price}</td>
                                          <td>
                                                <div className="action-buttons">
                                                      <button
                                                            className="edit-button"
                                                      // onClick={() => {
                                                      //       handleEditProduct(item)
                                                      //       setActionEdit(true)
                                                      // }}

                                                      >
                                                            Update
                                                      </button>
                                                      <button
                                                            className="delete-button"
                                                            onClick={() => handleDeleteProduct(item._id)}
                                                      >
                                                            Delete
                                                      </button>
                                                </div>
                                          </td>
                                    </tr>
                              ))}
                        </tbody>
                  </table>

            </>

      )
}


export default SideDishes
