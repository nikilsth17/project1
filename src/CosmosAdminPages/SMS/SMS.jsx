import React, { useEffect, useState } from "react";

import { Button, ButtonGroup, Col, Input, InputGroup, Row } from "reactstrap";
import { Triangle } from "react-loader-spinner";
import { Link } from "react-router-dom";
import CustomDataTable from "../../Components/CustomTable/CustomTable";
import SmsService from "../../services/SmsService/SmsService";
import EditSMS from "./Component/EditSMS";
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
const SMS = () => {
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const [smsData, setSmsData] = useState([]);
  console.log("🚀 ~ SMS ~ smsData:", smsData);
  const [selectedSMS, setSelectedSMS] = useState(null);
  const handleFilter = (event) => {
    const text = event.target.value;
    setFilterText(text);
    filterData(text);
  };
  const filterData = (text) => {
    const lowerCaseText = text.toLowerCase();
    const result = smsData?.filter((item) => {
      const name = `${item.description}`;
      return name.toLowerCase().includes(lowerCaseText);
    });
    setFilteredList(result);
  };
  async function fetchCustomer() {
    setLoading(true);
    try {
      const response = await SmsService.get();
      setSmsData(response.data);
      setFilteredList(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomer();
  }, []);

  const [modal, setModal] = useState(false);

  const toggleModal = () => setModal(!modal);

  const handleEdit = (row) => {
    setSelectedSMS(row);
    toggleModal();
  };

  const columns = [
    {
      name: "S.N",
      selector: (row, index) => index + 1,
      sortable: true,
      width: "75px",
    },
    {
      name: "Name",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Code",
      selector: (row) => row.code,
      sortable: true,
    },

    {
      name: "Action",
      selector: (row) => (
        <ButtonGroup className="gap-2">
          <Button
            color="rounded-circle btn btn-warning"
            className="rounded-circle btn-sm gap-1"
            onClick={() => handleEdit(row)}
          >
            <i className="bx bx-edit"></i>
          </Button>
        </ButtonGroup>
      ),
      center: true,
    },
  ];
  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="SMS Template List" pageTitle="SMS Template" />
      </div>
      <Row className="mb-2">
        <Col lg={5}>
          <InputGroup>
            <Input
              placeholder="Search by name"
              value={filterText}
              onChange={handleFilter}
            />
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
        data={filteredList}
      />

      <EditSMS modal={modal} toggleModal={toggleModal} data={selectedSMS} />
    </div>
  );
};

export default SMS;
