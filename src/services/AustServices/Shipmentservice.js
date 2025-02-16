import _BaseAPIService from "../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const ShipmentService = {
  getList: async (id) => {
    try {
      const response = await apiService.get(`/shipment/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching list:", error);
      throw error;
    }
  },

  getCustomerLabel: async (id) => {
    const response = await apiService.get(`/shipment/${id}/customerlabel`);
    return response;
  },

  getAdminLabel: async (id) => {
    const response = await apiService.get(`/shipment/${id}/adminlabel`);
    return response;
  },

  shipmentGetList: async ({
    query,
    createdDate,
    createdDateFrom,
    createdDateTo,
    collectionDateFrom,
    collectionDateTo,
    userEmail,
    destinationAddress,
    pickUpAddress,
    statusId,
    totalCostMin,
    totalCostMax,
    serviceProvider,
    estimatedDays,
    pageNumber,
    pageSize,
    isManifestCreated,
    isInternational,
    trackingNumber,
  }) => {
    const filterList = [];

    if (query) filterList.push(`query=${query}`);
    if (createdDateFrom) filterList.push(`createdDateFrom=${createdDateFrom}`);
    if (createdDate) filterList.push(`createdDate=${createdDate}`);

    if (createdDateTo) filterList.push(`createdDateTo=${createdDateTo}`);

    if (collectionDateFrom)
      filterList.push(`collectionDateFrom=${collectionDateFrom}`);
    if (collectionDateTo)
      filterList.push(`collectionDateTo=${collectionDateTo}`);
    if (userEmail) filterList.push(`userEmail=${userEmail.label}`);
    if (destinationAddress)
      filterList.push(`destinationAddress=${destinationAddress}`);
    if (pickUpAddress) filterList.push(`pickUpAddress=${pickUpAddress}`);
    if (statusId) filterList.push(`statusId=${statusId.value}`);
    if (totalCostMin) filterList.push(`totalCostMin=${totalCostMin}`);
    if (totalCostMax) filterList.push(`totalCostMax=${totalCostMax}`);
    if (serviceProvider)
      filterList.push(`serviceProvider=${serviceProvider.label}`);
    if (estimatedDays) filterList.push(`estimatedDays=${estimatedDays}`);
    if (pageNumber) filterList.push(`pageNumber=${pageNumber}`);
    if (pageSize) filterList.push(`pageSize=${pageSize}`);
    if (isManifestCreated)
      filterList.push(`isManifestCreated=${isManifestCreated}`);
    if (isInternational) filterList.push(`isInternational=${isInternational}`);
    if (trackingNumber) filterList.push(`trackingNumber=${trackingNumber}`);

    let filterString = filterList.join("&");
    // : `query=${query}&customer=${customer}`;

    try {
      const response = await apiService.get(
        `/shipment/shipmentlist?${filterString}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching shipment list:", error);
      console.error("Attempted URL:", `/shipment/shipmentlist?${filterString}`);
      throw error;
    }
  },
};

export default ShipmentService;
