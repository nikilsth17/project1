import _BaseAPIService from '../_BaseAPIService';

const instance = _BaseAPIService.instance;

const VechicleTypeService = {
  // Define your API functions here
  getList: async () => {
    const response = await instance.get('/VehicleType/GetList');
    return response.data;
  },
  create: async (postData) => {
    const response = await instance.post('/VehicleType/Create', postData);
    return response.data;
  },
  view: async (id) => {
    const response = await instance.get('/VehicleType/GetDetail?id='  + id);
    return response.data;
  },
  delete: async (id) => {
    const response = await instance.delete('/VehicleType/Delete?id=' +id);
    return response.data;
  },
  update: async (id, updatedData) => {
    const response = await instance.patch(`/VehicleType/Update?id=` +id, updatedData);
    return response.data;
  },
};

export default VechicleTypeService;
