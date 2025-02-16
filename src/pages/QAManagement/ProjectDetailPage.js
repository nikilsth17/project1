import React from "react";
import {
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Col,
  Button,
  Container,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Form,
  Label,
  Alert,
  Input,
} from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import { getLoggedInUser } from "../../helpers/fakebackend_helper";
import FeatherIcon from "feather-icons-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ModuleCard from "../../Components/QAManagementComponent/Cards/ModuleCard";
import { useParams } from "react-router-dom";
import {
  fetchModulesForProject,
  addModuleForProject,
  updateModuleByID,
} from "../../slices/qaManagment/module/thunk";
import Select from "react-select";
import { getProjects } from "../../slices/qaManagment/project/thunk";
import toast from "react-hot-toast";
import classnames from "classnames";
import Dashcard from "../../Components/QAManagementComponent/Dashboard/DashCard";
import ModuleModal from "../../Components/QAManagementComponent/Modals/ModuleModal";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Link } from "react-router-dom";
import DocumentContent from "../../Components/QAManagementComponent/DocumentContent";
import { useLocation } from "react-router-dom";
import SkeletonCard from "../../Components/QAManagementComponent/Skeleton/CardSkeleton";
import "./PageEditor.css";
import {
  getPageByProjectId,
  createGeneralPage,
  deletePagebyId,
} from "../../slices/qaManagment/GeneralPages/thunk";
import DeleteModal from "../../Components/Common/DeleteModal";

