import _BaseAPIService from '../_BaseAPIService';

const instance = _BaseAPIService.instance;

const EmployeeTxnDetailService = {
  

  view: async (id) => {
    console.log(id);
    // eslint-disable-next-line no-useless-catch  
    try {
       
      const response = await instance.get(`/Employee/EmployeeWithTxnDetail?emp_id=`+id);
      console.log('view data ', id,  JSON.stringify(response));
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
 
  
  
  
};

export default EmployeeTxnDetailService;
