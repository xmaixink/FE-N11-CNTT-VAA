import axios from '../axios'

const getAllCuisineService = (cuisineId) => {
      return axios.get(`/api/get-all-product/?id=${cuisineId}`)
}

const createNewCuisineService = (data) => {
      return axios.post('/api/create-new-product', data)
}

export {
      getAllCuisineService, createNewCuisineService

}

