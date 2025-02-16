import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Container,
  InputGroup,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalHeader,
  Form,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Alert,
  UncontrolledTooltip,
} from "reactstrap";
import FeatherIcon from "feather-icons-react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TestCaseCard from "../../Components/QAManagementComponent/Cards/TestCaseCard";
import { getLoggedInUser } from "../../helpers/fakebackend_helper";
import TestCaseTable from "../../Components/QAManagementComponent/Datatable/TestCaseTable";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTestCaseForModule,
  updateTestCaseByID,
} from "../../slices/qaManagment/Test/thunk";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { getModules } from "../../slices/qaManagment/module/thunk";
import { getProjects } from "../../slices/qaManagment/project/thunk";
import { addTestCaseForModule } from "../../slices/qaManagment/Test/thunk";
import toast from "react-hot-toast";
import classnames from "classnames";
import ModuleModal from "../../Components/QAManagementComponent/Modals/ModuleModal";
import {
  updateSubModuleById,
  addSubModuleforModule,
  fetchSubModulesForModule,
} from "../../slices/qaManagment/subModule/thunk";
import Select from "react-select";
import SubModuleCard from "../../Components/QAManagementComponent/Cards/ModuleCard";
import SkeletonCard from "../../Components/QAManagementComponent/Skeleton/CardSkeleton";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import DocumentContent from "../../Components/QAManagementComponent/DocumentContent";
import {
  createGeneralPage,
  getPageByModuleId,
  deletePagebyId,
} from "../../slices/qaManagment/GeneralPages/thunk";