const ProjectDetaulPage = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.Project.project);
  const pageList = useSelector((state) => state.GeneralPage?.generalPages);
  console.log("pageList", pageList);
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    // Fetch users when the component mounts
    dispatch(getProjects());
  }, [dispatch]);

  console.log("projecq34qwt:", projects);
  console.log(process.env.TEST_MANAGEMENT_API_URL);
  const proj = projects.find((p) => p.id === parseInt(id));
  console.log("id:", id); // Check the value of id

  console.log("project:", proj);
  const authUser = getLoggedInUser();

  const isAdmin =
    authUser?.associatedRoles?.includes("SuperAdmin") ||
    authUser?.associatedRoles?.includes("SystemAdmin");

  console.log("Project detail auth user check", isAdmin);

  useEffect(() => {
    //Fetch all the modules for the project
    dispatch(fetchModulesForProject(id));
  }, [dispatch, id]);

  // Get the fetched module data from the Redux store
  const moduleData = useSelector((state) => state.Module?.module);
  const loadingModules = useSelector((state) => state.Module.loading);
  console.log("modules:", moduleData);

  const [activeTab, setActiveTab] = useState("1"); // Initialize the active tab to "1"
  const [headerJustifyTab, setheaderJustifyTab] = useState("1");
  const headerJustifyToggle = (tab) => {
    if (headerJustifyTab !== tab) {
      setheaderJustifyTab(tab);
      setActiveTab(tab);
    }
    if (tab === "4") {
      dispatch(getPageByProjectId(id));
    }
  };

  const [verticalTab, setverticalTab] = useState("1");
  const toggleVertical = (tab) => {
    if (verticalTab !== tab) {
      setverticalTab(tab);
    }
  };

  //----------------------------------------  Page   -------------------------------------------------------------

  const [newDocumentData, setNewDocumentData] = useState({
    title: "",
    description: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    title: "",
    description: "",
  });
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDocumentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBlur = (field) => {
    const errors = { ...validationErrors };

    if (!newDocumentData[field].trim()) {
      errors[field] = `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } is required`;
    } else {
      errors[field] = ""; // Clear the error message if the field is not empty
    }

    setValidationErrors(errors);
  };

  const validateFields = () => {
    const errors = {};
    let isValid = true;

    if (!newDocumentData.title.trim()) {
      errors.title = "Page Title is required";
      isValid = false;
    }

    if (!newDocumentData.description.trim()) {
      errors.description = "Description is required";
      isValid = false;
    }

    setValidationErrors(errors);

    return isValid;
  };

  const handleCreatePage = () => {
    // Validate the form
    const isValid = validateFields();

    if (isValid) {
      const page = {
        ...newDocumentData,
        projectId: id,
      };
      // Dispatch action to add new page here
      console.log("page to add", page);
      dispatch(createGeneralPage(page)); // Assuming you have a addPage action

      dispatch(getPageByProjectId(id));

      // Close Modal
      setIsModalOpen(false);
      toast.success("Page Added Successfully");
    } else {
      toast.error("Page title and body cannot be empty");
    }
  };

  //---------------------------------------- </Page>  -------------------------------------------------------------

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setIsEditMode(false); // Reset editing mode when the modal is closed
    setEditedModule(null); // Reset edited user when the modal is closed
    setSelectedParentModuleId(null);
    setNewDocumentData({
      title: "",
      description: "",
    });
  };

  //---------------------------------------- <Module Modal>  -------------------------------------------------------------

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // New state for editing mode
  const [editedModule, setEditedModule] = useState(null); // New state for edited user
  const [selectedParentModuleId, setSelectedParentModuleId] = useState(null);
  const [selectedParentModuleName, setSelectedParentModuleName] = useState("");

  const handleAddModule = (values) => {
    try {
      const newModule = {
        ...values,
        parent_Module_Id: values.parent_Module_Id || null,
      };
      // Dispatch action to add new module here
      console.log("module to add", newModule);
      dispatch(addModuleForProject(newModule, id)); // Assuming you have a addModule action

      setIsModalOpen(false);
      toast.success("Module Added Successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditModule = (module) => {
    setIsModalOpen(true);
    setIsEditMode(true);
    setEditedModule({
      id: module.id,
      projectId: module.projectId,
      ...module,
    });

    // Set the selected parent module name when editing a module
    const parentModule = moduleData.find(
      (m) => m.id === module.parent_Module_Id
    );
    if (parentModule) {
      setSelectedParentModuleName(parentModule.moduleName);
      setSelectedParentModuleId(parentModule.id);
    } else {
      setSelectedParentModuleName("New Module");
      setSelectedParentModuleId(null);
    }
  };

  const handleUpdateModule = (values) => {
    console.log("Edited values values", values);

    if (editedModule) {
      const updatedModule = {
        ...editedModule,
        ...values,
        parent_Module_Id: selectedParentModuleId, // Include selectedParentModuleId in the values object
      };

      dispatch(updateModuleByID(editedModule.id, updatedModule)); // Use updatedModule instead of values
    }

    // Close Modal
    setIsModalOpen(false);
    setEditedModule(null); // Reset edited module after update
    toast.success("Module Updated Successfully");
  };

  //---------------------------------------- </Module Modal>  -------------------------------------------------------------

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* breadcrumb */}
          <BreadCrumb
            title={proj ? proj.title : "Empty"}
            pageTitle="Ants Quality"
          />
          <Col lg={12}>
            <Col sm={12}>
              <Card>
                <div className="card-header align-items-center d-flex justify-content-between">
                  <div className="flex-shrink-0">
                    <Nav pills className="card-header-pills">
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: headerJustifyTab === "1",
                          })}
                          onClick={() => {
                            headerJustifyToggle("1");
                          }}
                        >
                          Modules
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: headerJustifyTab === "2",
                          })}
                          onClick={() => {
                            headerJustifyToggle("2");
                          }}
                        >
                          Project Details
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: headerJustifyTab === "3",
                          })}
                          onClick={() => {
                            headerJustifyToggle("3");
                          }}
                        >
                          Tasks
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: headerJustifyTab === "4",
                          })}
                          onClick={() => {
                            headerJustifyToggle("4");
                          }}
                        >
                          Pages
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                  <div>
                    {isAdmin ? (
                      <div
                        className="p-1 rounded-1 bg-primary"
                        onClick={toggleModal}
                        style={{
                          color: "white",
                          cursor: "pointer",
                          paddingRight: "200px",
                        }}
                      >
                        {" "}
                        <FeatherIcon icon="plus" />
                      </div>
                    ) : null}
                  </div>
                </div>

                <CardBody>
                  <TabContent
                    activeTab={headerJustifyTab}
                    className="text-muted"
                  >
                    {activeTab === "1" ? (
                      <TabPane tabId="1" id="modules">
                        <Col lg={12}>

                          <CardBody>
                          <Alert color="primary">
                            <strong> Note- </strong> All the modules for   <b className="text-dark">{proj?.title}</b>{" "}
                            project -Are shown here!
                          </Alert>
                            <Row>
                              {loadingModules ? (
                                <>
                                  <Col sm={10} md={3}>
                                    <SkeletonCard />
                                  </Col>
                                  <Col sm={10} md={3}>
                                    <SkeletonCard />
                                  </Col>
                                  <Col sm={10} md={3}>
                                    <SkeletonCard />
                                  </Col>
                                  <Col sm={10} md={3}>
                                    <SkeletonCard />
                                  </Col>
                                </>
                              ) : (
                                moduleData.map((module) => (
                                  <Col sm={10} md={3} key={module.id}>
                                    <ModuleCard
                                      moduleName={module?.moduleName}
                                      id={module.id}
                                      parent_Module_Id={module.parent_Module_Id}
                                      onEditModule={handleEditModule}
                                      itHasSubModule={module.hasSubModules}
                                    />
                                  </Col>
                                ))
                              )}
                            </Row>
                          </CardBody>
                        </Col>
                      </TabPane>
                    ) : (
                      ""
                    )}

                    {activeTab === "2" ? (
                      <TabPane tabId="2" id="projectDetails">
                        <Col lg={12}>
                          <Row>
                            <Dashcard title={"Dummy"} count={"1232"}></Dashcard>
                            <Dashcard title={"Dummy"} count={"1232"}></Dashcard>
                            <Dashcard title={"Dummy"} count={"1232"}></Dashcard>
                            <Dashcard title={"Dummy"} count={"1232"}></Dashcard>
                          </Row>
                          <Row>
                            <Col sm={12} md={6} lg={3}>
                              <h5 className="mb-4">Project Resources</h5>
                            </Col>
                            <Col lg={12} className=" mt-4 px-4">
                              <Row
                                style={{
                                  borderRadius: "10px",
                                  border: "1px solid rgba(100, 91, 208, 0.20)",
                                }}
                              >
                                <Col
                                  md={3}
                                  xl={2}
                                  className="py-0"
                                  style={{
                                    height: "500px",
                                    background: "rgba(189, 186, 228, 0.31)",
                                  }}
                                >
                                  <div className=" pt-5">
                                    <p className="mt-5 f-10 mb-1 text-muted">
                                      Resources
                                    </p>
                                    <Nav
                                      pills
                                      className="flex-column"
                                      id="v-pills-tab"
                                    >
                                      <NavItem>
                                        <NavLink
                                          style={{
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                          className={classnames({
                                            "mb-2": true,
                                            active: verticalTab === "1",
                                          })}
                                          onClick={() => {
                                            toggleVertical("1");
                                          }}
                                          id="v-pills-home-tab"
                                        >
                                          <i className="me-2 fs-18 ri-file-word-2-line text-secondary"></i>
                                          Docs
                                        </NavLink>
                                      </NavItem>
                                      <NavItem>
                                        <NavLink
                                          style={{
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                          className={classnames({
                                            "mb-2": true,
                                            active: verticalTab === "2",
                                          })}
                                          onClick={() => {
                                            toggleVertical("2");
                                          }}
                                          id="v-pills-profile-tab"
                                        >
                                          <i className="me-2 fs-18 ri-file-excel-2-line text-success"></i>
                                          Sheets
                                        </NavLink>
                                      </NavItem>
                                      <NavItem>
                                        <NavLink
                                          style={{ cursor: "pointer" }}
                                          className={classnames({
                                            "mb-2": true,
                                            active: verticalTab === "3",
                                          })}
                                          onClick={() => {
                                            toggleVertical("3");
                                          }}
                                          id="v-pills-messages-tab"
                                        >
                                          Images
                                        </NavLink>
                                      </NavItem>
                                      <NavItem>
                                        <NavLink
                                          style={{ cursor: "pointer" }}
                                          className={classnames({
                                            active: verticalTab === "4",
                                          })}
                                          onClick={() => {
                                            toggleVertical("4");
                                          }}
                                          id="v-pills-settings-tab"
                                        >
                                          Unknown
                                        </NavLink>
                                      </NavItem>
                                    </Nav>
                                  </div>
                                </Col>
                                <Col
                                  md={9}
                                  xl={10}
                                  style={{
                                    height: "500px",
                                    overflowY: "scroll",
                                    scrollbarWidth: "thin",
                                    scrollbarColor: "transparent transparent",
                                  }}
                                >
                                  <Row
                                    className="py-3 px-3"
                                    style={{
                                      background: "#D8D5FE",
                                      borderRadius: "0px 8px 0px 0px",
                                    }}
                                  >
                                    <h6 className="mb-0">Documents</h6>
                                  </Row>
                                  <TabContent
                                    activeTab={verticalTab}
                                    className="text-muted mt-4 mt-md-0 px-3"
                                    id="v-pills-tabContent"
                                  >
                                    <TabPane tabId="1" id="v-pills-home">
                                      <p className="mb-0">
                                        This may be the most commonly
                                        encountered
                                      </p>
                                    </TabPane>
                                    <TabPane tabId="2" id="v-pills-profile">
                                      <p className="mb-0">
                                        You've probably heard that opposites
                                      </p>
                                    </TabPane>
                                    <TabPane tabId="3" id="v-pills-messages">
                                      <p className="mb-0">
                                        different fonts in one design, but do
                                        not
                                      </p>
                                    </TabPane>

                                    <TabPane tabId="4" id="v-pills-settings">
                                      <p className="mb-0">
                                        of the two objects.
                                      </p>
                                    </TabPane>
                                  </TabContent>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      </TabPane>
                    ) : (
                      ""
                    )}

                    {activeTab === "3" ? (
                      <TabPane tabId="3" id="managers">
                        <Row></Row>
                      </TabPane>
                    ) : (
                      ""
                    )}

                    {activeTab === "4" ? (
                      <TabPane tabId="4" id="pages">
                        <Row>
                          <Col lg={12} className="  px-4">
                            <Row
                              style={{
                                borderRadius: "10px",
                                border: "1px solid rgba(100, 91, 208, 0.20)",
                              }}
                            >
                              <Col
                                md={3}
                                xl={2}
                                className="py-0"
                                style={{
                                  background: "rgba(189, 186, 228, 0.31)",
                                }}
                              >
                                <div className=" ">
                                  <p className="mt-5 f-10 mb-1 text-muted">
                                    Resources
                                  </p>
                                  <ul className="list-group">
                                    {pageList.map((page) => (
                                      <div
                                        className="d-flex justify-content-between align-items-center bg-white mt-2 px-2 rounded-1"
                                        key={page.id}
                                        onMouseEnter={() => {
                                          // Show the delete button on hover
                                          if (isAdmin) {
                                            document.getElementById(
                                              `deleteButton${page.id}`
                                            ).style.display = "inline-block";
                                          }
                                        }}
                                        onMouseLeave={() => {
                                          // Hide the delete button when mouse leaves
                                          if (isAdmin) {
                                            document.getElementById(
                                              `deleteButton${page.id}`
                                            ).style.display = "none";
                                          }
                                        }}
                                      >
                                        <Link
                                          key={page.id}
                                          className="text-decoration-none text-dark py-2"
                                          to={`${location.pathname}#/pages/${page.id}`}
                                          onClick={() => {
                                            setSelectedDocumentId(page.id);
                                          }}
                                        >
                                          {page.title}
                                        </Link>
                                        {isAdmin ? (
                                          <>
                                            <button
                                              className="btn py-0"
                                              onClick={() =>
                                                dispatch(
                                                  deletePagebyId(page.id)
                                                )
                                              }
                                              style={{ display: "none" }}
                                              id={`deleteButton${page.id}`}
                                            >
                                              <i className="ri-delete-bin-line text-danger"></i>
                                            </button>
                                          </>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    ))}
                                  </ul>
                                </div>
                              </Col>
                              <Col md={9} xl={10}>
                                {selectedDocumentId ? (
                                  <DocumentContent id={selectedDocumentId} />
                                ) : (
                                  <div
                                    className="d-flex justify-content-center align-items-center mt-2"
                                    style={{
                                      height: "500px",
                                      overflowY: "scroll",
                                      scrollbarWidth: "thin",
                                      scrollbarColor: "transparent transparent",
                                    }}
                                  >
                                    <h5 className="text-muted">
                                      No Page Selected
                                    </h5>
                                  </div>
                                )}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </TabPane>
                    ) : (
                      ""
                    )}
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Col>
        </Container>
      </div>

      {activeTab === "1" ? (
        <ModuleModal
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          id={id}
          isEditMode={isEditMode}
          editedData={editedModule}
          selectedParentModuleName={selectedParentModuleName}
          selectedParentModuleId={selectedParentModuleId}
          moduleData={moduleData}
          handleAddModule={handleAddModule}
          handleUpdateModule={handleUpdateModule}
          setSelectedParentModuleName={setSelectedParentModuleName}
          setSelectedParentModuleId={setSelectedParentModuleId}
          type="module"
        />
      ) : activeTab === "4" ? (
        <Modal isOpen={isModalOpen} toggle={toggleModal} fullscreen>
          <div className="d-flex justify-content-center text-center align-items-center mt-2">
            {proj ? proj.title : "Empty"}
          </div>
          {/* <ModalHeader   toggle={toggleModal}>


        </ModalHeader> */}
          <ModalBody>
            <Form className="row">
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <FormGroup className="mt-3 ">
                      <Input
                        className={`border-0 border-bottom rounded-0 border-black shadow-none border-opacity-25 px-0 ${
                          validationErrors.title ? "is-invalid" : ""
                        }`}
                        name="title"
                        type="text"
                        id="title"
                        placeholder="Page Title here..."
                        value={newDocumentData.title}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("title")} // Validate on blur
                      />
                      {validationErrors.title && (
                        <div className="invalid-feedback">
                          {validationErrors.title}
                        </div>
                      )}
                    </FormGroup>
                  </div>
                </div>
              </div>
              <div className="col-12 px-0 ">
                <FormGroup>
                  <div
                    className={`${
                      validationErrors.description
                        ? "is-invalid pageEditor"
                        : "pageEditor"
                    }`}
                  >
                    <CKEditor
                      editor={ClassicEditor}
                      data={newDocumentData.description}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setNewDocumentData((prevData) => ({
                          ...prevData,
                          description: data,
                        }));
                      }}
                      onBlur={() => handleBlur("description")} // Validate on blur
                    />
                  </div>
                  {validationErrors.description && (
                    <div className="invalid-feedback">
                      {validationErrors.description}
                    </div>
                  )}
                </FormGroup>
              </div>
            </Form>
          </ModalBody>
          <ModalFooter>
            {/* <Button color="primary" onClick={handleAddTestCase} >Submit</Button> */}
            <Button color="secondary" onClick={toggleModal}>
              Cancel
            </Button>
            {isEditMode ? (
              <Button color="primary">Update</Button>
            ) : (
              <Button color="success" onClick={handleCreatePage}>
                Save
              </Button>
            )}
          </ModalFooter>
        </Modal>
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

export default ProjectDetaulPage;
