import _BaseAPIService from '../_BaseAPIService';

const instance = _BaseAPIService.instance;

const PayrollService = {

  create: async (postData) => {
    // eslint-disable-next-line no-useless-catch
    try {
       
      const response = await instance.post('/Payroll/Create', postData);
      console.log("response: ", response);
      return response.data;
    } catch (error) {
      throw error;
    }  
  },
  getList: async () => {
    // eslint-disable-next-line no-useless-catch  
    try {
      const response = await instance.get('/Payroll/GetList');
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  update: async (id, updatedData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.patch(`/Payroll/Update?id=`+id, updatedData);
      return response.data; 
    } catch (error) {
      throw error;
    }
  }, 
  delete: async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      
      console.log("error");
      const response = await instance.delete(`/Payroll/Delete?id=`+id);
      return response.data;
    } catch (error) {
      throw error;
    }  
  },
  view: async (id) => {
    console.log('calling api: ', id);
    // eslint-disable-next-line no-useless-catch  
    try {
      const response = await instance.get(`/Payroll/GetDetail?id=`+id);
      console.log('view data ', id,  JSON.stringify(response));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


export default PayrollService;
