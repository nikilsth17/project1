import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Label,
  Row,
  Table,
  Button,
} from "reactstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import ProductCategoriesServices from "../../../services/Inventory Services/ProductCategoriesServices"; // Import your service
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import CreateButton from "../../Pages/Starter/CreateButton";

const ProductCategoriesDisplay = (props) => {
  const { id } = useParams();
  console.log("ID from useParams:", id);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // const viewItem = async (itemId) => {
  //   try {
  //     const fetchedItem = await ProductCategoriesServices.view(itemId); // Replace with your API call
  //     console.log("Fetched Item:", fetchedItem);

  //     // Update the state to display the details of the selected item
  //     setItem(fetchedItem);
  //     setLoading(false); // Set loading to false after successful fetch

  //     if (typeof props.onCloseEditor=== "function") {
  //       props.onCloseEditor(fetchedItem); // Pass the fetched item to the onViewClicked function
  //     }
  //   } catch (error) {
  //     console.error("Error viewing item:", error);
  //     setLoading(false); // Set loading to false on error
  //   }
  // };

  // Function to view item details
  const viewItem = async (itemId) => {
    try {
      console.log("hello");
      const fetchedItem = await ProductCategoriesServices.view(itemId); // Replace with your API call
      console.log("Fetched Item:", fetchedItem);

      // Update the state to display the details of the selected item
      setItem(fetchedItem);
      setLoading(false); // Set loading to false after successful fetch
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
        <BreadCrumb
          title="Product Category Detail"
          pageTitle="Product Category "
        />
        <Container fluid>
          <CreateButton to="/product-category" text="  Back to List" />
          <Row>
            <Col lg={2}> </Col>

            <Col lg={8}>
              <Card>
                <CardBody>
                  {loading ? (
                    <p>Loading...</p>
                  ) : item ? (
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <tbody>
                          {/* <tr>
                            <th className="ps-5" scope="row">
                              Code:
                            </th>

                            <td className="code">{item.code}</td>
                          </tr> */}

                          <tr>
                            <th className="ps-5" scope="row">
                              Category:
                            </th>
                            <td className="text-muted">{item.name}</td>
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
                  ) : (
                    <p>Item not found.</p>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ProductCategoriesDisplay;
