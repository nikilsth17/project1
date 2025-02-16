import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import CustomerServices from "../../../services/Inventory Services/CustomerServices";
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
import NumberWithCommas from "../../Pages/Starter/NumberWithCommas";
import StatusLabel from "../../../Components/sebscommon/StatusLabel";
import TablePagination from "../../Pages/Starter/Pagination"; // Import the TablePagination component

const SaleCustomersLists = () => {
  const navigate = useNavigate();
  const [saleCustomers, setSaleCustomers] = useState([]);
  const [error, setError] = useState(null);
  const pageSize = 5; // Set the number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  async function fetchCustomers() {
    try {
      const fetchedCustomers = await CustomerServices.getList();
      setSaleCustomers(fetchedCustomers);
    } catch (err) {
      setError(err);
    }
  }

  // // Function to handle item deletion
  // const handleDelete = async (itemId) => {
  //   try {
  //     await CustomerServices.delete(itemId);
  //     alert("Do you want to delete CustomerList");

  //     setSaleCustomers((prevData) =>
  //       prevData.filter((item) => item.id !== itemId)
  //     );
  //   } catch (error) {
  //     console.error("Error deleting item:", error);
  //   }
  // };

  
  const handleDelete = async (productId) => {
    try {
      if (window.confirm("Do you really want to delete customer?")) {
        const deletedProduct = await CustomerServices.delete(productId);
        console.log(
          `Product deleted successfully: ${JSON.stringify(deletedProduct)}`
        );
        setSaleCustomers((prevProductList) =>
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

  const paginatedSaleCustomers = saleCustomers.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb title="Customer List" pageTitle="Customer " />
        <Container fluid>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <CreateButton
                    to="/customers/create"
                    text=" + New Customer List"
                  />
                </CardHeader>
                <CardBody>
                  <div className="table-responsive table-card mt-3 mb-2">
                    <table className="table align-middle table-nowrap">
                      <thead className="table-light">
                        <tr>
                          <th className="sort">S.N</th>
                          <th className="sort">Name</th>
                          <th className="sort">Address</th>
                          <th className="sort">Phone.No</th>
                          <th className="sort">Opening Balance</th>
                          <th className="sort">Reg.No</th>
                          <th className="sort">Registered Date</th>
                          <th className="sort">Status</th>
                          <th className="sort">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedSaleCustomers.map((customer, index) => (
                          <tr key={customer.id}>
                            <td>{index + 1}</td>
                            <td className="name">{customer.name}</td>
                            <td className="address">{customer.address}</td>
                            <td className="text-end">{customer.telePhone_No}</td>
                            <td className="text-end">
                              <NumberWithCommas
                                number={customer.openingBalance}
                              />
                            </td>
                            <td className="date">
                              {customer.registration_No}
                            </td>
                            <td>
                              {customer.registered_Date
                                .split("T")[0]
                                .replace(/(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3")
                                .substring(0, 10)}
                            </td>
                            <td className="ststus">
                            <StatusLabel  text={customer.status ? 'Active' : 'InActive'} isTaxable={customer.status} />
                          {/* {customer.status ? "Active" : "Inactive"} */}
                          </td>
                            <td className="button">
                              <ButtonGroup size="sm">
                                <div className="d-flex gap-1">
                                  <Link
                                    to={`/customers/details/${customer.id}`}
                                  >
                                    <Button
                                      color="btn btn-soft-success"
                                      className="btn-sm gap-1"
                                    >
                                      <i className="bx bx-show" />
                                    </Button>
                                  </Link>
                                  <Link to={`/customers/edit/${customer.id}`}>
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
                                    onClick={() => handleDelete(customer.id)}
                                  >
                                    <i className="ri-delete-bin-5-line" />
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
                    pagesCount={Math.ceil(saleCustomers.length / pageSize)}
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

export default SaleCustomersLists;
