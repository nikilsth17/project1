import React from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
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
import CurrencyServices from "../../services/AustServices/CurrencySe/CurrencyServices";
import CreateButton from "../Pages/Starter/CreateButton";
import ImportReasonService from "../../services/AustServices/ImportReasonService";
const ImportReasonDisplay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customerDetail, setCustomerDetail] = useState();

  // Function to view item details
  const viewItem = async (itemId) => {
    try {
      const fetchedCustomer = await ImportReasonService.view(itemId); // Replace with your API call
      console.log("Fetched Item:", fetchedCustomer);

      // Update the state to display the details of the selected item
      setCustomerDetail(fetchedCustomer);
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

  const breadcrumbItems = [
    { title: "< Import Reason List", link: "/import-reason" },
  ];

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="Import Reason Detail"
          breadcrumbItems={breadcrumbItems}
          pageTitle="Import Reason "
        />
        <CreateButton to="/import-reason" text="Back to List" />
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col xs={12} md={6}>
                    <CardBody>
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <th className="ps-5" scope="row">
                              Title:
                            </th>
                            <td className="text-muted">
                              {customerDetail?.title}
                            </td>
                          </tr>
                          <tr>
                            <th className="ps-5" scope="row">
                              Description:
                            </th>
                            <td className="text-muted">
                              {customerDetail?.description}
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
      </div>
    </Container>
  );
};

export default ImportReasonDisplay;
