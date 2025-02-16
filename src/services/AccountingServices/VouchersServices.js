import _BaseAPIService from "../_BaseAPIService";

const instance = _BaseAPIService.instance;

const JournalVouchersService =  {

  create: async (postData) => {
    // eslint-disable-next-line no-useless-catch
    try {
       // Your Bearer token (replace with your actual token)

       // Define the headers with the Authorization header
      console.log("error", postData);
      const response = await instance.post('/JournalVoucher/Create', postData);
      console.log("response: ", response);
      return response.data;
    } catch (error) {
      throw error;
    }  
  },

getList: async () => {
    // eslint-disable-next-line no-useless-catch  
    try {
      const response = await instance.get('/JournalVoucher/GetList');
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  delete: async (voucherNo) => {
    // eslint-disable-next-line no-useless-catch
    try {
      
      console.log("error");
      const response = await instance.delete(`/Voucher/Delete/${voucherNo}`);
      return response.data;
    } catch (error) {
      throw error;
    }  
  },
  
  view: async (id) => {
    console.log(id);
    // eslint-disable-next-line no-useless-catch  
    try {
       
      const response = await instance.get(`/JournalVoucher/GetDetail?id=`+id);
      
      console.log('view data ', id,  JSON.stringify(response));
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  update: async (voucherNo, updatedData) => {
    // eslint-disable-next-line no-useless-catch
    try {
      console.log("update",updatedData);
      const response = await instance.patch(`/JournalVoucher/Update?id=`+voucherNo, updatedData);
    
      return response.data; 
    } catch (error) {
      throw error;
    }
  },
  
} 
export default JournalVouchersService;