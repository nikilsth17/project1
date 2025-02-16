import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Label,
  Row,
  Button,
} from "reactstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import UnitsService from "../../../services/Inventory Services/UnitsService";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";
import CreateButton from "../../Pages/Starter/CreateButton";

const PUDisplay = (props) => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to view item details
  const viewItem = async (itemId) => {
    try {
      const fetchedItem = await UnitsService.view(itemId); // Replace with your API call
      console.log("Fetched Item:", fetchedItem);

      // Update the state to display the details of the selected item
      setItem(fetchedItem);
      setLoading(false); // Set loading to false after a successful fetch
    } catch (error) {
      console.error("Error viewing item:", error);
      setLoading(false); // Set loading to false on error
    }
  };

  useEffect(() => {
    // Fetch the item details when the component mounts based on the id from the URL
    viewItem(id);
  }, [id]);

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Product Unit Detail" pageTitle="Product_Unit" />

        <Container fluid>
          <CreateButton to="/product-unit" text="  Back to List" />
          <Row>
            <Col lg={2}></Col>
            <Col lg={8}>
              <Card>
                <CardBody>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <th className="ps-5" scope="row">
                            Unit:
                          </th>
                          <td className="code">{item?.name}</td>
                        </tr>
                        <tr>
                          <th className="ps-5" scope="row">
                            Ratio:
                          </th>
                          <td className="text-muted">{item?.ratio}</td>
                        </tr>
                        <tr>
                          <th className="ps-5" scope="row">
                            Status:
                          </th>
                          <td className="text-muted">
                            {item && typeof item.status === "boolean" ? (
                              <div>{item.status ? "Active" : "Inactive"}</div>
                            ) : null}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default PUDisplay;
