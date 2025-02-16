import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import TablePagination from "../Pages/Starter/Pagination";
import ConfigureSetingServices from "../../services/AustServices/ConfigurationSettingSErvices/ConfigureSetingServices";

const ConfigureSettingGetList = () => {
    const [isSetting, setisSetting] = useState([]);
    const [error, setError] = useState(null);
    const pageSize = 5; // Set the number of items per page
    const [currentPage, setCurrentPage] = useState(0);
  
    async function fetchCustomers() {
      try {
        const fetchedCustomers = await ConfigureSetingServices.getList();
        setisSetting(fetchedCustomers);
        console.log(fetchedCustomers);
      } catch (err) {
        setError(err);
      }
    }
  
      // Handle page navigation
    const handlePageClick = (pageIndex) => {
      setCurrentPage(pageIndex);
    };
  
    const paginatedisSetting = isSetting.slice(
      currentPage * pageSize,
      (currentPage + 1) * pageSize
    );
  
    useEffect(() => {
      fetchCustomers();
    }, []);
  return (
    <Container fluid>
    <React.Fragment>
    <div className="page-content">
      <BreadCrumb title="Configure Setting List" pageTitle="Configure Setting " />
      <Container fluid>
        <Row>
          <Col>
            <Card>
              {/* <CardHeader>
           
  <CreateButton to="/Categories/create" text=" + New Category" />

              </CardHeader> */}
              <CardBody>
                <div className="table-responsive table-card mt-3 mb-2">
                  <table className="table align-middle table-nowrap">
                    <thead className="table-light">
                      <tr>
                        <th className="sort">S.N</th>
                        <th className="sort">Name</th>
                           <th className="sort">Description</th>
                           <th className="sort">Value</th>
                        <th className="sort">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedisSetting.map((customer, index) => (
                        <tr key={customer.id}>
                          <td>{index + 1}</td>
                          <td className="name">{customer.name}</td>
                          <td className="name">{customer.description}</td>
                          <td className="name">{customer.value}</td>
                       
                          <td className="button">
                            <ButtonGroup size="sm">
                              <div className="d-flex gap-1">
                                <Link
                                  to={`/Configure Setting/details/${customer.name}`}
                                >
                                  <Button
                                    color="btn btn-soft-success"
                                    className="btn-sm gap-1"
                                   // style={{ display: canViewDetail ? 'block' : 'none' }}
                                   
                                  >
                                    <i className="bx bx-show" />
                                  </Button>
                                </Link>
                                <Link to={`/Configure Setting/edit/${customer.name}`}>
                                  <Button
                                    color="btn btn-soft-warning"
                                    className="btn-sm gap-1"
                                    //style={{ display: canUpdate ? 'block' : 'none' }}
                                  >
                                    <i className="ri-edit-line" />
                                  </Button>
                                </Link>
                                {/* <Button
                                  className="btn btn-soft-danger btn-sm gap-1"
                                  color="danger"
                                  onClick={() => handleDelete(customer.id)}
                                 // style={{ display: canDelete ? 'block' : 'none' }}
                                >
                                  <i className="ri-delete-bin-5-line" />
                                </Button> */}
                              </div>
                            </ButtonGroup>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <TablePagination
                  pagesCount={Math.ceil(isSetting.length / pageSize)}
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
  </Container>
  )
}

export default ConfigureSettingGetList