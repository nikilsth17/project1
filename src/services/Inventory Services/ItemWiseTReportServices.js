import _BaseAPIService from '../_BaseAPIService';

const apiService = _BaseAPIService.instance;


// Define your service functions, including ItemReport
const ItemWiseTReportServices = {
  // Other service functions...

  // Define the ItemReport function
  ItemReport: async (id) => {
    const response = await apiService.get(`/ItemWiseTxnReport/ItemTxnDetail?Item_id=${id}`);
    return response.data;
  },
  TodaysItemTxnDetail: async (Item_id) => {
    const response = await apiService.get(`/ItemWiseTxnReport/TodaysItemTxnDetail?Item_id=${Item_id}`);
    return response.data;
  },

  GetStockSummary: async () => {
    const response = await apiService.get(`/StockSummaryReport/GetStockSummary`);
    return response.data;
  },
  VendorStatementSummary: async (id) => {
    const response = await apiService.get(`/VendorStatement/VendorStatementSummary?VendorID=` +id);
    return response.data;
  },
  VendorStatementSummary: async (id) => {
    const response = await apiService.get(`/VendorStatement/VendorStatementSummary?VendorID=` +id);
    return response.data;
  },
  VendorStatementDetail: async (id) => {
    const response = await apiService.get(`/VendorStatement/VendorStatementDetail?id=` +id);
    return response.data;
  },
};

// Export the ItemWiseTReportServices object
export default ItemWiseTReportServices;
