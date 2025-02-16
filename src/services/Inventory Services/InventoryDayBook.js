import _BaseAPIService from "../_BaseAPIService";

const instance = _BaseAPIService.instance;

const InventoryDayBookService = {
  getList: async (date) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.get("/InventoryDayBook?date=" + date);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  createAuto: async (date) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await instance.post("/AutoVoucher?date=" + date);
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
export default InventoryDayBookService;
