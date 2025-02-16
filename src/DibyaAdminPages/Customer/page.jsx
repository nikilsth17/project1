import React, { useEffect, useState } from "react";
import { Button, Col, Input, InputGroup, Row } from "reactstrap";
import DataTable, { createTheme } from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
import CustomerServices from "../../services/DibyaServices/CustomerServices/Customer.services";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CustomDataTable from "../../Components/CustomTable/CustomTable";
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

const Customers = () => {
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
      selector: (row) => `${row.firstName} ${row.lastName}`,
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
      selector: (row) => row.phoneNo,
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
              navigate(`/customers/${row?.id}`, "_blank");
            }}
          >
            <i className="bx bx-show text-primary" />
          </span>
        </div>
      ),
      center:true
    },
  ];

  const data = customerList
    .filter((item) => {
      const searchText = filterText.toLowerCase();
      return (
        item.firstName.toLowerCase().includes(searchText) ||
        item.lastName.toLowerCase().includes(searchText) ||
        item.email.toLowerCase().includes(searchText) ||
        item.address.toLowerCase().includes(searchText) ||
        item.phoneNo.toLowerCase().includes(searchText)
      );
    })
    .map((item, index) => ({
      ...item,
      index: index + 1,
    }));

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await CustomerServices.getCustomerList();
        setCustomerList(response);
        setLoading(false);
      } catch (error) {
        toast.error(error?.response?.data);
        setLoading(false);
        console.log("🚀 ~ error:", error);
      }
    })();
  }, []);

  return (
    <div className="page-content">

      <Row className="mb-2">
        <Col lg={5}>
          <InputGroup>
            <Input
              placeholder="Search by name, email, address, and phone number"
              value={filterText}
              onChange={handleFilter}
            />
            {/* <Button>Search</Button> */}
          </InputGroup>
        </Col>
      </Row>
      <CustomDataTable
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

export default Customers;
