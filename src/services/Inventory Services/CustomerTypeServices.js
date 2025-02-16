import _BaseAPIService from '../_BaseAPIService';

const instance = _BaseAPIService.instance;

const CustomerTypeServices = {
  //Employee getlist ko lagi
  getList: async () => {
    // eslint-disable-next-line no-useless-catch  
    try {
      const response = await instance.get('/customer-type');
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getPayment: async () => {
    // eslint-disable-next-line no-useless-catch  
    try {
      const response = await instance.get('/general/payment-type');
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
 
  create: async (postData) => {
    // eslint-disable-next-line no-useless-catch
    try {
     
      const response = await instance.post('/customer-type', postData);
      console.log("response: ", response);
      return response.data;
    } catch (error) {
      throw error;
    }  
  },
  delete: async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      
      console.log("error");
      const response = await instance.delete(`/customer-type/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }  
  },
  view: async (id) => {
    console.log(id);
    // eslint-disable-next-line no-useless-catch  
    try {
       
      const response = await instance.get(`/customer-type/${id}`);
      console.log('view data ', id,  JSON.stringify(response));
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  update: async (id, updatedData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      

      const response = await instance.put(`/customer-type/${id}`, updatedData);
      return response.data; 
    } catch (error) {
      throw error;
    }
  },

  
  
  
  
};

export default CustomerTypeServices;




