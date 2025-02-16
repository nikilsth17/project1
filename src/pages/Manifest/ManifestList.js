import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterComponent from "./components/FilterComponent";
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";
import ManifestServices from "../../services/ManifestServices/ManifestServices";
import { Row, Label, Col, Input, FormGroup, Button } from "reactstrap";
import { create } from "lodash";

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

const ManifestList = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [manifestList, setManifestList] = useState();
  const [createdDate, setCreatedDate] = useState();

  // Event handler for changing the current page
  const handlePageChange = (pageNumber) => {
    setFilters((prev) => {
      return {
        ...prev,
        pageNumber: pageNumber,
      };
    });
    fetchShipmentDetails({ ...filters, pageNumber: pageNumber });
  };
  const data = manifestList?.map((item, index) => {
    return {
      ...item,
      index: index + 1,
    };
  });

  const handlePerRowsChange = async (newPerPage, page) => {
    fetchShipmentDetails({
      ...filters,
      pageNumber: page,
      pageSize: newPerPage,
    });
    setFilters((prev) => {
      return {
        ...prev,
        pageSize: newPerPage,
      };
    });
  };

  const columns = [
    {
      name: "S.N",
      selector: (row) => row.index,
      sortable: true,
      width: "75px",
    },

    {
      name: "Manifest Number",
      selector: (row) => row.manifestId,
      sortable: true,
    },
    {
      name: "Created Date",
      selector: (row) => new Date(row.createdDate).toLocaleString(),
      sortable: true,
    },

    {
      name: "Admin",
      selector: (row) => row.createdBy,
      sortable: true,
    },
    {
      name: "IP Address",
      selector: (row) => row.ipAddress,
      sortable: true,
    },
    {
      name: "Depot",
      selector: (row) => row.depot,
      // grow: 1.5,
      sortable: true,
    },

    {
      name: "Action",
      selector: (row) => {
        return (
          <div>
            <span
              title="View Manifest Details"
              className="cursor-pointer fs-5 me-2"
              onClick={() => {
                navigate(`/manifest-detail/${row?.id}`, "_blank");
              }}
            >
              {/* <Link to={`/shipmentdetail/${row?.id}`}> */}
              <i className="bx bx-show text-primary" />
              {/* </Link> */}
            </span>
            <span
              title="View Manifest Documents"
              className="cursor-pointer fs-5"
              onClick={() => {
                window.open(`/manifest-docs-viewer/${row?.id}`, "_blank");
                // navigate(`/manifest-docs-viewer/${row?.id}`, "_blank");
              }}
            >
              {/* <Link to={`/shipmentdetail/${row?.id}`}> */}
              <i class="bx bx-file text-success"></i>
              {/* </Link> */}
            </span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await ManifestServices.getManifestList({
          Date: createdDate,
        });
        setManifestList(response);
        setLoading(false);
      } catch (error) {
        console.log("🚀 ~ error:", error);
        setLoading(false);
      }
    })();
  }, [createdDate]);

  return (
    <div className="page-content">
      {/* <FilterComponent /> */}
      <Row className="pb-1">
        <Col xs={4}>
          <FormGroup>
            <Label>Date:</Label>
            <Input
              type="date"
              value={createdDate}
              onChange={(e) => {
                setCreatedDate(e.target.value);
              }}
            />
          </FormGroup>
        </Col>
        {/* <Col>
          <Button
            onClick={() => {
              setCreatedDate("");
            }}
          >
            Clear Date
          </Button>
        </Col> */}
      </Row>

      <DataTable
        responsive
        striped
        pagination
        fixedHeader
        persistTableHead
        progressPending={loading}
        customStyles={customStyles}
        onRowClicked={(row) => {
          navigate(`/manifest-detail/${row.id}`);
        }}
        // paginationServer
        paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
        paginationTotalRows={50}
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
    </div>
  );
};

export default ManifestList;
