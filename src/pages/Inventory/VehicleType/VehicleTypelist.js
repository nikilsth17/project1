import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import LayoutWithBreadCrumb from "../../Pages/Starter/LayoutWithBreadCrumb";
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
import CreateButton from "../../Pages/Starter/CreateButton";
import VechicleTypeService from "../../../services/Inventory Services/VehicleTypeServices";
import TablePagination from "../../Pages/Starter/Pagination"; // Import the TablePagination component

const VehicleTypeList = () => {
  const navigate = useNavigate();
  const [vechicleType, setVechicleType] = useState([]);
  const [error, setError] = useState(null);
  const pageSize = 5; // Set the number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  async function fetchPurchase() {
    try {
      const fetchedPurchase = await VechicleTypeService.getList();
      setVechicleType(fetchedPurchase);
    } catch (err) {
      setError(err);
    }
  }
  const handleNavigationForm = () => {
    navigate("/vehicletype-form"); // Replace with the actual path
  };

 

  const handleDelete = async (productId) => {
    try {
      if (window.confirm("Do you really want to delete this VehicleList?")) {
        const deletedProduct = await VechicleTypeService.delete(productId);
        console.log(
          `Product deleted successfully: ${JSON.stringify(deletedProduct)}`
        );
        setVechicleType((prevProductList) =>
          prevProductList.filter((product) => product.id !== productId)
        );
      } else {
        // User canceled, do nothing or handle accordingly
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle page navigation
  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const paginatedVechicleType = vechicleType.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  useEffect(() => {
    fetchPurchase();
  }, []);

  return (
    <React.Fragment>
    <div className="page-content">
     
        <BreadCrumb title="Vehical Type" pageTitle="Vehical Type List" />
        <Container fluid>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <CreateButton
                    to="/vehicletype-form"
                    text="+ Create Vehicle Type List"
                  />
                </CardHeader>
                <CardBody>
                  <div className="table-responsive table-card mt-3 mb-1">
                    <table className="table align-middle table-nowrap">
                      <thead className="table-light">
                        <tr>
                          <th className="sort" data-sort="sn">
                            S.N
                          </th>
                          <th className="sort" data-sort="title">
                            Vehicle Type
                          </th>
                          <th className="sort" data-sort="description">
                            Description
                          </th>
                          <th className="sort" data-sort="actions">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedVechicleType.map((vehicletype, index) => (
                          <tr key={vehicletype.id}>
                            <td>{index + 1}</td>
                            <td >{vehicletype.title}</td>
                            <td>{vehicletype.description}</td>
                            <td >
                              <ButtonGroup size="sm">
                                <div className="d-flex gap-1">
                                  {/* <Link
                                    to={`/vehicletype-form/details/${vehicletype.id}`}
                                  >
                                    <Button
                                      color="btn btn-soft-success"
                                      className="btn-sm gap-1"
                                    >
                                      <i className="bx bx-show" />
                                    </Button>
                                  </Link> */}

                                  <Link
                                    to={`/vehicletype-form/edit/${vehicletype.id}`}
                                  >
                                    <Button
                                      color="btn btn-soft-warning"
                                      className="btn-sm gap-1"
                                    >
                                      <i className="ri-edit-line" />
                                    </Button>
                                  </Link>
                                  <Button
                                    className="btn btn-soft-danger btn-sm gap-1"
                                    color="danger"
                                    onClick={() => handleDelete(vehicletype.id)}
                                  >
                                    <i className="ri-delete-bin-5-fill" />
                                  </Button>
                                </div>
                              </ButtonGroup>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <TablePagination
                    pagesCount={Math.ceil(vechicleType.length / pageSize)}
                    currentPage={currentPage}
                    handlePageClick={handlePageClick}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
    
    </div>
    </React.Fragment>
  );
};

export default VehicleTypeList;
