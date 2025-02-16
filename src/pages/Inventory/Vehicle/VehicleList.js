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
import VehicleServices from "../../../services/Inventory Services/VehicleServices";
import TablePagination from "../../Pages/Starter/Pagination"; // Import the TablePagination component

const VehicleList = () => {
  const navigate = useNavigate();
  const [vehicle, setvehicle] = useState([]);
  const [error, setError] = useState(null);
  const pageSize = 5; // Set the number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  async function fetchPurchase() {
    try {
      const fetchedPurchase = await VehicleServices.getList();
      setvehicle(fetchedPurchase);
    } catch (err) {
      setError(err);
    }
  }

  const handleNavigationForm = () => {
    navigate("/vehicle-form");
  };


  const handleDelete  = async (productId) => {
    try {
      if (window.confirm("Do you really want to delete this Vehicle?")) {
        const deletedProduct = await VehicleServices.delete(productId);
        console.log(
          `Product deleted successfully: ${JSON.stringify(deletedProduct)}`
        );
        setvehicle((prevProductList) =>
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

  const paginatedVehicles = vehicle.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  useEffect(() => {
    fetchPurchase();
  }, []);

  return (
    <React.Fragment>
    <div className="page-content">
       
        <BreadCrumb title="Vehicle" pageTitle="Vehicle List" />
        <Container fluid>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <CreateButton
                    to="/vehicle-form"
                    text="+ Create New Vehicle List"
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
                          <th className="sort" data-sort="vehicleType">
                            Vehicle
                          </th>
                          <th className="sort" data-sort="fuelType">
                            Fuel
                          </th>
                          <th className="sort" data-sort="vehicle_No">
                            Vehicle No
                          </th>
                          <th className="sort" data-sort="vehicle_Model">
                            Vehicle Model
                          </th>
                          <th className="sort" data-sort="actions">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedVehicles.map((vehicle, index) => (
                          <tr key={vehicle.id}>
                            <td>{index + 1}</td>
                            <td >
                              <Link
                                to={`/vehicletype-form/details/${vehicle.vehicleTypeId}`}
                              >
                                {vehicle.vehicleType}
                              </Link>
                            </td >
                            <td >{vehicle.fuelType}</td>
                            <td >{vehicle.vehicle_No}</td>
                            <td >{vehicle.vehicle_Model}</td>
                            <td >
                              <ButtonGroup size="sm">
                                <div className="d-flex gap-1">
                                  <Link
                                    to={`/vehicle-form/vehcletxndetail/${vehicle.id}`}
                                  >
                                    <Button
                                      color="btn btn-soft-success"
                                      className="btn-sm gap-1"
                                    >
                                      <i className="bx bx-show" />
                                    </Button>
                                  </Link>
                                  <Link to={`/vehicle-form/edit/${vehicle.id}`}>
                                    <Button
                                      color="btn btn-soft-warning"
                                      className="btn-sm gap-1"
                                    >
                                      <i className="ri-edit-line"></i>
                                    </Button>
                                  </Link>
                                  <Button
                                    className="btn btn-soft-danger btn-sm gap-1"
                                    color="danger"
                                    onClick={() => handleDelete(vehicle.id)}
                                  >
                                    <i className="ri-delete-bin-5-fill"></i>
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
                    pagesCount={Math.ceil(vehicle.length / pageSize)}
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

export default VehicleList;
