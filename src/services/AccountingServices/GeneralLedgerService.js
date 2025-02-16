import _BaseAPIService from '../_BaseAPIService';

const instance = _BaseAPIService.instance;

const GeneralLedgerService =  {
// Define your API functions here
getList: async () => {
  // eslint-disable-next-line no-useless-catch  
  try {
    const response = await instance.get('/GeneralLedger/GetList');
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
    const response = await instance.post('/GeneralLedger/Create', postData);
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
    const response = await instance.delete(`/GeneralLedger/Delete/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }  
},

update: async (id, updatedData) => {
  // eslint-disable-next-line no-useless-catch
  try {
    

    const response = await instance.put(`/GeneralLedger/Update/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
},
  
}
export default GeneralLedgerService;


