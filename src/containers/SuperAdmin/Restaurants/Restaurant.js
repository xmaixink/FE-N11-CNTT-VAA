
import React, { useState, useEffect } from 'react'
import "./Restaurant.css"
import { getRestaurantService } from "../../../services/superAdminService"

function Restaurant() {

      const [fetchRestaurant, setFetchRestaurant] = useState([])

      useEffect(() => {
            const fetchAllVendor = async () => {
                  try {
                        const responseRestaurant = await getRestaurantService("ALL")
                        setFetchRestaurant(responseRestaurant.restaurants)
                  } catch (error) {
                        console.log('fetch Vendor error', error)
                  }
            }
            fetchAllVendor()
      })


      return (
            <>
                  <div className='container-restaurant'>
                        <div className='bg-restaurant'>
                        </div>
                  </div>

                  <table id="TableRestaurants">
                        <tbody>
                              <tr>
                                    <th>Image</th>
                                    <th>Email Vendor</th>
                                    <th>Name Restaurant</th>
                                    <th>Address</th>
                                    <th>Actions</th>
                              </tr>
                              {fetchRestaurant && fetchRestaurant.length > 0 &&
                                    fetchRestaurant.map((item, index) => {
                                          if (!item || !item.emailVendor || !item.nameRestaurant || !item.address) {
                                                return null; // Bỏ qua nếu item không hợp lệ
                                          }
                                          return (
                                                <tr key={index}>
                                                      <td>Khong co image</td>
                                                      <td>{item.emailVendor}</td>
                                                      <td>{item.nameRestaurant}</td>
                                                      <td>{item.address}</td>
                                                      <td>{item.action ? 'Enable' : 'Disable'}</td>
                                                </tr>
                                          )
                                    })
                              }
                        </tbody>
                  </table>
            </>

      )
}


export default Restaurant
