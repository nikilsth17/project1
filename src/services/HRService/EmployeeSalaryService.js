import _BaseAPIService from '../_BaseAPIService';

const instance = _BaseAPIService.instance;

const EmployeeSalaryService = {
  //Employee getlist ko lagi
  getList: async () => {
    // eslint-disable-next-line no-useless-catch  
    try {
      const response = await instance.get('/EmployeeSalary/GetList');
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // create: async (postData) => {
  //   // eslint-disable-next-line no-useless-catch
  //   try {
       
  //     const response = await instance.post('/EmployeeSalary/Create', postData);
  //     console.log("response: ", response);
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }  
  // },
  delete: async (id) => {
    // eslint-disable-next-line no-useless-catch
    try {
      
      console.log("error");
      const response = await instance.delete(`/EmployeeSalary/Delete?id=`+id);
      return response.data;
    } catch (error) {
      throw error;
    }  
  },
  view: async (id) => {
    console.log(id);
    // eslint-disable-next-line no-useless-catch  
    try {
       
      const response = await instance.get(`/EmployeeSalary/GetDetail?id=`+id);
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
      

      const response = await instance.patch(`/EmployeeSalary/Update?id=`+id, updatedData);
      return response.data; 
    } catch (error) {
      throw error;
    }
  },
  
  
};

export default EmployeeSalaryService;