const ModuleDetailPage = () => {
  const dispatch = useDispatch();

  const { id } = useParams();
  const testCaseData = useSelector((state) => state.TestCase.testcase);
  const modules = useSelector((state) => state.Module?.module);
  const projects = useSelector((state) => state.Project?.project);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // New state for editing mode
  const [editedTestCase, setEditedTestCase] = useState(null); // New state for edited user

  const currentModule = modules?.find((module) => module?.id === parseInt(id));
  console.log("currentmodule", currentModule);
  const currentProject = projects?.find(
    (project) => project?.id === currentModule?.projectId
  );
  console.log("currentProject:", currentProject);

  // console.log("All Modules", modules);
  const authUser = getLoggedInUser();
  const isAdmin = true;//

  const submoduleData = useSelector((state) => state.SubModule.subModule);
  const loadingSubmodules = useSelector((state) => state.SubModule.loading);

  console.log(`submodules for this module ${id}`, submoduleData);

  useEffect(() => {
    //fetch all the testcases for the module
    dispatch(fetchSubModulesForModule(id));
  }, [dispatch, id]);

  useEffect(() => {
    // Fetch users when the component mounts
    dispatch(getProjects());
    dispatch(getModules());
  }, [dispatch, id]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setIsEditMode(false); // Reset editing mode when the modal is closed
    setEditedTestCase(null); // Reset edited testcase data when the modal is closed
    setEditedSubModuleData(null); // Reset edited moduledata when the modal is closed
    setSelectedParentModuleId(null);
    setNewTestCaseData({
      testTitle: "",
      scenario: "",
      description: "",
      expectedResult: "",
      preRequisities: "",
      testSteps: "",
      testData: "",
      status: false,
    });
    setValidationErrors({
      testTitle: "",
      scenario: "",
      description: "",
      expectedResult: "",
      preRequisities: "",
      testSteps: "",
      testData: "",
    });
  };

  const [newTestCaseData, setNewTestCaseData] = useState({
    testTitle: "",
    scenario: "",
    description: "",
    expectedResult: "",
    preRequisities: "",
    testSteps: "",
    testData: "",
    status: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTestCaseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [validationErrors, setValidationErrors] = useState({
    testTitle: "",
    scenario: "",
    description: "",
    expectedResult: "",
    preRequisities: "",
    testSteps: "",
    testData: "",
    status: false,
  });

  const validateFields = () => {
    const errors = {};
    let isValid = true;

    if (!newTestCaseData.testTitle.trim()) {
      errors.testTitle = "Test Title is required";
      isValid = false;
    }

    if (!newTestCaseData.scenario.trim()) {
      errors.scenario = "Scenario is required";
      isValid = false;
    }

    if (!newTestCaseData.description.trim()) {
      errors.description = "Description is required";
      isValid = false;
    }

    if (!newTestCaseData.expectedResult.trim()) {
      errors.expectedResult = "Expected Result is required";
      isValid = false;
    }

    if (!newTestCaseData.preRequisities.trim()) {
      errors.preRequisities = "Pre-Requisites is required";
      isValid = false;
    }

    if (!newTestCaseData.testSteps.trim()) {
      errors.testSteps = "Test Steps is required";
      isValid = false;
    }

    if (!newTestCaseData.testData.trim()) {
      errors.testData = "Test Data is required";
      isValid = false;
    }

    setValidationErrors(errors);

    return isValid;
  };

  const [headerJustifyTab, setheaderJustifyTab] = useState("1");
  const [activeTab, setActiveTab] = useState("1");
  const headerJustifyToggle = (tab) => {
    if (headerJustifyTab !== tab) {
      setheaderJustifyTab(tab);
      setActiveTab(tab);
    }

    if (tab === "2") {
      dispatch(fetchTestCaseForModule(id));
    }
    if (tab === "4") {
      dispatch(getPageByModuleId(id));
    }
  };

  // useEffect(() => {
  //   //fetch all the testcases for the module
  //   dispatch(fetchTestCaseForModule(id));
  // },[dispatch, id])

  const handleBlur = (field) => {
    const errors = { ...validationErrors };

    if (!newTestCaseData[field].trim()) {
      errors[field] = `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } is required`;
    } else {
      errors[field] = ""; // Clear the error message if the field is not empty
    }

    setValidationErrors(errors);
  };

  const handleAddTestCase = () => {
    if (validateFields()) {
      try {
        const newTestCase = {
          moduleId: id,
          status: false,
          ...newTestCaseData,
        };
        // Dispatch action to add a new module here
        dispatch(addTestCaseForModule(id, newTestCase));
        setIsModalOpen(false);
        toast.success("Test Case Added Successfully");
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Please fill all the required fields");
    }
  };

  const handleEditTestCase = (testcase) => {
    setIsModalOpen(true);
    setIsEditMode(true);
    setEditedTestCase(testcase);
    setNewTestCaseData({
      id: testcase.id,
      testTitle: testcase.testTitle,
      scenario: testcase.scenario,
      description: testcase.description,
      expectedResult: testcase.expectedResult,
      preRequisities: testcase.preRequisities,
      testSteps: testcase.testSteps,
      testData: testcase.testData,
      status: false,
      moduleId: id,
    });
  };

  const handleUpdateTestCase = () => {
    if (validateFields()) {
      dispatch(updateTestCaseByID(editedTestCase.id, newTestCaseData));
      toast.success("Test Case Updated Successfully");
      setIsModalOpen(false);
    } else {
      toast.error("Please fill all the required fields");
    }
  };

  // Module ------------------------------------------------------

  const [editedSubModuleData, setEditedSubModuleData] = useState(null); // New state for edited user
  const [selectedParentModuleName, setSelectedParentModuleName] = useState("");
  const [selectedParentModuleId, setSelectedParentModuleId] = useState(null);

  const handleEditSubModule = (submodule) => {
    setIsModalOpen(true);
    setIsEditMode(true);
    setEditedSubModuleData({
      id: submodule.id,
      moduleName: submodule.moduleName,
      projectId: submodule.projectId,
      parent_Module_Id: submodule.parent_Module_Id,
    });

    setSelectedParentModuleName(submodule.parentModuleName);
    setSelectedParentModuleId(submodule.parent_Module_Id);
  };
  // const handleEditSubModule = (module) => {
  //   setIsModalOpen(true);
  //   setIsEditMode(true);
  //   setEditedSubModuleData({
  //     id: module.id,
  //     projectId: module.projectId,
  //     parent_Module_Id: module.parent_Module_Id,
  //     ...module,
  //   });
  // }

  const handleUpdateSubModule = (values) => {
    const updateModuleData = {
      ...editedSubModuleData,
      ...values,
      parent_Module_Id: selectedParentModuleId,
    };
    console.log("module to update", updateModuleData);
    dispatch(updateSubModuleById(updateModuleData.id, updateModuleData));
    setIsModalOpen(false);
  };

  const handleAddSubModule = (submodule) => {
    const moduletoadd = {
      ...submodule,
      parent_Module_Id: id,
    };
    console.log("module to add", moduletoadd);
    // console.log ("module to add", moduletoadd);
    dispatch(addSubModuleforModule(moduletoadd));
    setIsModalOpen(false);
    toast.success("Sub Module Added Successfully");
  };

  //----------------------------------------  Page   -------------------------------------------------------------

  const [newDocumentData, setNewDocumentData] = useState({
    title: "",
    description: "",
  });
  const [pageValidationErrors, setPageValidationErrors] = useState({
    title: "",
    description: "",
  });
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);

  const pageList = useSelector((state) => state.GeneralPage.generalPages);
  console.log("pageList", pageList);

  const location = useLocation();

  const handlePageInputChange = (e) => {
    const { name, value } = e.target;
    setNewDocumentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePageBlur = (field) => {
    const errors = { ...validationErrors };

    if (!newDocumentData[field].trim()) {
      errors[field] = `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } is required`;
    } else {
      errors[field] = ""; // Clear the error message if the field is not empty
    }

    setPageValidationErrors(errors);
  };

  const pageValidateFields = () => {
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
    const isValid = pageValidateFields();

    if (isValid) {
      const page = {
        ...newDocumentData,
        moduleId: id,
        projectId: currentProject.id,
      };
      // Dispatch action to add new page here
      console.log("page to add", page);
      dispatch(createGeneralPage(page)); // Assuming you have a addPage action
      dispatch(getPageByModuleId(id));

      // Close Modal
      setIsModalOpen(false);
      toast.success("Page Added Successfully");
    } else {
      toast.error("Page title and body cannot be empty");
    }
  };

  //---------------------------------------- </Page>  -------------------------------------------------------------

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* breadcrumb */}
          {/* <BreadCrumb title="Teestcase" pageTitle="Module" /> */}
          <BreadCrumb
            title={currentModule ? currentModule.moduleName : "Empty"} // Update the title here
            breadcrumbItems={[
              { title: "Ants Quality", link: "/" },
              {
                title: currentProject ? currentProject.title : "Project",
                link: `/project/${currentProject?.id}`,
              },
              { title: currentModule ? currentModule.moduleName : "Module" },
            ]}
          />
          <Row>
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
                          Sub Modules
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
                          Testcases
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
                    <TabPane tabId="1" id="submodules">
                      <Col lg={12}>

                        <CardBody>
                        <Alert color="primary" className="d-flex flex-column justify-content-between">
                          <div>
                            <strong> Note- </strong> All the Submodules for{" "}
                            <b className="text-dark">
                              {currentModule?.moduleName}
                            </b>{" "}
                            module of project{" "}
                            <b className="text-dark">{currentProject?.title}</b>{" "}
                            -Are shown here!
                          </div>
                          <div className="px-3">
                            <ul>
                              <li>You can view all the testcases for this module by switching to Testcase tab.</li>
                              <li>You can view all the related pages by switching to Pages tab.</li>
                            </ul>
                          </div>
                        </Alert>
                          <Row>
                            {loadingSubmodules ? (
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
                              submoduleData.map((module) => (
                                <Col sm={10} md={3} key={module.id}>
                                  <SubModuleCard
                                    moduleName={module?.moduleName}
                                    id={module.id}
                                    parent_Module_Id={module.parent_Module_Id}
                                    onEditModule={handleEditSubModule}
                                    itHasSubModule={module.hasSubModules}
                                  />
                                </Col>
                              ))
                            )}
                          </Row>
                        </CardBody>
                      </Col>
                    </TabPane>

                    <TabPane tabId="2" id="testcase">
                      <Col lg={12}>

                        <CardBody>
                        <Alert color="primary" className="d-flex flex-column justify-content-between">
                          <div>
                            <strong> Note- </strong> All the testcases for{" "}
                            <b className="text-dark">
                              {currentModule.moduleName}
                            </b>{" "}
                            module of project{" "}
                            <b className="text-dark">{currentProject.title}</b>{" "}
                            -Are shown here!
                          </div>

                        </Alert>
                          {activeTab === "2" ? (
                            <Row>
                              {testCaseData.map((testcase) =>
                                !isAdmin ? (
                                  <Col sm={10} md={3}>
                                    <TestCaseCard
                                      title={testcase.testTitle}
                                      id={testcase.id}
                                      scenario={testcase.scenario}
                                      status={testcase.lastTestResultStatus}
                                      description={testcase.description}
                                    />
                                  </Col>
                                ) : (
                                  ""
                                )
                              )}
                              {isAdmin ? (
                                <TestCaseTable
                                  id={id}
                                  onEditTest={handleEditTestCase}
                                />
                              ) : (
                                ""
                              )}
                            </Row>
                          ) : null}
                        </CardBody>
                      </Col>
                    </TabPane>

                    <TabPane tabId="3" id="managers">
                      <Row></Row>
                    </TabPane>
                    {activeTab === "4" ? (
                      <TabPane tabId="4" id="pages">
                        <Row>
                          <Col lg={12} className="  px-4">
                            <Row
                              style={{
                                border: "1px solid #645BD0",
                                borderRadius: "10px",
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
                                    <ul className="list-group">
                                      {pageList.map((page) => (
                                        // <Link
                                        //   key={page.id} // Remember to add a unique key when mapping over elements
                                        //   className="list-group-item"
                                        //   to={`${location.pathname}#/pages/${page.id}`}
                                        // onClick={() => {
                                        //   setSelectedDocumentId(page.id);
                                        // }}
                                        // >
                                        //   {page.title}
                                        // </Link>
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
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      ))}
                                    </ul>
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
          </Row>
        </Container>
      </div>

      {activeTab === "2" ? (
        <Modal isOpen={isModalOpen} toggle={toggleModal} fullscreen>
          <ModalHeader toggle={toggleModal} className="bg-light px-5">
            <div>New Test Case for</div>
            <BreadCrumb
              breadcrumbItems={[
                {
                  title: currentProject ? currentProject.title : "Project",
                  link: "/projects",
                },
                {
                  title: currentModule
                    ? `${currentModule.moduleName}, Module`
                    : "Module",
                },
              ]}
            />
          </ModalHeader>
          <ModalBody>
            <Form className="row gx-5 gy-4 mt-5 px-4">
              <div className="col-12">
                <div className="row">
                  <div className="col-6">
                    <FormGroup>
                      <Label for="testTitle">Test Title</Label>
                      <Input
                        className={`border-0 border-bottom rounded-0 border-black shadow-none border-opacity-25 px-0 ${
                          validationErrors.testTitle ? "is-invalid" : ""
                        }`}
                        name="testTitle"
                        type="text"
                        id="testTitle"
                        placeholder="TestCase Title here..."
                        value={newTestCaseData.testTitle}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("testTitle")} // Validate on blur
                      />
                      {validationErrors.testTitle && (
                        <div className="invalid-feedback">
                          {validationErrors.testTitle}
                        </div>
                      )}
                    </FormGroup>
                  </div>
                  <div className="col-6">
                    {/* <Select
                  name="parent_Module_Id"
                  id="parent_Module_Id"

                  onChange={(selectedOption) => {
                    setSelectedParentModuleName(selectedOption ? selectedOption.label : '');
                    setSelectedParentModuleId(selectedOption ? selectedOption.value : null);
                  }}
                  // value={
                  //   isEditMode
                  //     ? { label: selectedParentModuleName, value: selectedParentModuleId }
                  //     : selectedParentModuleId
                  //       ? moduleData.find((option) => option.value === selectedParentModuleId)
                  //       : { label: "New Module", value: null }
                  // }
                  options={[
                    ...submoduleData.map((module) => ({
                      value: module.id,
                      label: module.moduleName,
                    })),
                  ]}
                /> */}
                  </div>
                </div>
              </div>
              <div className="col-6">
                <FormGroup>
                  <Label for="scenario">Scenario</Label>
                  <div
                    className={`${
                      validationErrors.scenario ? "is-invalid" : ""
                    }`}
                  >
                    <CKEditor
                      editor={ClassicEditor}
                      data={newTestCaseData.scenario}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setNewTestCaseData((prevData) => ({
                          ...prevData,
                          scenario: data,
                        }));
                      }}
                      onBlur={() => handleBlur("scenario")} // Validate on blur
                    />
                  </div>
                  {validationErrors.scenario && (
                    <div className="invalid-feedback">
                      {validationErrors.scenario}
                    </div>
                  )}
                </FormGroup>
              </div>

              <div className="col-6">
                <FormGroup>
                  <Label for="description">description</Label>
                  <div
                    className={`${
                      validationErrors.description ? "is-invalid" : ""
                    }`}
                  >
                    <CKEditor
                      editor={ClassicEditor}
                      data={newTestCaseData.description}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setNewTestCaseData((prevData) => ({
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

              <div className="col-6">
                <FormGroup>
                  <Label for="preRequisities">Pre-Requisites</Label>
                  <div
                    className={`${
                      validationErrors.preRequisities ? "is-invalid" : ""
                    }`}
                  >
                    <CKEditor
                      editor={ClassicEditor}
                      data={newTestCaseData.preRequisities}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setNewTestCaseData((prevData) => ({
                          ...prevData,
                          preRequisities: data,
                        }));
                      }}
                      onBlur={() => handleBlur("preRequisities")} // Validate on blur
                    />
                  </div>
                  {validationErrors.preRequisities && (
                    <div className="invalid-feedback">
                      {validationErrors.preRequisities}
                    </div>
                  )}
                </FormGroup>
              </div>

              <div className="col-6">
                <FormGroup>
                  <Label for="testSteps">Test Steps</Label>
                  <div
                    className={`${
                      validationErrors.testSteps ? "is-invalid" : ""
                    }`}
                  >
                    <CKEditor
                      editor={ClassicEditor}
                      data={newTestCaseData.testSteps}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setNewTestCaseData((prevData) => ({
                          ...prevData,
                          testSteps: data,
                        }));
                      }}
                      onBlur={() => handleBlur("testSteps")} // Validate on blur
                    />
                  </div>
                  {validationErrors.testSteps && (
                    <div className="invalid-feedback">
                      {validationErrors.testSteps}
                    </div>
                  )}
                </FormGroup>
              </div>

              <div className="col-6">
                <FormGroup>
                  <Label for="testData">Test Data</Label>
                  <div
                    className={`${
                      validationErrors.testData ? "is-invalid" : ""
                    }`}
                  >
                    <CKEditor
                      editor={ClassicEditor}
                      data={newTestCaseData.testData}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setNewTestCaseData((prevData) => ({
                          ...prevData,
                          testData: data,
                        }));
                      }}
                      onBlur={() => handleBlur("testData")} // Validate on blur
                    />
                  </div>
                  {validationErrors.testData && (
                    <div className="invalid-feedback">
                      {validationErrors.testData}
                    </div>
                  )}
                </FormGroup>
              </div>

              <div className="col-6">
                <FormGroup>
                  <Label for="expectedResult">Expected Result</Label>
                  <div
                    className={`${
                      validationErrors.expectedResult ? "is-invalid" : ""
                    }`}
                  >
                    <CKEditor
                      editor={ClassicEditor}
                      data={newTestCaseData.expectedResult}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setNewTestCaseData((prevData) => ({
                          ...prevData,
                          expectedResult: data,
                        }));
                      }}
                      onBlur={() => handleBlur("expectedResult")} // Validate on blur
                    />
                  </div>
                  {validationErrors.expectedResult && (
                    <div className="invalid-feedback">
                      {validationErrors.expectedResult}
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
              <Button color="primary" onClick={handleUpdateTestCase}>
                Update
              </Button>
            ) : (
              <Button color="primary" onClick={handleAddTestCase}>
                Submit
              </Button>
            )}
          </ModalFooter>
        </Modal>
      ) : activeTab == "1" ? (
        <ModuleModal
          isModalOpen={isModalOpen}
          toggleModal={toggleModal}
          id={currentProject?.id}
          isEditMode={isEditMode}
          editedData={editedSubModuleData}
          moduleData={submoduleData}
          handleAddModule={handleAddSubModule}
          handleUpdateModule={handleUpdateSubModule}
          setSelectedParentModuleName={setSelectedParentModuleName}
          setSelectedParentModuleId={setSelectedParentModuleId}
          type="submodule"
        />
      ) : activeTab == "4" ? (
        <Modal isOpen={isModalOpen} toggle={toggleModal} fullscreen>
          <div className="d-flex justify-content-center text-center align-items-center mt-2">
            <p>
              {" "}
              <span className="text-muted">New Page for </span>{" "}
              {currentModule ? currentModule.moduleName : "Empty"}
            </p>
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
                          pageValidationErrors.title ? "is-invalid" : ""
                        }`}
                        name="title"
                        type="text"
                        id="title"
                        placeholder="Page Title here..."
                        value={newDocumentData.title}
                        onChange={handlePageInputChange}
                        onBlur={() => handlePageBlur("title")} // Validate on blur
                      />
                      {pageValidationErrors.title && (
                        <div className="invalid-feedback">
                          {pageValidationErrors.title}
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
                      pageValidationErrors.description
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
                      onBlur={() => handlePageBlur("description")} // Validate on blur
                    />
                  </div>
                  {pageValidationErrors.description && (
                    <div className="invalid-feedback">
                      {pageValidationErrors.description}
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
        console.log("nothing happened")
      )}
    </React.Fragment>
  );
};

export default ModuleDetailPage;
