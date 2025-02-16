import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import AuthServices from "../../services/DibyaServices/AuthServices/Auth.services";
import toast from "react-hot-toast";
import { Triangle } from "react-loader-spinner";
import { Button, Col, Input, Row } from "reactstrap";
import AdminRegistrationModal from "./components/AdminRegistrationModal";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";

const customStyles = {
  headCells: {
    style: {
      fontSize: "0.92rem", // Change the font size here
      fontWeight: 610, // Optionally change other styles
    },
  },
  rows: {
    style: {
      fontSize: "0.9rem", // Change the font size of rows here
      // You can also optionally add other row styles here
    },
  },
};

const AdminRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [adminList, setAdminList] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editValues, setEditValues] = useState();
  const [filterText, setFilterText] = useState("");

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const fetchAdminList = async () => {
    try {
      setLoading(true);
      const response = await AuthServices.getAdminList();
      setAdminList(response);
      setLoading(false);
    } catch (error) {
      console.log("🚀 ~ error:", error);
      toast.error(error.response?.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminList();
  }, []);

  const data = adminList
    ?.filter((admin) => {
      const searchText = filterText?.toLowerCase();
      return (
        admin.user.userName?.toLowerCase().includes(searchText) ||
        admin.user.email?.toLowerCase().includes(searchText)
      );
    })
    .map((item, index) => {
      return {
        ...item.user,
        role: item.roles[0],
        index: index + 1,
      };
    });

  const handleDelete = async (id) => {
    try {
      await AuthServices.deleteAdmin(id);
      const temp = adminList.filter((item) => item.id !== id);
      setAdminList(temp);
      toast.success("Admin Deleted Successfully!");
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error:", error);
    }
  };

  const columns = [
    {
      name: "S.N",
      selector: (row) => row.index,
      sortable: true,
      width: "75px",
    },

    {
      name: "User Name",
      selector: (row) => row.userName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },

    {
      name: "Address",
      selector: (row) => row.address,
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phoneNumber,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => {
        return (
          <div>
            <span
              title="View Admin Detail"
              className="cursor-pointer fs-5 me-3"
              onClick={() => {
                navigate(`/admin/view/${row.id}`);
              }}
            >
              {/* <Link to={`/shipmentdetail/${row?.id}`}> */}
              <i className="bx bx-show text-success" />
              {/* </Link> */}
            </span>
            <span
              title="Edit Admin"
              className="cursor-pointer fs-5 me-3"
              onClick={() => {
                setIsEdit(true);
                setEditValues(row);
                toggleModal();
              }}
            >
              {/* <Link to={`/shipmentdetail/${row?.id}`}> */}
              <i class="bx bx-edit-alt text-primary"></i>
              {/* </Link> */}
            </span>
            {/* <span
              title="Delete Admin"
              className="cursor-pointer fs-5 me-3"
              onClick={() => {
                handleDelete(row.id);
              }}
            >
              <Link to={`/shipmentdetail/${row?.id}`}>
              <i class="bx bx-trash text-danger"></i>
              </Link>
            </span> */}
          </div>
        );
      },
    },
  ];

  return (
    <div className="page-content">
      <div class="container-fluid">
        <BreadCrumb
          title="User List"
          pageTitle="User "
          breadcrumbItems={[
            {
              title: (
                <Button className="btn btn-soft-success" onClick={toggleModal}>
                  + Add New Admin
                </Button>
              ),
              // link: "/category/add",
            },
          ]}
        />
      </div>

      <Row>
        <div className="d-flex pb-2 gap-1">
          <Col lg={4}>
            <Input
              type="text"
              name={filterText}
              onChange={handleFilter}
              placeholder="Filter by Name or Email"
            />
          </Col>
        </div>
      </Row>
      {/* <Row className="mb-2">
        <Col className="text-end">
          <Button color="success" onClick={toggleModal}>
            <span className="me-2">
              <i class="bx bx-plus"></i>
            </span>
            Add New Admin
          </Button>
        </Col>
      </Row> */}

      <Row>
        <DataTable
          responsive
          striped
          pagination
          fixedHeader
          persistTableHead
          progressPending={loading}
          customStyles={customStyles}
          onRowClicked={(row) => {
            //   navigate(`/manifest-detail/${row.id}`);
          }}
          // paginationServer
          // paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
          // paginationTotalRows={50}
          // onChangeRowsPerPage={handlePerRowsChange}
          // onChangePage={handlePageChange}
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
          columns={columns}
          data={data}
        />
      </Row>
      <AdminRegistrationModal
        adminLoading={adminLoading}
        isOpen={isOpen}
        toggleModal={toggleModal}
        editValues={editValues}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        fetchAdminList={fetchAdminList}
      />
    </div>
  );
};

export default AdminRegistration;
