import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from "reactstrap";
import { useNavigate, Link } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import JournalVouchersService from "../../../services/AccountingServices/VouchersServices";
import TablePagination from "../Starter/Pagination";
import NumberWithCommas from "../Starter/NumberWithCommas";
import CreateButton from "../Starter/CreateButton";

function JournalVouchersList() {
  const navigate = useNavigate();
  const [vouchersList, setVouchersList] = useState([]);
  const [error, setError] = useState(null);
  const pageSize = 5; // Set the number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  async function fetchVouchers() {
    try {
      const fetchedVouchers = await JournalVouchersService.getList();
      setVouchersList(fetchedVouchers);
    } catch (err) {
      setError(err);
    }
  }

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleDelete = async (productId) => {
    try {
      if (window.confirm("Do you really want to delete JournalVouchers?")) {
        const deletedProduct = await  JournalVouchersService.delete(productId);
        console.log(
          `Product deleted successfully: ${JSON.stringify(deletedProduct)}`
        );
        setMyDatalist((prevProductList) =>
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

  const handlePreviousClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    const maxPage = Math.ceil(vouchersList.length / pageSize);
    if (currentPage < maxPage - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <BreadCrumb
          title="Journal Vouchers List"
          pageTitle="Journal Vouchers"
        />
        <Container fluid>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <CreateButton
                    to="/journal-vouchers/create"
                    text="+ Create New Voucher"
                  />
                </CardHeader>
                <CardBody>
                  <div className="table-responsive table-card mt-3 mb-1">
                    <table className="table align-middle table-nowrap">
                      <thead className="table-light">
                        <tr>
                          <td className="sort">S.N</td>
                          <td className="sort">Voucher No</td>
                          <td className="sort">Voucher Type</td>
                          <td className="sort">Total Credit</td>
                          <td className="sort">Total Debit</td>
                          <td className="sort">Value Date</td>
                          <td className="sort">Remarks</td>
                          <td className="sort">Actions</td>
                        </tr>
                      </thead>
                      <tbody>
                        {vouchersList
                          .slice(
                            currentPage * pageSize,
                            (currentPage + 1) * pageSize
                          )
                          .map((voucher, index) => (
                            <tr key={voucher.voucherNo}>
                              <td>{index + 1}</td>
                              <td>
                                <Link
                                  to={`/journal-vouchers/details/${voucher.voucherNo}`}
                                >
                                  {voucher.voucherNo}
                                </Link>
                              </td>
                              <td>{voucher.voucherType}</td>
                              <td className="text-end">
                                <NumberWithCommas
                                  number={voucher.totalCredit}
                                />
                              </td>
                              <td className="text-end">
                                <NumberWithCommas number={voucher.totalDebit} />
                              </td>
                              <td>
                                {voucher.valueDate
                                  .split("T")[0]
                                  .replace(
                                    /(\d{4})-(\d{2})-(\d{2})/,
                                    "$1-$2-$3"
                                  )
                                  .substring(0, 10)}
                              </td>
                              <td>{voucher.remarks}</td>
                              <td>
                                <ButtonGroup size="sm">
                                  <div className="d-flex gap-1">
                                    <Link
                                      to={`/journal-vouchers/details/${voucher.voucherNo}`}
                                      state={{ voucher }}
                                    >
                                      <Button
                                        color="btn btn-soft-success"
                                        className="btn-sm gap-1"
                                      >
                                        <i className="bx bx-show" />
                                      </Button>
                                    </Link>
                                    <Link
                                      to={`/journal-vouchers/edit/${voucher.voucherNo}`}
                                      state={{ voucher }}
                                    >
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
                                      onClick={() =>
                                        handleDelete(voucher.voucherNo)
                                      }
                                    >
                                      <i className="ri-delete-bin-2-line"></i>
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
                    pagesCount={Math.ceil(vouchersList.length / pageSize)}
                    currentPage={currentPage}
                    handlePageClick={handlePageClick}
                    handlePreviousClick={handlePreviousClick}
                    handleNextClick={handleNextClick}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default JournalVouchersList;
