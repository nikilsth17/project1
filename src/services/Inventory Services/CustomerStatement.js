import _BaseAPIService from '../_BaseAPIService';

const apiService = _BaseAPIService.instance;


const CustomerStatement = {
  // Define your API functions here
  getList: async (id) => {
    const response = await apiService.get('/CustomerStatement/CustomerStatementSummary?CustomerID=' +id);
    return response.data;
  },
  view: async (id) => {
    const response = await apiService.get('/CustomerStatement/CustomerStatementDetail?id='  + id);
    return response.data;
  },

};

export default CustomerStatement;
