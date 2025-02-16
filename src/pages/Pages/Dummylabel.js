import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { Triangle } from "react-loader-spinner";

const Dummy = () => {
  const dummyData = [
    {
      id: 1,
      name: "DummyLabel",
      value: "Inactive",
      description: "Static Service",
    },
  ];

  const [value, setValue] = useState("Inactive");
  const [showToggle, setShowToggle] = useState(false);
  const [editSetting, setEditSetting] = useState({
    name: "",
    value: "",
    isEditing: false,
  });

  const handleEdit = (settingName) => {
    const settingToEdit = dummyData.find(
      (setting) => setting.name === settingName
    );
    if (!settingToEdit) {
      console.error("Setting to edit not found.");
      return;
    }

    setEditSetting({
      name: settingToEdit.name,
      value: settingToEdit.value,
      isEditing: true,
    });

    setShowToggle(true);
  };

  const handleToggle = () => {
    setValue(value === "Active" ? "Inactive" : "Active");
  };

  const handleSave = () => {
    setEditSetting({
      name: "",
      value: "",
      isEditing: false,
    });

    setShowToggle(false);
  };

  const columns = [
    { name: "S.N", selector: (row) => row.id, sortable: true, width: "70px" },
    {
      name: "Name",
      selector: (row) => row.name,
      width: "300px",
      sortable: true,
    },
    {
      name: "Value",
      selector: (row) => row.value,
      width: "200px",
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      width: "300px",
      sortable: true,
      cell: (row) => <span>{row.description}</span>,
    },
    { name: "Action", cell: (row) => row.action, width: "100px" },
  ];

  const data = dummyData.map((item) => ({
    id: item.id,
    name: item.name,
    value: showToggle ? (
      <Form>
        <FormGroup switch>
          <Input
            type="switch"
            checked={value === "Active"}
            onChange={handleToggle}
            size="md"
          />
          <Label check>
            {value === "Active" ? (
              <span className="badge bg-success">Active</span>
            ) : (
              <span className="badge bg-danger">Inactive</span>
            )}
          </Label>
        </FormGroup>
      </Form>
    ) : (
      <span
        className={value === "Active" ? "badge bg-success" : "badge bg-danger"}
      >
        {value}
      </span>
    ),

    description: item.description,
    action: (
      <ButtonGroup size="sm">
        <div className="d-flex gap-1">
          <Button
            color="btn btn-soft-warning"
            className="btn-sm gap-1"
            onClick={() =>
              editSetting.isEditing ? handleSave() : handleEdit(item.name)
            }
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
      <div className="page-content">
        <DataTable
          responsive
          striped
          pagination
          fixedHeader
          persistTableHead
          highlightOnHover
          pointerOnHover
          paginationPerPage={50}
          paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
          columns={columns}
          data={data}
          progressComponent={
            <div className="my-3">
              <Triangle visible={true} height="80" width="80" color="#5B71B9" />
              <h5 className="mt-1">Loading...</h5>
            </div>
          }
        />
      </div>
    </Container>
  );
};

export default Dummy;
