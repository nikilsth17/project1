import React, { useEffect, useState } from "react";
import FilterComponent from "./components/FilterComponent";
import ManifestDescription from "./components/ManifestDescription";
import ShipmentTable from "./components/ShipmentTable";
import ManifestServices from "../../services/ManifestServices/ManifestServices";
import { useParams } from "react-router-dom";
import { useSSR } from "react-i18next";

const ManifestDetail = () => {
  const { id } = useParams();
  const [manifestDetail, setManifestDetail] = useState();
  console.log("🚀 ~ ManifestDetail ~ manifestDetail:", manifestDetail);
  useEffect(() => {
    (async () => {
      try {
        const response = await ManifestServices.getManifestById(id);
        setManifestDetail(response);
      } catch (error) {
        console.log("🚀 ~ async ~ error:", error);
      }
    })();
  }, []);

  return (
    <div className="page-content">
      <ManifestDescription manifestDetail={manifestDetail} />
      <ShipmentTable manifestDetail={manifestDetail} />
    </div>
  );
};

export default ManifestDetail;
