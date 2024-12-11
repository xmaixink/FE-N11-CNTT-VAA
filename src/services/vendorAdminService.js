import axios from "../axios";

const registerNewVendor = (data) => {
      return axios.post('/api/register-new-vendor', data)
};

const loginVendor = (data) => {
      console.log('check data', data)
      return axios.post('/api/login-vendor', data)
};

const getAllProductService = (productId) => {
      // console.log('check productId', productId)
      return axios.get(`/api/get-all-product/?id=${productId}`)
}

const createNewProductService = (data) => {
      return axios.post('/api/create-new-product', data)
}

const deleteProductService = (idProduct) => {
      return axios.delete('/api/delete-product', {
            data: {
                  id: idProduct
            }
      })
}
const updateProduct = (inputData) => {
      return axios.put("/api/update-product", inputData)
}

export {
      registerNewVendor, loginVendor,
      getAllProductService, createNewProductService, deleteProductService, updateProduct
};