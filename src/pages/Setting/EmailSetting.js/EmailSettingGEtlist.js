import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  ButtonGroup,
  Input,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TablePagination from "../../Pages/Starter/Pagination";
import ConfigureSetingServices from "../../../services/AustServices/ConfigurationSettingSErvices/ConfigureSetingServices";
import toast from "react-hot-toast";
import { Triangle } from "react-loader-spinner";
import DataTable from "react-data-table-component";

const EmailSettingGetList = () => {
  const { name } = useParams();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [emailSettings, setEmailSettings] = useState([]);
  const [editSetting, setEditSetting] = useState({
    name: "",
    value: "",
    isEditing: false,
  });
  const [isLoading, setIsLoading] = useState(true);

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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const emailData = await ConfigureSetingServices.EmailgetList();
        setEmailSettings(emailData);
      } catch (error) {
        console.log("Error fetching email data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmail();
  }, []);

  const handleEdit = async (settingName) => {
    try {
      setIsLoading(true);
      const settingToUpdate = await ConfigureSetingServices.view(settingName);

      if (editSetting.isEditing && editSetting.name === settingName) {
        const updatedSetting = {
          name: settingToUpdate.name,
          value: editSetting.value,
          description: settingToUpdate.description,
        };

        setEmailSettings(
          emailSettings.map((setting) =>
            setting.name === settingToUpdate.name ? updatedSetting : setting
          )
        );

        await ConfigureSetingServices.ConfigureUpdate([updatedSetting]);

        setEditSetting({ name: "", value: "", isEditing: false });
        toast.success("Value updated successfully!");
        setIsLoading(false);
      } else {
        setEditSetting({
          name: settingName,
          value: settingToUpdate.value,
          isEditing: true,
        });
      }
    } catch (err) {
      console.error("Error editing setting:", err);
      toast.error("Failed to update successfully!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleValueChange = (e) => {
    setEditSetting({ ...editSetting, value: e.target.value });
  };

  const handleEmailConfiguration = () => {
    navigate("/EmailTest");
  };

  const handleEmailTemplate = () => {
    navigate("/email-template");
  };

  const breadcrumbItems = [
    {
      title: (
        <div>
          <Button
            color="primary"
            className="btn btn-soft-primary "
            onClick={() => navigate("/EmailTest")}
          >
            Email Test
          </Button>
          <Button
            className="btn btn-soft-success ms-2"
            onClick={() => navigate("/email-template")}
          >
            Email Template
          </Button>
        </div>
      ),

      // link: "/Package/create",
    },
  ];
  const columns = [
    { name: "S.N", selector: (row) => row.id, sortable: true, width: "70px" },
    {
      name: "Name",
      selector: (row) => row.name,
      width: "200px",
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
    },
    {
      name: "Action",
      cell: (row) => row.action,
      width: "200px",
    },
  ];

  const data = emailSettings
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
        editSetting.isEditing && editSetting.name === item.name ? (
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
      ),
    }));
  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  // const handleClearFilter = () => {
  //   setFilterText("");
  // };

  return (
    <Container fluid>
      <React.Fragment>
        <div className="page-content">
          <BreadCrumb
            title="Email Setting List"
            pageTitle=" Setting "
            breadcrumbItems={breadcrumbItems}
          />
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
            highlightOnHover
            paginationPerPage={50}
            paginationRowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
            pointerOnHover
            progressPending={isLoading}
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

export default EmailSettingGetList;
