import React, { createContext, useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import ItemServices from "../../services/DibyaServices/ItemServices/ItemServices";
import CardDetails from "./Components/CardDetails";
import ProductDetail from "./Components/ProductDetail";
import { Col, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";

export const ItemContext = createContext();
const itemDetail = () => {
  const { id } = useParams();
  const [itemDetail, setItemDetail] = useState();
  console.log("🚀 ~ itemDetail ~ itemDetail:", itemDetail);
  useEffect(() => {
    (async () => {
      try {
        const response = await ItemServices.viewItem(id);
        setItemDetail(response);
      } catch (error) {
        console.log("🚀 ~ error:", error);
      }
    })();
  }, []);

  const breadcrumbItems = [
    {
      title: "Back to List",
      link: "/items",
    },
  ];

  return (
    <div className="page-content">
      <BreadCrumb
        title="Item Details"
        breadcrumbItems={breadcrumbItems}
        pageTitle="Items"
      />
      <ItemContext.Provider value={itemDetail}>
          {/* <Col lg={4}>
            <CardDetails />
          </Col> */}
          <Col lg={4}></Col>
          <Col lg={8} className="p-2">
            <ProductDetail />
          </Col>
      </ItemContext.Provider>
    </div>
  );
};

export default itemDetail;
