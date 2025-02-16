import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import { Container, Button, ButtonGroup, Input, Row, Col } from "reactstrap";
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import WhatsAppSettingServices from "../../services/DibyaServices/WhatsappSettingsService/WhatsappSettingsService";

const WhatsAppSettingsList = () => {
  const [whatsappSettingList, setWhatsAppSettingList] = useState([]);
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
    const fetchWhatsAppSettings = async () => {
      try {
        const fetchedSettings = await WhatsAppSettingServices.whatsappSettingList();
        const formattedSettings = fetchedSettings.map((setting, index) => ({
          ...setting,
          index: index + 1,
        }));
        setWhatsAppSettingList(formattedSettings);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchWhatsAppSettings();
  }, []);

  const handleDelete = async (settingId) => {
    try {
      if (window.confirm("Do you really want to delete this WhatsApp Setting?")) {
        await WhatsAppSettingServices.deleteWhatsAppSetting(settingId);
        setWhatsAppSettingList((prevSettingList) =>
          prevSettingList.filter((setting) => setting.id !== settingId)
        );
        toast.success("WhatsApp Setting Deleted Successfully", { autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error deleting WhatsApp Setting:", error);
      toast.error("Failed to delete WhatsApp Setting");
    }
  };

  const columns = [
    {
      name: "S.N",
      selector: (row) => row.index,
      sortable: true,
      width: "75px",
    },
    {
      name: "Title",
      selector: (row) => row.title,
    },
    {
      name: "Value",
      selector: (row) => row.value,
      sortable: true,
      grow: 2,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      grow: 2,
      width: "30%",
    },
    {
      name: "Action",
      cell: (row) => row.action,
      center: true,
    },
  ];

  const filteredData = whatsappSettingList
    .filter((setting) => {
      const searchText = filterText.toLowerCase();
      return (
        setting.title.toLowerCase().includes(searchText) ||
        setting.value.toLowerCase().includes(searchText)
      );
    })
    .map((setting, index) => ({
      index: index + 1,
      title: setting.title,
      value: setting.value,
      description: setting.description,
      action: (
        <td className="button">
          <ButtonGroup size="sm">
            <Link
              to={{
                pathname: `/headers/edit/${setting.id}`,
                state: { whatsappSent: true },
              }}
            >
              <Button
                color="btn btn-soft-warning"
                className="btn-sm gap-1 ms-1"
                size="sm"
              >
                <i className="ri-edit-line" />
              </Button>
            </Link>
            {/* <Button
              className="btn btn-soft-danger btn-sm gap-1 ms-1"
              color="danger"
              onClick={() => handleDelete(setting.id)}
              size="sm"
            >
              <i className="ri-delete-bin-5-line" />
            </Button> */}
          </ButtonGroup>
        </td>
      ),
    }));

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  return (
    <Container fluid>
      <div className="page-content">
        <BreadCrumb
          title="WhatsApp Settings List"
          pageTitle="WhatsApp Settings"
          breadcrumbItems={[
            {
              // title: (
              //   <Button className="btn btn-soft-success">+ New WhatsApp Setting</Button>
              // ),
              // link: "/whatsapp-settings/add",
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
                placeholder="Search by Title or Value"
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

export default WhatsAppSettingsList;
