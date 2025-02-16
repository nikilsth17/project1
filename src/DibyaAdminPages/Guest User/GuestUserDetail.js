import React, { createContext, useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import Detail from "./Detail";
import CustomerServices from "../../services/DibyaServices/CustomerServices/Customer.services";
import OrderTable from "./OrderTable";

export const CustomerContext = createContext();
const GuestDetail = () => {
  const { id } = useParams();
  const [customerDetail, setCustomerDetail] = useState();
  useEffect(() => {
    (async () => {
      try {
        const response = await CustomerServices.getGuestDetail(id);
        setCustomerDetail(response);
        console.log("🚀 ~ response:", response);
      } catch (error) {
        console.log("🚀 ~ error:", error);
      }
    })();
  }, []);

  const breadcrumbItems = [{ title: "Back To List ", link: "/guest-user" }];

  return (
    <div className="page-content">
      <CustomerContext.Provider value={customerDetail}>
        <BreadCrumb
          pageTitle="Guest User"
          title="Guest User Detail"
          breadcrumbItems={breadcrumbItems}
        />
        <Detail />
        <OrderTable />
      </CustomerContext.Provider>
    </div>
  );
};

export default GuestDetail;
