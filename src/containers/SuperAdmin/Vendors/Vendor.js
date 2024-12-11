import React, { useState, useEffect } from 'react'
import "./Vendor.css"
import { getVendorService } from '../../../services/superAdminService'

function Vendor() {

	const [fetchVendor, setFetchVendor] = useState([])

	useEffect(() => {
		const fetchAllVendor = async () => {
			try {
				const responseVendor = await getVendorService("ALL")
				setFetchVendor(responseVendor.vendors)

			} catch (error) {
				console.log('fetch Vendor error', error)
			}
		}
		fetchAllVendor()
	})

	return (
		<>
			<div className='container-vendors'>
				<div className='title' style={{ margin: "10px" }}>
					VENDORS
				</div>

				<div className='vendor-body'>
					<div className='container'>
						<div className='row'>

							<div className='title' style={{ margin: "10px" }}>
								ADD VENDORS
							</div>

							<div className='col-12'>
								<label> Email</label>
								<input className='form-control' type="email" placeholder='Email' />
							</div>
							<div className='col-12'>
								<label> Password</label>
								<input className='form-control' type="password" placeholder='Password' />
							</div>
							<div className='col-12'>
								<label> PhoneNumber</label>
								<input className='form-control' type="number" placeholder='PhoneNumber' />
							</div>

							<div className="col-12 my-3 btn-vendor">
								<button>Add Vendor</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			<table id="TableVendors">
				<tbody>
					<tr>
						<th>Image</th>
						<th>Email</th>
						<th>Total Restaurants</th>
						<th>PhoneNumber</th>
						<th>Actions</th>
					</tr>
					{fetchVendor && fetchVendor.length > 0 &&
						fetchVendor.map((item, index) => {
							if (!item || !item.email || !item.totalRestaurants || !item.phoneNumber) {
								return null; // Bỏ qua nếu item không hợp lệ
							}
							return (
								<tr key={index}>
									<td>Khong co image</td>
									<td>{item.email}</td>
									<td>{item.totalRestaurants}</td>
									<td>{item.phoneNumber}</td>
									<td>
										<button
											className="btn-edit" > <i className="fas fa-edit"></i> </button>
										<button
											className="btn-delete" > <i className="fas fa-trash"></i> </button>
									</td>
								</tr>
							)
						})

					}
				</tbody>
			</table>
		</>

	)
}


export default Vendor
