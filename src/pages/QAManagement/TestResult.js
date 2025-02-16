import React, {useRef} from "react"
import { Container, Row, Col, Card, CardBody, CardHeader, Form, Button,Input,Label } from "reactstrap"
import BreadCrumb from "../../../src/Components/Common/BreadCrumb"
import { useEffect,useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getallTestCases } from "../../slices/qaManagment/Test/thunk"
import { useParams } from "react-router-dom"
import DOMPurify from 'dompurify';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { addTestCaseResult } from "../../slices/qaManagment/TestResult/thunk";
import { getLoggedInUser } from "../../helpers/fakebackend_helper"
import toast from 'react-hot-toast';

import { getTestResultForTestCase } from "../../slices/qaManagment/TestResult/thunk"
import { getModules } from "../../slices/qaManagment/module/thunk"
import {getProjects} from "../../slices/qaManagment/project/thunk"
import { useDropzone } from 'react-dropzone';
import Dropzone from 'react-dropzone';
import ModalImage from "react-modal-image";





export default function TestResult(){
    const editorRef = useRef();
    const notify = () => toast('Here is your toast.');
    const[isHovered, setIsHovered] = useState(false);
    const auth = getLoggedInUser();
    const isAdmin = true;//auth.associatedRoles.includes('SuperAdmin') || auth.associatedRoles.includes('SystemAdmin');
    const dispatch = useDispatch();
    const {id} = useParams();
    const testCaseData = useSelector(state => state.TestCase?.testcase);
    const testResults = useSelector(state => state.TestResult.testresult);
    const modules = useSelector(state => state.Module?.module);
    const projects = useSelector(state => state.Project?.project);
    console.log("testResults:", testResults);
    const [file, setFile] = useState();

    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
  
    // ... other code ...
  
    // Add this function to open the image preview
    const openImagePreview = (imageSrc) => {
      setSelectedImage(imageSrc);
      setIsImagePreviewOpen(true);
    };
  
    // Add this function to close the image preview
    const closeImagePreview = () => {
      setSelectedImage(null);
      setIsImagePreviewOpen(false);
    };
    

    const historyCss = {
        border:"1px solid  #7D74DD ",
        backgroundColor: "#F2F1FB",
        borderRadius: '0px',
    }
    const buttoncss={
        border:"1px solid  #7D74DD ",
        backgroundColor: isHovered ? "#7D74DD" : "#F2F1FB",
        borderRadius: '0px',
        color: isHovered ? '#FFFFFF' : '#4D44B5',
        transition: "transform 0.3s",
    }

    // const imageSource = (path) => 'http://qatestapi.ants.com.np' + path.replace('~/', '/');

    const imageSource = (path) => {
        if (path) {
          return 'http://qatestapi.ants.com.np' + path.replace('~/', '/');
        }
        // Handle the case where path is undefined
        return '';
      };
      

    
 

    useEffect(() => {
        //fetch all the testcases for the module
        dispatch(getallTestCases());
        dispatch(getTestResultForTestCase(id));
        dispatch(getModules());
        dispatch(getProjects())
      },[dispatch])




      const currentTestCase = testCaseData?.find(testcase => testcase.id === parseInt(id));

    //current Module
      const currentModule = modules?.find(module => module.id === parseInt(currentTestCase?.moduleId));

      const currentProject = projects?.find(project => project.id === parseInt(currentModule?.projectId));
      console.log("currentProject:", currentProject);



        console.log("currentTestcase:", currentTestCase);
        // console.log("currentTestCasetitle:", currentTestCase? currentTestCase?.testTitle : "");
        // console.log("currentTestCasetitle:", currentTestCase?.scenario );

    const createMarkup = (html) => {
        return { __html: DOMPurify.sanitize(html) };
      };

      const [newTestResult, setNewTestResult] = useState({
        testedByUser: '',       // User ID (you might get this from your authentication system)
        actualResult: '',   // Actual result text
        status: false,
        File : null

    });

    const [selectedFiles, setselectedFiles] = useState([]);

    function handleAcceptedFiles(file) {
        setFile(file[0]);
      }

     

      function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
      }

      const [validationErrors, setValidationErrors] = useState({
        actualResult: '',
      });
    
      const validateFields = () => {
        const errors = {};
        let isValid = true;

    
        if (!newTestResult.actualResult.trim()) {
          errors.actualResult = 'Result is required';
          isValid = false;
        }

        setValidationErrors(errors);

        return (isValid);
    }

    const handleBlur = (field) => {
        const errors = { ...validationErrors };
    
        if (!newTestResult[field].trim()) {
          errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else {
          errors[field] = ''; // Clear the error message if the field is not empty
        }
    
        setValidationErrors(errors);
      };
      




    const handleSubmitResult = () => {
        // Prepare the new test result object
        if (validateFields()) {
   
        const createdTestResult = {
            testCaseId: id, // The ID of the current test case
            // userId: auth.id,
            testedByUser: auth.firstName, // The ID of the current user
            actualResult: newTestResult.actualResult,
            status: newTestResult.status,
            File : file
        };
        console.log("createdTestResult:", createdTestResult);

        // Dispatch an action to create the new test result
        dispatch(addTestCaseResult(id, createdTestResult)); // Replace with your action

        // Reset the new test result data to empty or default values
        setNewTestResult({
            testedByUser: '',
            actualResult: '',
            status: false,
            File : ''
            
        });
        setFile(null);
        //consolelog testd on
        console.log("testedOn:", newTestResult.testedOn);

        if (editorRef.current) {
            editorRef.current.setData("");
        }
        toast.success('Test Result Submitted Successfully');
        }
        else{
            toast.error("Actual Result can't be empty");
          }
    
    };

    const sortedTestResults = [...testResults].sort((a, b) => {
        const dateA = new Date(a.testedOn);
        const dateB = new Date(b.testedOn);
        return dateB - dateA; // Sort in descending order (latest first)
      });

      console.log("sortedTestResults:", sortedTestResults);
   

    return(
        <React.Fragment>
        <div className="page-content">               
            <Container fluid>
                {/* breadcrumb */}
                <BreadCrumb
           
            breadcrumbItems={[
              { title: 'Ants Quality', link: '/' },
              { title: `${currentProject?.title}`, link: `/project/${currentProject?.id}` },
              { title: `${currentModule?.moduleName}`, link: `/project/module/${currentModule?.id}` },
              { title: `${currentTestCase?.testTitle}` },
            ]} />

            <Row >
                <Col lg={8}>
                        <Card>
                            <CardHeader>
                                <h5 className="text-center pb-0" style={{color:'#4D44B5'}}> {currentTestCase?.testTitle && currentTestCase.testTitle.toUpperCase()}</h5>
                            </CardHeader>
                            <CardBody>
                                <Col lg={12} >
                                        <Form className="px-4 ">
                                            <div className="row gx-5 mt-5">
                                                        <div className="col-6 bordered">
                                                            <div className="Scenario" style={{borderRight:"1px solid #D9d9d9"}}>
                                                                <h5 className="fs-16">Scenario</h5>
                                                                <div className="px-3 text-body-secondary" dangerouslySetInnerHTML={createMarkup(currentTestCase?.scenario)}>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                        <div className="TestSteps">
                                                                <h5 className="fs-16">Test Steps</h5>
                                                                <div className="px-3 text-body-secondary" dangerouslySetInnerHTML={createMarkup(currentTestCase?.testSteps)} ></div>
                                                            </div>
                                                        </div>
                                            </div>
                                            <div className="row gx-5 mt-5">
                                                        <div className="col-6">
                                                            <div className="Description" style={{borderRight:"1px solid #D9d9d9"}}>
                                                                <h5 className="fs-16">Description</h5>
                                                                <div className="px-3 text-body-secondary" dangerouslySetInnerHTML={createMarkup(currentTestCase?.description)} ></div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="testData">
                                                                <h5 className="fs-16">Test Data</h5>
                                                                <div className="px-3 text-body-secondary" dangerouslySetInnerHTML={createMarkup(currentTestCase?.testData)} ></div>
                                                            </div>
                                                        </div>
                                            </div>
                                            <div className="row gx-5 mt-5">
                                                        <div className="col-6">
                                                            <div className="Pre-requisite" style={{borderRight:"1px solid #D9d9d9"}}>
                                                                <h5 className="fs-16">Pre-requisite</h5>
                                                                <div className="px-3 text-body-secondary" dangerouslySetInnerHTML={createMarkup(currentTestCase?.preRequisities)} ></div>
                                                            </div>
                                                        </div>
                                                        <div className="col-6">
                                                            <div className="Expected Result">
                                                                <h5 className="fs-16">Expected Result</h5>
                                                                <div className="px-3 text-body-secondary" dangerouslySetInnerHTML={createMarkup(currentTestCase?.expectedResult)} ></div>
                                                            </div>
                                                        </div>
                                                        
                                            </div>           
                                         
                                                {!isAdmin ?
                                                <div className="row mt-5 justify-content-end">
                                                <div className="col-12">
                                                            <h5 className="fs-16">Actual Result</h5>
                                                            <div className="form-check form-switch form-switch-success mb-3">
                                                                <Label className={`form-check-label shadow-none ${newTestResult.status? 'text-success':'text-danger'}`} for="SwitchCheck5">{ newTestResult.status ?'Test Successful !':'Test Failed !'}</Label>
                                                                <Input className={`form-check-input status-button shadow-none ${newTestResult.status? 'bg-success':' border-danger'}`} type="checkbox" role="switch" id="SwitchCheck5"
                                                                checked={newTestResult.status} // Set checked attribute based on status value
                                                                onChange={() => setNewTestResult((prevState) => ({ ...prevState, status: !prevState.status }))} />
                                                            
                                                            </div>
                                                            <div>
                                                                {newTestResult.status ? '': (<><Dropzone
                                                                    onDrop={acceptedFiles => {
                                                                    handleAcceptedFiles(acceptedFiles);
                                                                    }}
                                                                    maxFiles={1}
                                                                >
                                                                    {({ getRootProps, getInputProps }) => (
                                                                    <div className="dropzone dz-clickable">
                                                                        <div
                                                                        className="dz-message needsclick"
                                                                        {...getRootProps()}
                                                                        >
                                                                        <input {...getInputProps()} />
                                                                        <div className="mb-3">
                                                                            <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                                                        </div>
                                                                        <h4>Drop files here or click to upload.</h4>
                                                                        </div>
                                                                    </div>
                                                                    )}
                                                                </Dropzone>
                                                                <div className="list-unstyled mb-0" id="file-previews">
                                                                    {file && (
                                                                        <Card
                                                                            className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                                                        >
                                                                            <div className="p-2">
                                                                                <Row className="align-items-center">
                                                                                    <Col className="col-auto">
                                                                                        <img
                                                                                            data-dz-thumbnail=""
                                                                                            height="80"
                                                                                            className="avatar-sm rounded bg-light"
                                                                                            alt={file.name}
                                                                                            src={URL.createObjectURL(file)} // Display the selected file using URL.createObjectURL
                                                                                        />
                                                                                    </Col>
                                                                                    <Col>
                                                                                        <p className="text-muted font-weight-bold">
                                                                                            {file.name}
                                                                                        </p>
                                                                                        <p className="mb-0">
                                                                                            <strong>{formatBytes(file.size)}</strong>
                                                                                        </p>
                                                                                    </Col>
                                                                                </Row>
                                                                            </div>
                                                                        </Card>
                                                                    )}
                                                                </div>
                                                                </>)
                                                                }
                                                                
                                                            </div>
                                                            <div className={`${validationErrors.actualResult ? 'is-invalid' : ''}`}>
                                                            <CKEditor
                                                            editor={ClassicEditor}
                                                            data={newTestResult.actualResult} // Set initial content
                                                            onChange={(event, editor) => {
                                                                const data = editor.getData();
                                                                setNewTestResult((prevState) => ({ ...prevState, actualResult: data }));
                                                            }}
                                                            onBlur={() => handleBlur('actualResult')} // Validate on blur
                                                        />
                                                        </div>
                                                        {validationErrors.actualResult && <div className="invalid-feedback">{validationErrors.actualResult}</div>}

                                                        </div>
                                                          <div className="col mt-3">
                                                          <Button color="primary w-100" 
                                                              style={buttoncss} 
                                                              onMouseEnter={() => setIsHovered(true)}
                                                              onMouseLeave={() => setIsHovered(false)}
                                                              onClick={handleSubmitResult}>Submit Result
                                                              
                                                          </Button>
                                                     </div>
                                                    </div>
                                                    : ''
                                                   }
                                        </Form>
                                </Col>
                            </CardBody>
                        </Card>
                </Col>
                <Col lg={4} style={{
                maxHeight: '530px',
                minHeight: '330px',
                overflowY: 'scroll',
                border: '1px solid #7D74DD',
                backgroundColor: '#F2F1FB',
                borderRadius: '3px',
                padding: '0',
                }}>
                    <Card className="mb-0 bg-transparent border-0" style={{boxShadow:'none'}} >
                        <CardHeader className="bg-transparent border-0">
                                <h5 className="text-center pb-0" style={{color:"#4D44B5"}} > Test History</h5>
                        </CardHeader>
                            <CardBody className="border-0">
                            <Row>
                                {sortedTestResults.length === 0 ? (
                                    <div className="text-start">No test results found. Add a result to see the changes.</div>
                                ) : (
                                    sortedTestResults.map((testResult) => (
                                    <Col lg={12} className="mt-3" key={testResult?.id}>
                                        <div className={`status ${testResult.status ? "text-success" : "text-danger"}`}>
                                        {testResult.status ? "Success" : "Fail"}
                                        </div>
                                        <div className="d-flex">
                                           
                                                {testResult?.document?.filePath !== null ? (
                                                <div className="me-3" style={{ width: "60px", height: "60px !important", maxHeight:'60px', minHeight:'60px', objectFit:'contain', overflow:'hidden' }}>
                                                <ModalImage
                                                small={imageSource(testResult?.document?.filePath)}
                                                large={imageSource(testResult?.document?.filePath)}
                                                alt={testResult?.document?.fileName}
                                                className="img-fluid "
                                                style={{ width: "60px", height: "60px", maxHeight:'60px', minHeight:'60px', objectFit:'contain',  }}
                                                />
                                                </div>
                                                ) : (
                                                    ""
                                                )}
                                        
                                        <div dangerouslySetInnerHTML={createMarkup(testResult?.actualResult)}></div>
                                        </div>

                                        <div className="fs-10 d-flex justify-content-end">
                                        <span className="text-muted">{testResult?.testedByUser == null ? "null" : testResult?.testedByUser}</span>
                                        <span className="text-muted ps-2">{testResult?.testedOn}</span>
                                        </div>
                                        <hr className="p-0 m-0" />
                                    </Col>
                                    ))
                                )}
                                </Row>

                            </CardBody>
                        </Card>
                </Col>
            </Row>
                
    
            </Container>
        </div>
        {isImagePreviewOpen && selectedImage && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Image Preview</h5>
                <button type="button" className="btn-close" onClick={closeImagePreview}></button>
              </div>
              <div className="modal-body">
                <img src={selectedImage} alt="Image Preview" className="img-fluid" />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeImagePreview}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        
    </React.Fragment>
    )
 }