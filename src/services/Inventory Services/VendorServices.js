import _BaseAPIService from '../_BaseAPIService';

const instance = _BaseAPIService.instance;

const VendorsServices = {
  // Define your API functions here
  getList: async () => {
    const response = await instance.get('/Vendors/GetList');
    return response.data;
  },
  create: async (postData) => {
    const response = await instance.post('/Vendors/Create', postData);
    return response.data;
  },
  view: async (id) => {
    const response = await instance.get('/Vendors/GetDetail?id='  + id);
    return response.data;
  },
  delete: async (id) => {
    const response = await instance.delete('/Vendors/Delete?id=' +id);
    return response.data;
  },
  update: async (id, updatedData) => {
    const response = await instance.patch(`/Vendors/Update?id=` +id, updatedData);
    return response.data;
  },
Vendorview: async (id) => {
    const response = await instance.get('/Vendors/VendorWithTxnDetail?ven_id='  + id);
    return response.data;
  },
};

export default VendorsServices;
