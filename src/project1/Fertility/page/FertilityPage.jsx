import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Input,
  InputGroup,
  UncontrolledTooltip,
  Row,
} from "reactstrap";
import * as XLSX from "xlsx";
import { Triangle } from "react-loader-spinner";
import { Link, useNavigate, useParams } from "react-router-dom";
import CustomerServices from "../../../services/CustomerServices/CustomerServices";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UpdatedPagination from "../../../Components/Common/UpdatedPagination";
import DataTable from "react-data-table-component";
import DeleteModal from "../../../Components/Common/DeleteModal";
import UserPage from "../../User/component/UserPage";
import useIsSmallScreen from "../../../CosmosAdminPages/Payment Type/Component/small screen/SmallScreen";
import FertilityForm from "../component/FertilityForm";

const customStyles = {
  headCells: {
    style: {
      fontSize: "0.92rem",
      fontWeight: 610,
    },
  },
  rows: {
    style: {
      fontSize: "0.9rem",
    },
  },
};

const FertilityPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  // console.log("🚀 ~ Calender ~ user:", user);
  const driverId = user?.user?.id;
  // console.log("🚀 ~ Calender ~ driverId:", driverId);
  const userType = user?.user?.user_type;

  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [modal, setModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  // console.log("editingData", editingData);

  const [dataList, setDataList] = useState([]);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);
  // console.log("🚀 ~ CustomerList ~ selectedDeleteItem:", selectedDeleteItem);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [driverData, setDriverData] = useState([]);
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedDetail, setSelectedDetail] = useState([]);

  const handleDelete = async () => {
    if (selectedDeleteItem) {
      // console.log(
      //   "🚀 ~ handleDelete ~ selectedDeleteItem:",
      //   selectedDeleteItem
      // );
      try {
        await CustomerServices.delete(selectedDeleteItem);
        setDataList((prevList) =>
          prevList.filter((pkg) => pkg.id !== selectedDeleteItem)
        );
        toast.success("Selected customer deleted successfully");
      } catch (error) {
        toast.error("Failed to delete the record");
      } finally {
        toggleDeleteModal();
        setSelectedDeleteItem(null);
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };

  const filteredPackages = dataList.filter((pkg) => {
    // console.log("🚀 ~ filteredPackages ~ pkg:", pkg);

    // Combine name, surname, email, and phone number into a single search context, handling undefined fields
    const searchContext = `${pkg?.first_name || ""} ${pkg?.last_name || ""} ${
      pkg?.email || ""
    } ${pkg?.phone_no || ""} ${pkg?.email}`.toLowerCase();

    // Check if the filterText is included in any of the search context
    const matchesFilter = searchContext.includes(filterText.toLowerCase());

    return matchesFilter;
  });

  async function fetchData() {
    setLoading(true);
    try {
      let response;

      // response = await CustomerServices.getList();

      setDataList(data);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const handleDeleteClick = (item) => {
    setSelectedDeleteItem(item);
    toggleDeleteModal();
  };

  const columns = [
    {
      name: "S.N",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "75px",
    },
    {
      name: (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          Name
        </div>
      ),
      selector: (row) => (
        <div>
          {row.first_name} {row.last_name}
        </div>
      ),
      sortable: true,
      wrap: true,
    },
    {
      name: "Sex",
      selector: (row) => row.email,
      sortable: true,
      wrap: true,
    },
    {
      name: "Fertility Date",
      selector: (row) => row.email,
      sortable: true,
      wrap: true,
    },
    {
      name: (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          Report Date
        </div>
      ),
      selector: (row) => row.phone_no,
      sortable: true,
      wrap: true,
    },
    {
      name: (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          Municipality
        </div>
      ),
      selector: (row) => row.user_role,
      sortable: true,
      wrap: true,
    },
    {
      name: (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          Sub Administrative
        </div>
      ),
      selector: (row) => row.administrative_unit,
      sortable: true,
      wrap: true,
    },

    {
      name: "Action",
      selector: (row) => (
        <ButtonGroup className="gap-1">
          <Button
            color="warning"
            className="rounded-circle btn-sm"
            onClick={() => {
              setModal(true);
              setEditingData(row);
            }}
          >
            <i className="bx bx-edit"></i>
          </Button>
          <Button
            color="danger"
            className="rounded-circle btn-sm "
            onClick={() => handleDeleteClick(row.id)} // Wrap the function call in an arrow function
          >
            <i className="bx bx-trash" />
          </Button>
        </ButtonGroup>
      ),
      center: true,
      width: "20%",
    },
  ];

  // Pagination logic for small screens
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredPackages.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const toggleModal = () => {
    setModal(!modal);
    setEditingData(null); // Clear editing state when closing
  };
  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="Fertility List" pageTitle="Fertility" />
      </div>
      <Row className="">
        <Col md={5} className="mb-2">
          <InputGroup>
            <Input
              placeholder="Search by name, email and phone number"
              value={filterText}
              onChange={handleFilterChange}
            />
          </InputGroup>
        </Col>

        <Col
          md={7}
          xs={12}
          className="d-flex justify-content-end align-items-end mb-2"
        >
          <Button className="package-button px-1 px-sm-2" onClick={toggleModal}>
            Add Fertility
          </Button>
        </Col>
        {/* // )} */}
      </Row>

      {isSmallScreen ? (
        loading ? (
          <div className="d-flex justify-content-center my-3">
            <Triangle
              visible={true}
              height="80"
              width="80"
              color="#5B71B9"
              ariaLabel="triangle-loading"
            />
          </div>
        ) : (
          <>
            <Row>
              {currentItems.map((item, index) => (
                <Col md={12} key={index} className="mb-1 smallScreen">
                  <Card>
                    <CardBody>
                      <CardTitle tag="h5">
                        <strong>Name: </strong>
                        {item.first_name} {item.last_name}
                      </CardTitle>

                      <CardText>
                        <strong>Sex: </strong> {item.email}
                      </CardText>

                      <CardText>
                        <strong>Fertility Date: </strong> {item.phone_no}
                      </CardText>
                      <CardText>
                        <strong>Report Date: </strong> {item.user_role}
                      </CardText>
                      <CardText>
                        <strong>Municipality: </strong>{" "}
                        {item.administrative_unit}
                      </CardText>
                      <CardText>
                        <strong>Sub Administrative: </strong>{" "}
                        {item.administrative_unit}
                      </CardText>
                      <div className="d-flex gap-2 justify-content-end">
                        <Button
                          color="warning"
                          className="rounded-circle btn-sm"
                          onClick={() => {
                            setModal(true);
                            setEditingData(item);
                          }}
                        >
                          <i className="bx bx-edit"></i>
                        </Button>
                        <Button
                          color="danger"
                          className="rounded-circle btn-sm"
                          onClick={() => handleDeleteClick(item.id)}
                        >
                          <i className="bx bx-trash" />
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
            <UpdatedPagination
              data={filteredPackages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              perPageData={rowsPerPage}
              className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0"
            />
          </>
        )
      ) : (
        <DataTable
          responsive
          striped
          pagination
          fixedHeader
          persistTableHead
          progressPending={loading}
          columns={columns}
          data={filteredPackages}
          customStyles={customStyles}
          progressComponent={
            <div className="my-3">
              <Triangle
                visible={true}
                height="80"
                width="80"
                color="#5B71B9"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
              <h5 className="mt-1">Loading...</h5>
            </div>
          }
        />
      )}

      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={toggleDeleteModal}
        selectedItem={selectedDeleteItem} // Pass the selected item
      />
      {/* <AddCustomer
        modal={addModal}
        toggleModal={() => {
          setAddModal(false);
          setEditingData(null); // Clear editing state when closing
        }}
        setDataList={setDataList}
        dataList={dataList}
        editingData={editingData}
        fetchData={fetchData}
      /> */}

      <FertilityForm
        modal={modal}
        toggleModal={toggleModal}
        setDataList={setDataList}
        dataList={dataList}
        fetchData={fetchData}
        editingUser={editingData}
        setEditingUser={setEditingData}
      />
    </div>
  );
};

export default FertilityPage;
