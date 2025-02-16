import React, { useState, useEffect } from "react";
import { Triangle } from "react-loader-spinner";
import { Container, Input, Row, Col } from "reactstrap";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import GeneralSettingsService from "../../services/DibyaServices/GeneralConfigSettingsService/GeneralSettingsServices";

const GeneralConfigSettingList = () => {
  const [configList, setConfigList] = useState([]);
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

  const handleUpdate = async (id, newValue, row) => {
    try {
      const updatedData = [
        {
          name: row.name,
          value: newValue ? "true" : "false",
          description: row.description,
          subject: row.subject,
        },
      ];
      await GeneralSettingsService.update(id, updatedData);
      setConfigList((prevList) =>
        prevList.map((config) =>
          config.id === id ? { ...config, value: updatedData[0].value } : config
        )
      );
      toast.success("Configuration updated successfully", { autoClose: 3000 });
    } catch (error) {
      console.error("Error updating configuration:", error);
      toast.error("Failed to update configuration");
    }
  };

  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        const fetchedConfigurations = await GeneralSettingsService.list();
        const temp = fetchedConfigurations.map((item, index) => ({
          ...item,
          index: index + 1,
        }));
        setConfigList(temp);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching configurations:", err);
        setLoading(false);
      }
    };

    fetchConfigurations();
  }, []);

  const columns = [
    {
      name: "S.N",
      selector: (row) => row.index,
      sortable: true,
      width: "75px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Value",
      selector: (row) => row.value.toString(),
      sortable: false,
      grow: 1
    },
    {
      name: "Description",
      selector: (row) => row.description,
      grow:2
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            checked={row.value === "true"}
            onChange={(e) => handleUpdate(row.id, e.target.checked, row)}
          />
        </div>
      ),
    },
  ];

  const filteredData = configList.filter((config) => {
    const searchText = filterText.toLowerCase();
    return (
      config.name.toLowerCase().includes(searchText) ||
      config.description.toLowerCase().includes(searchText) ||
      config.value.toLowerCase().includes(searchText)
    );
  });

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  return (
    <Container fluid>
      <div className="page-content">
        <Row>
          <div className="d-flex pb-2 gap-1">
            <Col lg={4}>
              <Input
                type="text"
                value={filterText}
                onChange={handleFilter}
                placeholder="Filter by Name, Value or Description"
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

export default GeneralConfigSettingList;
