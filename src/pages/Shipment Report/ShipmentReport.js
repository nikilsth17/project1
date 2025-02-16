import React, { useEffect, useRef, useState } from "react";
import {
  Col,
  Container,
  Input,
  Row,
  Button,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import ShipmentCard from "./ShipmentCard";
import ShipmentService from "../../services/AustServices/Shipmentservice";
import { Triangle } from "react-loader-spinner";
import toast from "react-hot-toast";
import Filter from "./Filter";
import ShipmentTable from "./components/ShipmentTable";
import ManifestServices from "../../services/ManifestServices/ManifestServices";

const ShipmentReport = () => {
  const [shipment, setShipment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState();
  const [label, setLabel] = useState(null);
  const [totalData, setTotalData] = useState(0);
  const [gridView, setGridView] = useState(false);
  const [manifestLoading, setManifestLoading] = useState(false);
  // const selectedShipment = useRef([]);
  // console.log("🚀 ~ ShipmentReport ~ selectedShipment:", selectedShipment);
  const [selectedShipment, setSelectedShipment] = useState([]);

  const [activeTab, setActiveTab] = useState("all");
  const toggleTab = (tab) => {
    setActiveTab(tab);
    if (tab === "all") {
      fetchShipmentDetails({
        filters: {
          ...filters,
          // isManifestCreated: "false",
        },
      });
    } else {
      fetchShipmentDetails({
        filters: {
          ...filters,
          isManifestCreated: "false",
        },
      });
    }
  };

  const [filters, setFilters] = useState({
    query: "",
    createdDate: "",
    createdDateFrom: "",
    createdDateTo: "",
    collectionDateFrom: "",
    collectionDateTo: "",
    userEmail: "",
    statusId: null,
    pickUpAddress: "",
    destinationAddress: "",
    estimatedDays: "",
    totalCostMin: null,
    totalCostMax: null,
    serviceProvider: "",
    trackingNumber: "",
    // isManifestCreated: "false",
    // isInternational: "false",
    hasManifest: false,
    pageNumber: 1,
    pageSize: 50,
  });

  const fetchShipmentDetails = async ({ filters }) => {
    try {
      setLoading(true);
      const response = await ShipmentService.shipmentGetList({
        ...filters,
      });
      setShipment(response.data);
      setTotalData(response.totalData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shipment details:", error);
      setLoading(false);
    }
  };

  const createManifest = async () => {
    try {
      setManifestLoading(true);
      const data = selectedShipment.map((item) => {
        return item.id;
      });
      await ManifestServices.createManifest({
        shipmentId: data,
      });
      toast.success("Manifest has been created");
      toggleTab("all");
      // fetchShipmentDetails({ filters: filters });
      setManifestLoading(false);
    } catch (error) {
      console.log("🚀 ~ createManifest ~ error:", error);
      toast.error(error.response?.data);
      setManifestLoading(false);
    }
  };

  useEffect(() => {
    fetchShipmentDetails({ filters: filters });
  }, []);

  return (
    <Container>
      <div className="page-content">
        <Row>
          <Filter
            setShipment={setShipment}
            filters={filters}
            setFilters={setFilters}
            fetchShipmentDetails={fetchShipmentDetails}
            loading={loading}
            setGridView={setGridView}
            gridView={gridView}
            createManifest={createManifest}
            manifestLoading={manifestLoading}
          />
        </Row>

        <div>
          <Nav tabs justified className="mb-3">
            <NavItem>
              <NavLink
                className={`${
                  activeTab === "all" && "cursor-pointer text-light "
                } cursor-pointer`}
                onClick={() => toggleTab("all")}
                style={{
                  fontSize: "15px",
                  background: `${activeTab === "all" ? "#5B71B8" : "#FBFBF3"}`,
                }}
              >
                All
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={`${
                  activeTab !== "all" && "cursor-pointer text-light "
                } cursor-pointer`}
                onClick={() => toggleTab("manifest")}
                style={{
                  fontSize: "15px",
                  background: `${activeTab !== "all" ? "#5B71B8" : "#FBFBF3"}`,
                }}
              >
                Manifestable Shipment
              </NavLink>
            </NavItem>
          </Nav>
          {gridView ? (
            <ShipmentCard
              shipment={shipment}
              totalData={totalData}
              fetchShipmentDetails={fetchShipmentDetails}
              filters={filters}
              selectedShipment={selectedShipment}
              setSelectedShipment={setSelectedShipment}
              setFilters={setFilters}
              activeTab={activeTab}
            />
          ) : (
            <ShipmentTable
              shipment={shipment}
              totalData={totalData}
              fetchShipmentDetails={fetchShipmentDetails}
              selectedShipment={selectedShipment}
              setSelectedShipment={setSelectedShipment}
              filters={filters}
              setFilters={setFilters}
              activeTab={activeTab}
            />
          )}
        </div>
      </div>
    </Container>
  );
};

export default ShipmentReport;
