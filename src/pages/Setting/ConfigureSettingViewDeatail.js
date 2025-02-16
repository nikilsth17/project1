import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
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
} from "reactstrap";
import CreateButton from "../Pages/Starter/CreateButton";
import toast from "react-hot-toast";
import ConfigureSetingServices from "../../services/AustServices/ConfigurationSettingSErvices/ConfigureSetingServices";

const ConfigureSettingViewDeatail = () => {
  const { name } = useParams(); // Assuming you're fetching by name
  const navigate = useNavigate();

  const [customerDetail, setCustomerDetail] = useState();
  console.log("Name:", name);
  // Function to view item details
  const viewItem = async (itemName) => {
    try {
      const fetchedCustomer = await ConfigureSetingServices.view(itemName);
      console.log("Fetched Item:", fetchedCustomer);

      setCustomerDetail(fetchedCustomer);
    } catch (error) {
      console.error("Error viewing item:", error);
    }
  };

  useEffect(() => {
    viewItem(name);
  }, [name]);

  const breadcrumbItems = [
    
    { title: 'Configure Setting List ', link: '/Configure Setting' },

  ];

  return (
  
    <div className="page-content">
      <BreadCrumb title="Configure Setting Detail"  breadcrumbItems={breadcrumbItems} />

      <CreateButton to="/Configure Setting " text="  Back to List" />
      <Row>
    <Col>
      <Card>
        <CardBody>
          <Row>
            <Col xs={12} md={6}>
              <Card>
                <CardBody>
                      <p>Configure Setting Detail</p>

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
                          Description:
                          </th>
                          <td className="text-muted">
                            {customerDetail?.description}
                          </td>
                          </tr>
                          <tr>
                            <th className="ps-5" scope="row">
                         Value:
                            </th>
                            <td className="text-muted">
                              {customerDetail?.value}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      </CardBody>
              </Card>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  </Row>
</div>
  )
}

export default ConfigureSettingViewDeatail