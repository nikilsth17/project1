import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import ConfigureSetingServices from "../../../services/AustServices/ConfigurationSettingSErvices/ConfigureSetingServices";
import GeneralSettingServices from "../../../services/AustServices/GeneralSettingsServices/GeneralSettingsServices";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import toast from "react-hot-toast";
import TablePagination from "../Starter/Pagination";
import { Triangle } from "react-loader-spinner";
import DataTable from "react-data-table-component";

const GeneralSettingList = () => {
  const [generalSettingData, setGeneralSettingData] = useState([]);
  const [editSetting, setEditSetting] = useState({
    name: "",
    value: "",
    isEditing: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
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

  const fetchGeneralSettings = async () => {
    try {
      const settingsData = await GeneralSettingServices.getList();
      console.log("Settings Data:", settingsData); // Log the data for debugging
      setGeneralSettingData(settingsData);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching general settings data:", error);
      toast.error("Failed to fetch data!");
    }
  };

  useEffect(() => {
    fetchGeneralSettings();
  }, []);

  const handleEdit = async (settingName) => {
    try {
      const settingToUpdate = generalSettingData.find(
        (setting) => setting.name === settingName
      );

      if (!settingToUpdate) {
        console.error("Setting to update not found.");
        return;
      }

      if (editSetting.isEditing && editSetting.name === settingName) {
        const updatedData = [
          {
            name: settingToUpdate.name,
            value: editSetting.value,
            description: settingToUpdate.description,
            subject: settingToUpdate.subject,
          },
        ];

        // Simulate API call or perform necessary update operation
        await ConfigureSetingServices.ConfigureUpdate(updatedData);

        // Update the local state with the edited value
        setGeneralSettingData(
          generalSettingData.map((setting) =>
            setting.name === settingToUpdate.name ? updatedData[0] : setting
          )
        );

        setEditSetting({ name: "", value: "", isEditing: false });
        toast.success("Value updated successfully!");
      } else {
        // Enter edit mode for the selected setting
        setEditSetting({
          name: settingName,
          value: settingToUpdate.value,
          isEditing: true,
        });
      }
    } catch (err) {
      console.error("Error editing setting:", err);
      toast.error("Failed to update value!");
    }
  };

  const handleValueChange = (e) => {
    const newValue =
      e.target.type === "checkbox"
        ? e.target.checked
          ? "Active"
          : "Inactive"
        : e.target.value;
    setEditSetting({
      ...editSetting,
      value: newValue,
    });
  };

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  // const handleClearFilter = () => {
  //   setFilterText("");
  // };

  const columns = [
    { name: "S.N", selector: (row) => row.id, sortable: true, width: "70px" },
    {
      name: "Name",
      selector: (row) => row.name,
      width: "300px",
      sortable: "true",
    },
    {
      name: "Value",
      selector: (row) => row.value,
      width: "200px",
      sortable: "true",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      width: "300px",
      sortable: "true",
    },
    {
      name: "Action",
      cell: (row) => row.action,
      width: "100px",
    },
  ];

  const data = generalSettingData
    ?.filter((item) => {
      const searchText = filterText.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchText) ||
        item.description.toLowerCase().includes(searchText)
      );
    })
    .map((item, index) => ({
      id: index + 1,
      name: item.name,
      value:
        item.name === "DummyLabel" ? (
          editSetting.isEditing && editSetting.name === "DummyLabel" ? (
            <Form>
              <FormGroup switch>
                <Label switch>
                  <Input
                    type="checkbox"
                    checked={editSetting.value === "Active"}
                    onChange={handleValueChange}
                  />
                  {editSetting.value === "Active" ? (
                    <span className="badge bg-success">Active</span>
                  ) : (
                    <span className="badge bg-danger">Inactive</span>
                  )}
                </Label>
              </FormGroup>
            </Form>
          ) : (
            <span
              className={
                item.value === "Active" ? "badge bg-success" : "badge bg-danger"
              }
            >
              {item.value}
            </span>
          )
        ) : editSetting.isEditing && editSetting.name === item.name ? (
          <input
            type="text"
            value={editSetting.value}
            onChange={handleValueChange}
            className="form-control"
          />
        ) : (
          item.value
        ),

      description: item.description,
      action: (
        <ButtonGroup size="sm">
          <div className="d-flex gap-1">
            <Button
              color="btn btn-soft-warning"
              className="btn-sm gap-1"
              onClick={() => handleEdit(item.name)}
            >
              {editSetting.isEditing && editSetting.name === item.name ? (
                <i className="ri-save-line" />
              ) : (
                <i className="ri-edit-line" />
              )}
            </Button>
          </div>
        </ButtonGroup>
      ),
    }));

  return (
    <Container fluid>
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb title="General Setting List" pageTitle=" Setting " />
          <Row>
            <div className="d-flex pb-2 gap-1">
              <Col lg={4}>
                <Input
                  type="text"
                  value={filterText}
                  onChange={handleFilter}
                  placeholder="Filter by Name & description"
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
            progressPending={loading}
            highlightOnHover
            paginationPerPage={50}
            paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
            pointerOnHover
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
        </div>
      </React.Fragment>
    </Container>
  );
};

export default GeneralSettingList;
