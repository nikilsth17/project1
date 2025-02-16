import _BaseAPIService from '../_BaseAPIService';

const instance = _BaseAPIService.instance;

const VehicleServices = {
  // Define your API functions here
  getList: async () => {
    const response = await instance.get('/Vehicle/GetList');
    return response.data;
  },
  create: async (postData) => {
    const response = await instance.post('/Vehicle/Create', postData);
    return response.data;
  },
  view: async (id) => {
    const response = await instance.get('/Vehicle/GetDetail?id='  + id);
    return response.data;
  },
  delete: async (id) => {
    const response = await instance.delete('/Vehicle/Delete?id=' +id);
    return response.data;
  },
  update: async (id, updatedData) => {
    const response = await instance.patch(`/Vehicle/Update?id=` +id, updatedData);
    return response.data;
  },
  vehicletransctionDetail: async (id) => {
    const response = await instance.get(`/Vehicle/VehicleWithTxnDetail?vec_id=` +id);
    return response.data;
  },

  vehicleLogBookgetList: async () => {
    const response = await instance.get('/VehicleLogBook');
    return response.data;
  },

  vehicleLogBook: async (id) => {
    const response = await instance.get('/VehicleLogBook?VehicleId='  + id);
    return response.data;
  },

  vehicleLogBookdateandtime: async (id, dateofvehicle) => {
    const response = await instance.get('/VehicleLogBook?VehicleId=' + id + '&Datetime=' + dateofvehicle);
    return response.data;
  },
  

  vehicleLogBookDate: async (dateofvehicle) => {
    const response = await instance.get(`/VehicleLogBook?Datetime=${dateofvehicle}`);
    return response.data;
  }
  
};

export default VehicleServices;
