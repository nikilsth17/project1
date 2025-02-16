import _BaseAPIService from '../../_BaseAPIService';

const apiService = _BaseAPIService.instance;

const AmazonServices = {
   
    getAmazon: async (name) => {
      const response = await apiService.get(`/configuration/amazon-setting`);
      return response.data;
    },

    create: async (postData) => {
        const response = await apiService.post('/general/test-email', postData);
        return response.data;
      },
  
    ConfigureUpdate: async (updatedData) => {
      const response = await apiService.put(
        '/configuration',
        updatedData
      );
      return response.data;
    },
    
   
   
    updateEmailtemplateupdate: async (updatedData) => {
      const response = await apiService.patch(
        '/configuration/email-template',
        updatedData
      );
      return response.data;
    },
  };

export default AmazonServices




