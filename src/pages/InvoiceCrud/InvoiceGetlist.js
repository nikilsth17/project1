import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TablePagination from "../Pages/Starter/Pagination";
import InvoiceServices from "../../services/AustServices/InvoiceSev/InvoiceServices";
import toast from "react-hot-toast";
import { Triangle } from "react-loader-spinner";
const InvoiceGetlist = () => {
  const navigate = useNavigate();
  const [saleCustomers, setSaleCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const pageSize = 20; // Set the number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  async function fetchCustomers() {
    try {
      const fetchedCustomers = await InvoiceServices.getList();
      setSaleCustomers(fetchedCustomers);
      setLoading(false);
      console.log(fetchedCustomers);
    } catch (err) {
      setError(err);
    }
  }

  const handleDelete = async (productId) => {
    try {
      if (window.confirm("Do you really want to delete Invoice?")) {
        const deletedProduct = await InvoiceServices.delete(productId);
        console.log(
          `Invoice deleted successfully: ${JSON.stringify(deletedProduct)}`
        );
        setSaleCustomers((prevProductList) =>
          prevProductList.filter((product) => product.id !== productId)
        );
        toast.success("Invoice Deleted Successfully", { autoClose: 3000 });
      } else {
        // User canceled, do nothing or handle accordingly
      }
    } catch (error) {
      console.error("Error deleting Category:", error);
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
    // Simulate loading for 10 seconds
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 1000);

    return () => clearTimeout(timer); // Clean up the timer
  }, []);



  // const breadcrumbItems = [
  //   {
  //     title: <Button className="btn btn-soft-success">+ New Category</Button>,
  //     link: '/Categories/create',
  //   },
  // ];

  return (
    <Container fluid>
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb title="Invoice List" pageTitle="Invoice " />
          {loading ? ( // Show loading spinner if data is still loading
            <div className="d-flex justify-content-center align-items-center">
              <Triangle color="#007bff" height={50} width={50} />
            </div>
          ) : (
            <Container fluid>
              <Row>
                <Col>
                  {saleCustomers.length === 0 ? ( // Show message if there is no data
                    <p>No data available.</p>
                  ) : (
                    <Card>



                      <CardBody>

                        <div className="table-responsive table-card mb-0">
                          <table className="table align-middle table-nowrap">
                            <thead className="table-light">
                              <tr>
                                <th >S.N</th>
                                <th >Customer</th>
                                <th >Amount</th>
                                <th >Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedSaleCustomers.map((customer, index) => (
                                <tr key={customer.id}>
                                  <td>{index + 1}</td>
                                  <td className="name">{customer.customerName}</td>
                                  <td className="name">{customer.totalAmount}</td>
                                  {/* <td className="ststus">
                                <StatusLabel
                                  text={customer.status ? "Active" : "InActive"}
                                  isTaxable={customer.status}
                                />
                                {customer.status ? "Active" : "Inactive"}
                              </td> */}
                                  <td className="button">
                                    <ButtonGroup size="sm">
                                      <div className="d-flex gap-1">
                                        <Link
                                          to={`/Invoice/details/${customer.id}`}
                                        >
                                          <Button
                                            color="btn btn-soft-success"
                                            className="btn-sm gap-1"
                                          // style={{ display: canViewDetail ? 'block' : 'none' }}
                                          >
                                            <i className="bx bx-show" />
                                          </Button>
                                        </Link>
                                        <Link to={`/Invoice/edit/${customer.id}`}>
                                          <Button
                                            color="btn btn-soft-warning"
                                            className="btn-sm gap-1"
                                          //style={{ display: canUpdate ? 'block' : 'none' }}
                                          >
                                            <i className="ri-edit-line" />
                                          </Button>
                                        </Link>
                                        <Button
                                          className="btn btn-soft-danger btn-sm gap-1"
                                          color="danger"
                                          onClick={() => handleDelete(customer.id)}
                                        // style={{ display: canDelete ? 'block' : 'none' }}
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
                          className="card wrapped"
                        />

                      </CardBody>
                    </Card>
                  )}
                </Col>
              </Row>
            </Container>
          )}
        </div>
      </React.Fragment>
    </Container>
  )
}

export default InvoiceGetlist;
