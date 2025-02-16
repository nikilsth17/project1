import _BaseAPIService from '../_BaseAPIService';

const instance = _BaseAPIService.instance;

const FuelTokenServices = {
  //Employee getlist ko lagi
  getList: async () => {
    // eslint-disable-next-line no-useless-catch  
    try {
      const response = await instance.get('/FuelToken/GetList');
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  create: async (postData) => {
    // eslint-disable-next-line no-useless-catch
    try {
     
      const response = await instance.post('/FuelToken/Create', postData);
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
      const response = await instance.delete(`/FuelToken/Delete?id=`+id);
      return response.data;
    } catch (error) {
      throw error;
    }  
  },
  view: async (id) => {
    console.log(id);
    // eslint-disable-next-line no-useless-catch  
    try {
       
      const response = await instance.get(`/FuelToken/GetDetail?id=`+id);
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
      

      const response = await instance.patch(`/FuelToken/Update?id=`+id, updatedData);
      return response.data; 
    } catch (error) {
      throw error;
    }
  },

  FueltypegetList: async () => {
    // eslint-disable-next-line no-useless-catch  
    try {
      const response = await instance.get('/FuelType');
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  FuelloggetList: async () => {
    // eslint-disable-next-line no-useless-catch  
    try {
      const response = await instance.get('/FuelLogBook');
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  
  
};

export default FuelTokenServices;
