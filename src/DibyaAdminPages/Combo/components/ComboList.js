import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import StatusLabel from "../../../Components/sebscommon/StatusLabel";
import { Container, Button, ButtonGroup, Input, Row, Col } from "reactstrap";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import ComboServices from "../../../services/DibyaServices/ComboServices/ComboServices";

const ComboList = () => {
  const [comboList, setcomboList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
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
    const fetchRateCard = async () => {
      try {
        const fetchedServices = await ComboServices.comboList();
        const temp = fetchedServices.map((item, index) => {
          return {
            ...item,
            index: index + 1,
          };
        });
        setcomboList(temp);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchRateCard();
  }, []);

  const handleDelete = async (serviceId) => {
    try {
      if (window.confirm("Do you really want to delete this Combo?")) {
        await ComboServices.deletecombo(serviceId);
        setcomboList((prevserviceList) =>
          prevserviceList.filter((service) => service.id !== serviceId)
        );
        toast.success("Combo Deleted Successfully", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error deleting Combo:", error);
      toast.error("Failed to delete Combo");
    }
  };

  const columns = [
    {
      name: "S.N",
      selector: (row) => row.index,
      sortable: true,
      width: "70px",
    },
    {
      name: "Image",
      cell: (row) => (
        <img
          src={`data:image/jpeg;base64, ${row.image}`}
          alt="Image"
          style={{ width: "100px", height: "auto" }}
        />
      ),
      sortable: true,
      width: "200px",
    },
    {
      name: "Combo",
      selector: (row) => row.name,
      width: "200px",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      grow: 2,
      width: "200px",
    },
    {
      name: "Price",
      selector: (row) => row.comboPrice.toLocaleString(),
      sortable: true,
      grow: 2,
      right: true,
      width: "150px",
    },
    {
      name: "Action",
      cell: (row) => row.action,
      width: "100px",
    },
  ];

  const filteredData = comboList
    .filter((service) => {
      const searchText = filterText.toLowerCase();
      return (
        service.name.toLowerCase().includes(searchText) ||
        service.description.toLowerCase().includes(searchText)
      );
    })
    .map((service, index) => {
      return {
        index: index + 1,
        image: service.image,
        name: service.name,
        description: service.description,
        comboPrice: service.comboPrice,
        action: (
          <td className="button">
            <ButtonGroup size="sm">
              <Link to={`/combo/edit/${service.id}`}>
                <Button
                  color="btn btn-soft-warning"
                  className="btn-sm gap-1 ms-1"
                  size="sm"
                >
                  <i className="ri-edit-line" />
                </Button>
              </Link>
              <Button
                className="btn btn-soft-danger btn-sm gap-1 ms-1"
                color="danger"
                onClick={() => handleDelete(service.id)}
                size="sm"
              >
                <i className="ri-delete-bin-5-line" />
              </Button>
            </ButtonGroup>
          </td>
        ),
      };
    });

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="Combo List"
          pageTitle="Combo "
          breadcrumbItems={[
            {
              title: (
                <Button className="btn btn-soft-success">+ New Combo</Button>
              ),
              link: "/combo/add",
            },
          ]}
        />

        <Row>
          <div className="d-flex pb-2 gap-1">
            <Col lg={4}>
              <Input
                type="text"
                value={filterText}
                onChange={handleFilter}
                placeholder="Filter by Name or Description"
              />
            </Col>
          </div>
        </Row>

        <DataTable
          responsive
          striped
          pagination
          fixedHeader
          paginationResetDefaultPage={resetPaginationToggle}
          persistTableHead
          highlightOnHover
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
          data={filteredData}
        />
      </div>
    </Container>
  );
};

export default ComboList;
