import React, { useEffect, useState } from "react";
import { Button, Col, Input, InputGroup, Row } from "reactstrap";
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import CustomerServices from "../../services/DibyaServices/CustomerServices/Customer.services";

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

const Guestuser = () => {
  const [customerList, setCustomerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const navigate = useNavigate();

  const handleFilter = (event) => {
    setFilterText(event.target.value);
  };

  const columns = [
    {
      name: "S.N",
      selector: (row) => row.index,
      sortable: true,
      width: "75px",
    },
    {
      name: "Customer Name",
      selector: (row) => row.firstName || "",
      sortable: true,
      // width:"200px"
    },
    {
      name: "Email",
      selector: (row) => row.email || "Email not found",
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => row.address || "",
      sortable: true,
      // width:"250px"
    },
    {
      name: "Phone Number",
      selector: (row) => row.phoneNumber || "",
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <div>
          <span
            title="View Manifest Details"
            className="cursor-pointer fs-5 me-2"
            onClick={() => {
              navigate(`/guest-detail/${row?.id}`, "_blank");
            }}
          >
            <i className="bx bx-show text-primary" />
          </span>
        </div>
      ),
      center:true
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await CustomerServices.guestUserList();
        setCustomerList(response);
        setLoading(false);
      } catch (error) {
        toast.error(error?.response?.data);
        setLoading(false);
        console.log("Error:", error);
      }
    };

    fetchData();
  }, []);

  const filteredData = customerList.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );
  console.log("🚀 ~ Guestuser ~ Object:", Object);

  const data = filteredData.map((item, index) => ({
    ...item,
    index: index + 1,
  }));

  return (
    <div className="page-content">
      <div class="container-fluid">
        <BreadCrumb title="Guest User List" pageTitle="Guest User" />
      </div>
      <Row className="mb-2">
        <Col lg={5}>
          <InputGroup>
            <Input
              placeholder="Search by name, email, address, and phone number"
              value={filterText}
              onChange={handleFilter}
            />
          </InputGroup>
        </Col>
      </Row>
      <DataTable
        responsive
        striped
        pagination
        fixedHeader
        persistTableHead
        progressPending={loading}
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
        columns={columns}
        data={data}
      />
    </div>
  );
};

export default Guestuser;
