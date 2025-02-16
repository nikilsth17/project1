import _BaseAPIService from '../_BaseAPIService';

const instance = _BaseAPIService.instance;

const ShiftingToCounterService = {

 
  getList: async () => {
    // eslint-disable-next-line no-useless-catch  
    try {
      const response = await instance.get('/ShiftingToCounter/GetList');
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }, 
  create: async (postData) => {
    // eslint-disable-next-line no-useless-catch
    try {
       // Your Bearer token (replace with your actual token)

       // Define the headers with the Authorization header
      console.log("error", postData);
      const response = await instance.post('/ShiftingToCounter/Create', postData);
      console.log("response: ", response);
      return response.data;
    } catch (error) {
      throw error;
    }  
  },

  update: async (id, updatedData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.patch(`/ShiftingToCounter/Update?id=`+id, updatedData);
      return response.data; 
    } catch (error) {
      throw error;
    }
  }, 
  delete: async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      
      console.log("error");
      const response = await instance.delete(`/ShiftingToCounter/Delete?id=`+id);
      return response.data;
    } catch (error) {
      throw error;
    }  
  },
  view: async (id) => {
    console.log('calling api: ', id);
    // eslint-disable-next-line no-useless-catch  
    try {
      const response = await instance.get(`/ShiftingToCounter/GetDetail?id=`+id);
      console.log('view data ', id,  JSON.stringify(response));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
};


export default ShiftingToCounterService;
