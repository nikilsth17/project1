import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const ConfigureSetingServices = {
  // Define your API functions here
  // getList: async () => {
  //   const response = await apiService.get('/configuration');
  //   return response.data;
  // },
  Emailgethooks: async () => {
    const response = await apiService.get("/general/email-hooks");
    return response.data;
  },

  EmailgetList: async () => {
    const response = await apiService.get("/configuration/email-setting");
    return response.data;
  },
  EmailTemplateList: async () => {
    const response = await apiService.get("/configuration/email-template");
    return response.data;
  },
  getAramax: async (name) => {
    const response = await apiService.get(`/configuration/aramex-setting`);
    return response.data;
  },
  getAust: async (name) => {
    const response = await apiService.get(`/configuration/auspost-setting`);
    return response.data;
  },
  getcourier: async (name) => {
    const response = await apiService.get(
      `/configuration/courierplease-setting`
    );
    return response.data;
  },

  serviceview: async (id) => {
    const response = await apiService.get(`/serviceprovider/${id}`);
    return response.data;
  },
  configureServiceUpdate: async (updatedData) => {
    const response = await apiService.patch(
      `/serviceprovider/service-provider`,
      updatedData
    );
    return response.data;
  },

  getshipment: async (id) => {
    const response = await apiService.get(`/shipment/${id}`);
    return response.data;
  },
  view: async (key) => {
    const response = await apiService.get(`/configuration/${key}`);
    return response.data;
  },
  ConfigureUpdate: async (updatedData) => {
    const response = await apiService.put("/configuration", updatedData);
    return response.data;
  },
  // apiloglist: async () => {
  //   const response = await apiService.get("/apilog");
  //   return response.data;
  // },
  apiloglistDetail: async (id) => {
    const response = await apiService.get(`/outgoingapirequest/getbyid/${id}`);
    return response.data;
  },

  apiloglist: async ({
    ApplicationName,
    FromDate,
    ToDate,
    Path,
    statusCode,
  }) => {
    var filterList = [];

    if (ApplicationName) {
      filterList.push(`ApplicationName=${ApplicationName}`);
    }
    if (FromDate) {
      filterList.push(`FromDate=${FromDate}`);
    }
    if (ToDate) {
      filterList.push(`ToDate=${ToDate}`);
    }
    if (Path) {
      filterList.push(`Path=${Path}`);
    }
    if (statusCode) {
      filterList.push(`statusCode=${statusCode}`);
    }

    var filterString = filterList.join("&");

    const response = await apiService.get(
      `/outgoingapirequest?${filterString}`
    );

    return response.data;
  },

  requestlogDetail: async (id) => {
    const response = await apiService.get(`/serilogrequest/getbyid/${id}`);
    return response.data;
  },

  requestloglist: async ({ level, FromDate, ToDate, searchString }) => {
    var filterList = [];

    if (level) {
      filterList.push(`level=${level.label}`);
    }
    if (FromDate) {
      filterList.push(`FromDate=${FromDate}`);
    }
    if (ToDate) {
      filterList.push(`ToDate=${ToDate}`);
    }
    if (searchString) {
      filterList.push(`searchString=${searchString}`);
    }

    var filterString = filterList.join("&");

    const response = await apiService.get(
      `/serilogrequest/getlist?${filterString}`
    );

    return response.data;
  },

  updateEmailtemplateupdate: async (updatedData) => {
    const response = await apiService.patch(
      "/configuration/email-template",
      updatedData
    );
    return response.data;
  },
};

export default ConfigureSetingServices;
