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
import TablePagination from "../Pages/Starter/Pagination";
import StatusLabel from "../../Components/sebscommon/StatusLabel";
import toast from "react-hot-toast";
import GoodCategoryServices from "../../services/AustServices/Good Category/GoodCategoryServices";

const GoodcategoryViewDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customerDetail, setCustomerDetail] = useState();
  
    // Function to view item details
    const viewItem = async (itemId) => {
      try {
        const fetchedCustomer = await GoodCategoryServices.view(itemId); // Replace with your API call
        console.log("Fetched Item:", fetchedCustomer);
  
        // Update the state to display the details of the selected item
        setCustomerDetail(fetchedCustomer);
        // Set loading to false after a successful fetch
      } catch (error) {
        console.error("Error viewing item:", error);
        // Set loading to false on error
      }
    };

    const breadcrumbItems = [
    
      { title: '< Good Category List ', link: '/Categories' },

    ];
  
    useEffect(() => {
      // Fetch the item details when the component mounts based on the id from the URL
      viewItem(id);
    }, [id]);

    return (
      
      <div className="page-content">
        <BreadCrumb title="Good Category Detail"    breadcrumbItems={breadcrumbItems} />
  
        <CreateButton to="/Categories" text="Back to List" />
        <Row className="d-flex justify-content-center">
    <Col lg={6}>
      <Card>
        <CardBody>
     
             
             
                    
                  <p>Good Category Detail</p>
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
                          Status:
                        </th>
                        <td className="text-muted">
                          {customerDetail?.status ? "Active" : "Inactive"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                 
        </CardBody>
      </Card>
    </Col>
  </Row>
</div>
    );
  };
  
  export default GoodcategoryViewDetail;