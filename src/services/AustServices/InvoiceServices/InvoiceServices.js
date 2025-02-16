// import _BaseAPIService from "../_BaseAPIService";

import _BaseAPIService from "../../_BaseAPIService";

const apiService = _BaseAPIService.instance;

const InvoiceServices = {
  getInvoices: async () => {
    const response = await apiService.get("/invoice");
    return response.data;
  },
  getSingleInvoice: async (id) => {
    const response = await apiService.get(`/invoice/${id}`);
    return response.data;
  },
  editSingleInvoice: async (id) => {
    const response = await apiService.put(`/invoice/${id}`);
    return response.data;
  },
  deleteSingleInvoice: async (id) => {
    const response = await apiService.delete(`/invoice/${id}`);
    return response.data;
  },
  getFilteredInvoice: async ({
    id,
    dateFilter,
    dateFrom,
    dateTo,
    invoiceStatus,
    textSearch,
    pageNumber,
    pageSize,
  }) => {
    var filterList = [];

    if (textSearch) {
      filterList.push(`searchValue=${textSearch}`);
    }

    if (dateFrom) {
      filterList.push(`createdDateFrom=${dateFrom}`);
    }
    if (dateTo) {
      filterList.push(`createdDateTo=${dateTo}`);
    }
    if (invoiceStatus) {
      if (invoiceStatus === "overDue") {
        filterList.push(`duePayment=true`);
      }
      if (invoiceStatus === "awaiting") {
        filterList.push(`remainingPayment=true`);
      }

      if (invoiceStatus === "paid") {
        filterList.push(`isPaid=true`);
      }
    }
    if (dateFilter) {
      if (dateFilter === "thisYear") {
        filterList.push(`thisYear=true`);
      }
      if (dateFilter === "lastYear") {
        filterList.push(`previousYear=true`);
      }
      if (dateFilter === "thisMonth") {
        filterList.push(`thisMonth=true`);
      }
    }

    if (pageNumber) {
      filterList.push(`pageNumber=${pageNumber}`);
    }

    if (pageSize) {
      filterList.push(`pageSize=${pageSize}`);
    }

    const filterString = filterList.join("&");

    const response = await apiService.get(
      `/invoice/${id}/invoicelist?${filterString}`
    );
    return response.data;
  },
};

export default InvoiceServices;
