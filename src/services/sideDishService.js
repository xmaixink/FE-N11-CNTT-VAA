import axios from '../axios';

const getAllSideDishService = (id) => {
      return axios.get(`/api/get-all-side-dishes/?id=${id}`);
};

const createNewSideDishService = (data) => {
      return axios.post('/api/create-side-dish', data);
};

const deleteSideDishService = (idSideDish) => {
      return axios.delete('/api/delete-side-dish', {
            data: {
                  id: idSideDish
            }
      })
}

export { createNewSideDishService, getAllSideDishService, deleteSideDishService };
