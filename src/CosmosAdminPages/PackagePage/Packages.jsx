import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Input,
  Row,
  Col,
  InputGroup,
  ButtonGroup,
  Label,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
import PackageService from "../../services/PackageServices/PackageService";
import CustomDataTable from "../../Components/CustomTable/CustomTable";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Link } from "react-router-dom";
import EditPackage from "./Component/EditPackage";
import useIsSmallScreen from "../Payment Type/Component/small screen/SmallScreen";
import DeleteModal from "../../Components/Common/DeleteModal";
import toast from "react-hot-toast";
import AddPackage from "./Component/AddPackage";
import UpdatedPagination from "../../Components/Common/UpdatedPagination";

const Packages = ({ onFilter }) => {
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [modal, setModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  console.log("editingPackage", editingPackage);
  const [newPackage, setNewPackage] = useState({
    name: "",
    price: "",
    package_type: "",
    course_duration: "",
    session_duration: "",
    is_popular: false, // Ensure it’s initialized
    show_promotion: false, // Ensure it’s initialized
    promotion_text: "",
    details: [{ title: "", value: "" }],
    pickup_drop_text: "",
  });

  const [dataList, setDataList] = useState([]);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const isSmallScreen = useIsSmallScreen();

  const toggleModal = () => setModal(!modal);

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setNewPackage({ ...pkg }); // This will ensure that the modal has the correct data
    toggleModal();
  };

  const handleDelete = async () => {
    if (selectedDeleteItem) {
      try {
        await PackageService.delete(selectedDeleteItem.id);
        setDataList((prevList) =>
          prevList.filter((pkg) => pkg.id !== selectedDeleteItem.id)
        );
        toast.success("Selected Package deleted successfully");
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

  const filteredPackages = dataList.filter((pkg) =>
    pkg.name.toLowerCase().includes(filterText.toLowerCase())
  );

  async function fetchPackages() {
    setLoading(true);
    try {
      const response = await PackageService.getList();
      if (Array.isArray(response.data)) {
        setDataList(response.data);
      } else {
        console.error("Expected an array but got:", response.data);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPackages();
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
      name: "Package Name",
      selector: (row) => (
        <Link to={`/package/detail/${row?.id}`}>{row?.name}</Link>
      ),
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => `$${row?.price || "N/A"}`,
      sortable: true,
    },
    {
      name: "Course Duration",
      selector: (row) => `${row?.course_duration || "N/A"} day`,
      sortable: true,
    },
    {
      name: "Session Duration",
      selector: (row) => `${row?.session_duration || "N/A"} hr`,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <ButtonGroup className="gap-3">
          <Button
            color="warning"
            className="rounded-circle btn-sm"
            onClick={() => handleEdit(row)}
          >
            <i className="bx bx-edit"></i>
          </Button>
          <Button
            color="rounded-circle btn btn-danger"
            className="rounded-circle btn-sm gap-1"
            onClick={() => handleDeleteClick(row)}
          >
            <i className="bx bx-trash"></i>
          </Button>
        </ButtonGroup>
      ),
      center: true,
    },
  ];

  // Pagination logic for small screens
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredPackages.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="Packages List" pageTitle="Packages" />
      </div>
      <Row className="">
        <Col md={5} xs={6} className="px-xs-1">
          <InputGroup>
            <Input
              placeholder="Search by package name"
              value={filterText}
              onChange={handleFilterChange}
            />
          </InputGroup>
        </Col>
        <Col
          md={7}
          xs={6}
          className="d-flex justify-content-end align-items-end mb-3"
        >
          <Button
            className="package-button px-1 px-sm-2"
            onClick={() => setAddModal(true)}
          >
            Add New Package
          </Button>
        </Col>
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
                        <strong>Package Name:</strong>
                        <Link to={`/package/detail/${item?.id}`}>
                          {item.name}
                        </Link>
                      </CardTitle>
                      <CardText>
                        <strong>Price:</strong> {item.price}
                      </CardText>
                      <CardText>
                        <strong>Course Duration:</strong> {item.course_duration} day
                      </CardText>
                      <CardText className="mb-2">
                        <strong>Session Duration:</strong>{" "}
                        {item.session_duration} hr
                      </CardText>
                      <div className="d-flex justify-content-end gap-2">
                        <Button
                          color="warning"
                          className="rounded-circle btn-sm"
                          onClick={() => handleEdit(item)}
                        >
                          <i className="bx bx-edit"></i>
                        </Button>
                        <Button
                          color="rounded-circle btn btn-danger"
                          className="rounded-circle btn-sm gap-1"
                          onClick={() => handleDeleteClick(item)}
                        >
                          <i className="bx bx-trash"></i>
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
        <CustomDataTable
          responsive
          striped
          pagination
          fixedHeader
          persistTableHead
          progressPending={loading}
          columns={columns}
          data={filteredPackages}
          customStyles={{
            headCells: {
              style: {
                fontSize: "0.93rem",
                fontWeight: 610,
              },
            },
            rows: {
              style: {
                fontSize: "0.9rem",
              },
            },
          }}
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
      <EditPackage
        modal={modal}
        toggleModal={toggleModal}
        newPackage={newPackage}
        setNewPackage={setNewPackage} // Pass state handler to update form
        setDataList={setDataList}
        dataList={dataList}
        setEditingPackage={setEditingPackage}
        editingPackage={editingPackage}
        // onSave={handleSave} // Handle save action
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={toggleDeleteModal}
        selectedItem={selectedDeleteItem} // Pass the selected item
      />
      <AddPackage
        modal={addModal}
        toggleModal={() => {
          setAddModal(false);
          setEditingPackage(null); // Clear editing state when closing
        }}
        setDataList={setDataList}
        dataList={dataList}
      />
    </div>
  );
};

export default Packages;
