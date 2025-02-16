import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Table,
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  Label,
  Input,
  ButtonToggle,
} from "reactstrap";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import CreateButton from "../Pages/Starter/CreateButton";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import InstructionServices from "../../services/AustServices/InstructionService/InstructionServices";

const InstructionViewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customerDetail, setCustomerDetail] = useState();

  // Function to view item details
  const viewItem = async (itemId) => {
    try {
      const fetchedCustomer = await InstructionServices.view(itemId); // Replace with your API call
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

  const breadcrumbItems = [{ title: "Back to List", link: "/Instruction" }];

  return (
    <div className="page-content">
      <BreadCrumb
        title="Instruction Detail"
        breadcrumbItems={breadcrumbItems}
      />

      <CreateButton to="/Instruction" text="Back to List" />

      <Row>
        <Col>
          <Card>
            <CardBody>
              <Row>
                <Col xs={12} md={6}>
                  <CardBody>
                    <p>Instruction Detail</p>
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
                            Status:
                          </th>
                          <td className="text-muted">
                            {customerDetail?.isPickUp ? "Pickup" : "Dropoff"}
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
  );
};

export default InstructionViewDetail;
