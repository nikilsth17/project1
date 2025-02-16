import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Card,
} from "reactstrap";
import { Triangle } from "react-loader-spinner";
import toast from "react-hot-toast";
import DataTable from "react-data-table-component";
import ItemServices from "../../../services/DibyaServices/ItemServices/ItemServices";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useFormik } from "formik";
import { getLoggedInUser } from "../../../helpers/fakebackend_helper";
import Dropzone from "react-dropzone";
import axios from "axios";
const ItemList = () => {
  const navigate = useNavigate();
  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const [show, setShow] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [selectedItemId, setSelectedItemId] = useState("");

  const toggleModal = (itemId) => {
    console.log("🚀 ~ toggleModal ~ itemId:", itemId);
    setShow(true);
    setSelectedItemId(itemId);
  };
  const toggleModal1 = () => {
    setShow(false);
  };

  const authUser = getLoggedInUser();
  const isAuthenticated = useSelector((state) => state.Auth.isAuthenticated);
  const hasAdminRole = authUser?.user?.roles?.includes("SuperAdmin");

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

  async function fetchItemList() {
    try {
      const fetchedItem = await ItemServices.itemList();
      console.log("Fetched Item List:", fetchedItem);
      setItemList(fetchedItem);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching Item List:", err);
    }
  }

  const handleDelete = async (itemId) => {
    try {
      if (window.confirm("Do you really want to delete this item?")) {
        const deletedItem = await ItemServices.deleteItem(itemId);
        console.log("Item deleted successfully:", deletedItem);
        setItemList((prevItemList) =>
          prevItemList.filter((item) => item.id !== itemId)
        );
        toast.success("Item Deleted Successfully", { autoClose: 3000 });
      } else {
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    fetchItemList();
  }, []);

  const breadcrumbItems = [
    // {
    //   title: <Button className="btn btn-soft-success">+ New Item</Button>,
    //   link: "/item/add",
    // },

    // {
    //   title: <Button className="btn btn-soft-warning">+ Create Item</Button>,
    //   link: "/single-item/add",
    // },
    // {
    //   title: <Button className="btn btn-soft-danger">+ Create Package</Button>,
    //   link: "/addtopackage",
    // },
    ...(hasAdminRole ? [
      {
        title: <Button className="btn btn-soft-warning">+ Create Item</Button>,
        link: "/single-item/add",
      },
      {
        title: <Button className="btn btn-soft-danger">+ Create Package</Button>,
        link: "/addtopackage",
      }
    ] : [])
  ];

  const columns = [
    {
      name: "S.N",
      selector: (row) => row.sn,
      sortable: true,
      width: "75px",
    },
    {
      name: "Image",
      cell: (row) => (
        <Link onClick={() => toggleModal(row.id)}>
          <img
            src={`data:image/jpeg;base64, ${row.image}`}
            alt="Image"
            style={{ width: "100px", height: "auto" }}
          />
        </Link>
      ),
      sortable: true,
      // width: "150px",
    },
    {
      name: "Item",
      selector: (row) => row.name,
      sortable: true,
      width: "250px",
    },
    {
      name: "Category",
      selector: (row) => row.category || "No data available",
      sortable: true,
      width: "250px",
    },
    // {
    //   name: "Ingredients",
    //   selector: (row) => row.ingredients || "No data available",
    //   sortable: true,
    //   // width: "150px",
    // },
    {
      name: "Unit",
      selector: (row) => row.unit || "No data available",
      sortable: true,
      // width: "100px",
    },
    {
      name: "Price",
      selector: (row) =>
        row.price ? row.price.toLocaleString() : "No data available",
      //right: true,
      // width: "100px",
      sortable: true,
    },
    {
      name: "Bulk Price",
      selector: (row) =>
        row.bulkPrice ? row.bulkPrice.toLocaleString() : "No data available",
      //right: true,
      // width: "100px",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => row.action,
    },
  ];

  const data = itemList
    ?.filter((item) => {
      const searchText = filterText.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchText) ||
        (item.price && item.price.toString().toLowerCase().includes(searchText)) ||
        (item.category?.title && item.category.title.toLowerCase().includes(searchText))
      );
    })
    .map((item, index) => ({
      id: item.id,
      sn: index + 1,
      image: item.image,
      name: item.name,
      price: item.price,
      bulkPrice: item.bulkPrice,
      unit: item.unitName,
      category: item.category?.title,
      ingredients: item.ingredients,
      action: (
        <ButtonGroup size="sm">
          <Link to={`/items/${item.id}`}>
            <Button color="btn btn-soft-success" className="btn-sm gap-1">
              <i className="bx bx-show" />
            </Button>
          </Link>
          {hasAdminRole && (
          <>
            <Link to={`/items/edit/${item.id}`}>
              <Button color="btn btn-soft-warning" className="btn-sm gap-1 ms-1">
                <i className="ri-edit-line" />
              </Button>
            </Link>
            <Button
              className="btn btn-soft-danger btn-sm gap-1 ms-1"
              color="danger"
              onClick={() => handleDelete(item.id)}
            >
              <i className="ri-delete-bin-5-line" />
            </Button>
          </>
        )}
          {/* <Link to={`/items/edit/${item.id}`}>
            <Button color="btn btn-soft-warning" className="btn-sm gap-1 ms-1">
              <i className="ri-edit-line" />
            </Button>
          </Link>
          <Button
            className="btn btn-soft-danger btn-sm gap-1 ms-1"
            color="danger"
            onClick={() => handleDelete(item.id)}
          >
            <i className="ri-delete-bin-5-line" />
          </Button> */}
        </ButtonGroup>
      ),
    }));

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  const handleAcceptedFiles = (files) => {
    const formattedFiles = files.map((file) => ({
      name: file.name,
      path: file.path,
      preview: URL.createObjectURL(file),
    }));
    setSelectedFiles(formattedFiles);
    formik.setFieldValue("formfile", files[0]);
  };

  const handleFileRemove = (index) => {
    const files = [...selectedFiles];
    const removedFile = files.splice(index, 1)[0];
    setSelectedFiles(files);

    if (removedFile.name === formik.values.formfile) {
      formik.setFieldValue("formfile", "");
    }
    console.log("🚀 ~ handleFileRemove ~ formfile:", formfile);
  };
  console.log("🚀 ~ ItemList ~ selectedItemId:", selectedItemId);
  const token = localStorage.getItem("token");

  const formik = useFormik({
    initialValues: {
      formfile: "",
    },
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("id", selectedItemId);
        formData.append("formfile", values.formfile);

        const response = await axios.put(
          `/items/imageupdate/${selectedItemId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("🚀 ~ onSubmit: ~ response:", response);
        toast.success("Image Updated Successfully", {
          autoClose: 3000,
        });

        fetchItemList();

        setShow(false);
        navigate("/items");
      } catch (error) {
        console.log("🚀 ~ onSubmit: ~ error:", error);
      }
    },
  });

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="Item List"
          breadcrumbItems={breadcrumbItems}
          pageTitle="Items"
        />

        <Row>
          <div className="d-flex pb-2 gap-1">
            <Col lg={4}>
              <Input
                type="text"
                value={filterText}
                onChange={handleFilter}
                placeholder="Filter by Item Name, Price, Category"
              />
            </Col>
          </div>
        </Row>

        <DataTable
          responsive
          striped
          pagination
          fixedHeader
          highlightOnHover
          pointerOnHover
          persistTableHead
          progressPending={loading}
          customStyles={customStyles}
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

        <Modal isOpen={show} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal1}></ModalHeader>
          <ModalBody>
            <form onSubmit={formik.handleSubmit}>
              <input type="hidden" name="id" value={selectedItemId} />{" "}
              <Dropzone onDrop={handleAcceptedFiles}>
                {({ getRootProps, getInputProps }) => (
                  <div className="dropzone dz-clickable ">
                    <div
                      className="dz-message needsclick mb-2"
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <i className="align-item-center display-4 text-muted ri-upload-cloud-2-fill" />
                      <h4 className="fs-15 fw-semi-bold pt-3">
                        Drop files here or <Link to="#">click to upload.</Link>
                      </h4>
                      <h4 className="fs-14 text-muted">
                        Max Upload Size 10MB.
                      </h4>
                    </div>
                  </div>
                )}
              </Dropzone>
              <div className="list-unstyled mb-0" id="file-previews">
                {selectedFiles.map((f, i) => (
                  <Card
                    className="mb-0 shadow-none border dz-processing dz-formfile-preview dz-success dz-complete"
                    key={i + "-file"}
                  >
                    <div>
                      <Row className="align-packageItems-center">
                        <Col className="col-auto">
                          <img
                            data-dz-thumbnail=""
                            height="100"
                            className="avatar-sm rounded bg-light"
                            alt={f.name}
                            src={f.preview}
                          />
                        </Col>
                        <Col>
                          <Link to="#" className="text-muted font-weight-bold">
                            {f.name}
                          </Link>
                          <p className="mb-0">
                            <strong>{f.formattedSize}</strong>
                          </p>
                        </Col>
                        <Col lg={2}>
                          <Link onClick={() => handleFileRemove(i)}>
                            <h3>
                              <i className="ri-delete-bin-2-line text-danger"></i>
                            </h3>
                          </Link>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                ))}
              </div>
              <Col className="text-end mt-2">
                <Button type="submit" className="btn-success">
                  Add image
                </Button>
              </Col>
            </form>
          </ModalBody>
        </Modal>
      </div>
    </Container>
  );
};

export default ItemList;
