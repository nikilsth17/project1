import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Container, Row, Col, Button, Input, ButtonGroup } from "reactstrap";
import StatusLabel from "../../Components/sebscommon/StatusLabel";
import toast from "react-hot-toast";
import InstructionServices from "../../services/AustServices/InstructionService/InstructionServices";
import { Triangle } from "react-loader-spinner";
import DataTable from "react-data-table-component";

const InstructionList = () => {
  const navigate = useNavigate();
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(false);
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

  async function fetchInstructions() {
    try {
      setLoading(true);
      const response = await InstructionServices.getList();
      setInstructions(response);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setLoading(false);
    }
  }

  const handleDelete = async (instructionId) => {
    try {
      if (window.confirm("Do you really want to delete this Instruction?")) {
        await InstructionServices.delete(instructionId);
        setInstructions((prevInstructionList) =>
          prevInstructionList.filter(
            (instruction) => instruction.id !== instructionId
          )
        );
        toast.success("Instruction Deleted Successfully", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error deleting Instruction:", error);
      toast.error("Failed to delete Instruction");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInstructions();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const breadcrumbItems = [
    {
      title: (
        <Button className="btn btn-soft-success">+ New Instruction</Button>
      ),
      link: "/Instruction/create",
    },
  ];

  const columns = [
    {
      name: "S.N",
      selector: (row) => row.index,
      sortable: true,
      width: "70px",
    },
    { name: "Instruction", selector: (row) => row.title, width: "280px" },
    { name: "Description", selector: (row) => row.description, width: "280px" },

    {
      name: "Status",
      selector: (row) => (
        <StatusLabel
          text={row.isPickUp ? "Pick up" : "Delivery"}
          isTaxable={row.isPickUp}
        />
      ),
      width: "280px",
    },
    {
      name: "Action",
      selector: (row) => {
        console.log("🚀 ~ InstructionList ~ row:", row);
        return (
          <ButtonGroup size="sm">
            <div className="d-flex gap-1">
              <Link to={`/Instruction/edit/${row.id}`}>
                <Button color="btn btn-soft-warning" className="btn-sm gap-1">
                  <i className="ri-edit-line" />
                </Button>
              </Link>
              <Button
                className="btn btn-soft-danger btn-sm gap-1"
                color="danger"
                onClick={() => handleDelete(row.id)}
              >
                <i className="ri-delete-bin-5-line" />
              </Button>
            </div>
          </ButtonGroup>
        );
      },
      width: "200px",
    },
  ];

  const data = instructions
    ?.filter((item) => {
      const searchText = filterText.toLowerCase();
      return (
        item.title.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText)
      );
    })
    .map((item, index) => ({
      id: item.id,
      index: index + 1,
      title: item.title,
      description: item.description,
      isPickUp: item.isPickUp,
    }));

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  // const handleClearFilter = () => {
  //   setFilterText("");
  // };

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="Instruction List"
          pageTitle="Instruction"
          breadcrumbItems={breadcrumbItems}
        />

        <Row>
          <div className="d-flex pb-2 gap-1">
            <Col lg={4}>
              <Input
                type="text"
                value={filterText}
                onChange={handleFilter}
                placeholder="Filter by Instruction or Description"
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

        <DataTable
          responsive
          striped
          pagination
          fixedHeader
          persistTableHead
          paginationPerPage={50}
          paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
          highlightOnHover
          pointerOnHover
          customStyles={customStyles}
          progressPending={loading}
          paginationResetDefaultPage={resetPaginationToggle}
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
    </Container>
  );
};

export default InstructionList;
