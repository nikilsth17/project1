import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Input, Row, Col, Button } from "reactstrap";
import CustomerAust from "../../services/AustServices/Customeraust/CustomerAust";
import { Triangle } from "react-loader-spinner";
import toast from "react-hot-toast";
import DataTable from "react-data-table-component";

const CuVerify = () => {
  const [loading, setLoading] = useState(true);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const [filterText, setFilterText] = useState("");
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

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await CustomerAust.getList();
        const fetchedCustomers = response.data;
        const customersToVerify = fetchedCustomers.filter(
          (customer) => customer.quickBookId
        );
        setFilteredCustomers(customersToVerify);
        console.log(
          "🚀 ~ fetchCustomers ~ customersToVerify:",
          customersToVerify
        );
        setLoading(false);
      } catch (err) {
        console.error("Error fetching customers:", err);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleDelete = async (customerId) => {
    try {
      if (window.confirm("Do you really want to delete Customer?")) {
        await CustomerAust.delete(customerId);
        setFilteredCustomers((prevCustomerList) =>
          prevCustomerList.filter((customer) => customer.id !== customerId)
        );
        toast.success("Customer Deleted Successfully", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error deleting Customer:", error);
    }
  };

  const columns = [
    { name: "S.N", selector: (row) => row.id, sortable: true, width: "70px" },
    {
      name: "Name",
      selector: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
      grow: 2,
    },
    {
      name: "Phone number",
      selector: (row) => row.phoneNumber,
    },
    {
      name: "Email address",
      selector: (row) => row.emailAddress,
      sortable: true,
      grow: 2,
    },
    {
      name: "Status",
      cell: (row) => <span className="badge bg-success">Verified</span>,
    },
    {
      name: "Actions",
      cell: (row) => row.action,
    },
  ];
  const data = filteredCustomers
    ?.filter((customer) => {
      const searchText = filterText.toLowerCase();
      return (
        (customer.name && customer.name.toLowerCase().includes(searchText)) ||
        (customer.firstName &&
          customer.lastName &&
          `${customer.firstName} ${customer.lastName}`
            .toLowerCase()
            .includes(searchText)) ||
        (customer.phoneNumber &&
          customer.phoneNumber.toLowerCase().includes(searchText)) ||
        (customer.emailAddress &&
          customer.emailAddress.toLowerCase().includes(searchText))
      );
    })
    .map((customer, index) => ({
      id: index + 1,
      firstName: customer.firstName,
      lastName: customer.lastName,

      phoneNumber: customer.phoneNumber,
      emailAddress: customer.emailAddress,

      status: <span className="badge bg-success">Verified</span>,
      action: (
        <div>
          <Link
            to={`/CustomerAUS/details/${customer.id}`}
            className="text-success"
          >
            <i className="bx bx-show fs-5"></i>
          </Link>
          <Link
            to={`/CustomerAUS/edit/${customer.id}`}
            className="text-warning ms-1"
          >
            <i className="ri-edit-line fs-5"></i>
          </Link>{" "}
          <Link
            onClick={() => handleDelete(customer.id)}
            className="text-danger ms-1"
          >
            <i className="ri-delete-bin-2-line fs-5"></i>
          </Link>{" "}
        </div>
      ),
    }));

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  // const handleClearFilter = () => {
  //   setFilterText("");
  // };

  return (
    <div className="pt-4">
      <DataTable
        responsive
        striped
        pagination
        // paginationPerPage={50}
        fixedHeader
        paginationResetDefaultPage={resetPaginationToggle}
        persistTableHead
        highlightOnHover
        paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
        pointerOnHover
        customStyles={customStyles}
        progressPending={loading}
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
        subHeader
        subHeaderComponent={
          <Row>
            <div className="d-flex justify-content-start gap-1">
              <Col lg={12}>
                <Input
                  type="text"
                  value={filterText}
                  onChange={handleFilter}
                  placeholder="Filter by Name, Phone no & Email"
                />
              </Col>
              {/* <Col lg={2}>
                <Button
                  color="btn btn-soft-primary"
                  className="btn-md gap-1"
                  size="md"
                  onClick={handleClearFilter}
                >
                  Search
                </Button>
              </Col> */}
            </div>
          </Row>
        }
        subHeaderAlign={{ align: "left", rows: "top" }}
      />
    </div>
  );
};

export default CuVerify;
