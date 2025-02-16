import React, { useEffect, useState } from "react";
import CustomDataTable from "../../../Components/CustomTable/CustomTable";
import { Button, ButtonGroup, Col, Row } from "reactstrap";
import { Triangle } from "react-loader-spinner";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import SuburbForm from "../Component/SuburbForm";
import SuburbService from "../../../services/SuburbServices/SuburbService";
import DeleteModal from "../../../Components/Common/DeleteModal";
import toast from "react-hot-toast";

const Suburb = () => {
  const [suburbData, setSuburbData] = useState([]);
  console.log("🚀 ~ Suburb ~ suburbData:", suburbData);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      name: "S.N",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Title",
      selector: (row) => row.name,
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) => (row.status === 1 ? "Active" : "Inactive"),
      sortable: true,
    },

    {
      name: "Actions",
      cell: (row) => (
        <ButtonGroup className="gap-2">
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
  true;
  const [selectedSuburb, setSelectedSuburb] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleEdit = (item) => {
    setSelectedSuburb(item);
    setIsModalOpen(true);
  };

  const fetchSuburb = async () => {
    try {
      const response = await SuburbService.getAll();
      console.log("🚀 ~ fetchSuburb ~ response:", response);
      setSuburbData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchSuburb();
  }, []);

  //==================== DELETE Functionality ===================================
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);
  const handleDeleteClick = (item) => {
    setSelectedDeleteItem(item);
    toggleDeleteModal();
  };

  const handleDelete = async () => {
    if (selectedDeleteItem) {
      try {
        await SuburbService.delete(selectedDeleteItem.id);
        setSuburbData((prevList) =>
          prevList.filter((pkg) => pkg.id !== selectedDeleteItem.id)
        );
        toast.success("Selected suburb successfully deleted.");
      } catch (error) {
        toast.error("Failed to delete the suburb");
      } finally {
        toggleDeleteModal();
        setSelectedDeleteItem(null);
      }
    }
  };

  // ==================================================================================

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="Suburb" pageTitle="Suburb List" />
      </div>
      <Row className="">
        <Col
          md={12}
          className="justify-content-end align-items-end alignn-content-end d-flex flex-column mb-2"
        >
          <Button
            className=""
            onClick={() => {
              setSelectedSuburb(null);
              setIsModalOpen(true);
            }}
          >
            + Add Suburb
          </Button>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <CustomDataTable
            responsive
            striped
            pagination
            fixedHeader
            persistTableHead
            progressPending={loading}
            columns={columns}
            data={suburbData || ""}
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
                />
                <h5 className="mt-1">Loading...</h5>
              </div>
            }
          />
        </Col>
      </Row>
      <SuburbForm
        isOpen={isModalOpen}
        toggle={() => {
          setIsModalOpen(false);
          setSelectedSuburb(null);
        }}
        suburbToEdit={selectedSuburb}
        setSuburbData={setSuburbData}
        suburbData={suburbData}
        fetchSuburb={fetchSuburb}
      />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={toggleDeleteModal}
        selectedItem={selectedDeleteItem} // Pass the selected item
      />
    </div>
  );
};

export default Suburb;
