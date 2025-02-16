import React from "react";
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Table,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  ButtonToggle,
  Label,
} from "reactstrap";
import { useState, useEffect } from "react";
import CustomerServices from "../../../services/Inventory Services/CustomerServices";
import CreateButton from "../../Pages/Starter/CreateButton";
import NumberWithCommas from "../../Pages/Starter/NumberWithCommas";
import OneWorldServices from "../../../services/Inventory Services/OneWorldServices";
import PackageTypeServices from "../../../services/Inventory Services/PackageTypeServices";
import { Triangle } from "react-loader-spinner";

const PackagetTypeViewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customerDetail, setCustomerDetail] = useState();
  const [loading, setLoading] = useState(true);
  // Function to view item details
  const viewItem = async (itemId) => {
    try {
      const fetchedCustomer = await PackageTypeServices.view(itemId); // Replace with your API call
      console.log("Fetched Item:", fetchedCustomer);

      // Update the state to display the details of the selected item
      setCustomerDetail(fetchedCustomer);
      setLoading(false);
      // Set loading to false after a successful fetch
    } catch (error) {
      console.error("Error viewing item:", error);
      // Set loading to false on error
    }
  };

  useEffect(() => {
    // Fetch the item details when the component mounts based on the id from the URL
    viewItem(id);
  }, [id]);

  const breadcrumbItems = [{ title: "Back to List ", link: "/Package" }];

  return (
    <div className="page-content">
      <BreadCrumb breadcrumbItems={breadcrumbItems} />

      {loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Triangle color="#007bff" height={50} width={50} />
        </div>
      ) : customerDetail ? (
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col xs={12} md={6}>
                    <CardBody>
                      <p>Package Detail</p>

                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <th className="ps-5" scope="row">
                              Name:
                            </th>
                            <td className="text-muted">
                              {customerDetail?.name}
                            </td>
                          </tr>
                          <tr>
                            <th className="ps-5" scope="row">
                              Code:
                            </th>
                            <td className="transaction_Date">
                              {customerDetail?.code}
                            </td>
                          </tr>

                          <tr>
                            <th className="ps-5" scope="row">
                              Status:
                            </th>
                            <td className="text-muted">
                              {customerDetail?.status ? "Active" : "Inactive"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </CardBody>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default PackagetTypeViewDetail;
