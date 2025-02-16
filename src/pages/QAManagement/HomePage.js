import React from 'react'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col, Input, Button, Container, InputGroup, Card, CardBody, CardHeader,
  Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Label
} from 'reactstrap';
import ProjectListCard from '../../Components/QAManagementComponent/Cards/ProjectListCard';

import BreadCrumb from '../../Components/Common/BreadCrumb';
import { getLoggedInUser } from '../../helpers/fakebackend_helper';
import FeatherIcon from 'feather-icons-react';
import { useDispatch,useSelector } from 'react-redux';
import { getProjects, updateProjectByID } from '../../slices/qaManagment/project/thunk';
import { createProject } from '../../slices/qaManagment/project/thunk';
import { useEffect,useState } from 'react';
import toast from 'react-hot-toast';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import SkeletonCard from '../../Components/QAManagementComponent/Skeleton/CardSkeleton';

const HomePage = () => {

 const dispatch= useDispatch();

  const projects = useSelector((state) => state.Project.project);
  const loading = useSelector((state) => state.Project.loading);


  console.log("projects:", projects);

  const authUser = getLoggedInUser();
  const isAdmin = true;//authUser?.associatedRoles?.includes('SuperAdmin') || authUser?.associatedRoles?.includes('SystemAdmin');


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // New state for editing mode
  const [editedProject, setEditedProject] = useState(null); // New state for edited user

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setIsEditMode(false); // Reset editing mode when the modal is closed
    setEditedProject(null); // Reset edited user when the modal is closed

  };


 const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    deadline: Yup.date().required('Deadline is required'),
  });

  const handleAddProject = (values) => {
    const newProject = {
      ...values,
    };

    console.log("to add", newProject);
    dispatch(createProject(newProject));
    setIsModalOpen(false);
    toast.success('New Project Successfully Created');
  };

  const handleEditProject = (project) => {
    setIsModalOpen(true);
    setIsEditMode(true);
    console.log("editedProject",project)
    const formattedDeadline = project.deadline.split('T')[0];
    setEditedProject({
      id: project.id,
      ...project,
      deadline: formattedDeadline,
    });

  }

  const handleUpdateProject = (values) => {
    if (editedProject) {
      const updatedProject = {
        ...editedProject,
        ...values,
      };
    }

    // Dispatch action to update project
    dispatch(updateProjectByID(editedProject.id, values));
    //close model
    setIsModalOpen(false);
    setEditedProject(null); // Reset edited project after update
    toast.success("Project Data Updated Successfully");
  }

  useEffect(() => {
    // Fetch users when the component mounts
    console.log("Checking", process.env.REACT_APP_BASE_API_URL)
    dispatch(getProjects());
  }, [dispatch]);

  return (
    <React.Fragment>
    <div className="page-content">
        <Container fluid>
            {/* breadcrumb */}
            <BreadCrumb title="Projects" pageTitle="Ants Quality" />

            <Col lg={12}>
                        <Card>
                            <CardHeader>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="card-title mb-0">Project List</h5>
                                    {isAdmin ? <div className='p-1 rounded-1' onClick={toggleModal} style={{backgroundColor:"#4D44B5", color:"white",cursor:"pointer"}}> <FeatherIcon icon="plus"/></div> : null}
                                </div>
                            </CardHeader>
                            {/* <CardBody>
                            <Row>
                            {projects.map((project) => (
                              <Col sm={10} md={3} key={project.id}>
                                <ProjectListCard
                                  title={project.title}
                                  Deadline={(project.deadline)}
                                  id={project.id}
                                  onEditProject={handleEditProject}
                                />
                              </Col>
                            ))}

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

                          </Row>

                            </CardBody> */}
                            <CardBody>
  <Row>
    {loading ? (
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
      projects.map((project) => (
        <Col sm={10} md={3} key={project.id}>
          <ProjectListCard
            title={project.title}
            Deadline={project.deadline}
            id={project.id}
            onEditProject={handleEditProject}
          />
        </Col>
      ))
    )}
  </Row>
</CardBody>

                        </Card>
                    </Col>
        </Container>
    </div>
    <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {isEditMode ? (
            <div className="text-primary">Edit Project</div>
          ) : (
            <div className="text-primary">Add New Project</div>
          )}
        </ModalHeader>
        <ModalBody>
          <Formik

            initialValues={editedProject ? { // Conditionally define initialValues
              id: editedProject ? editedProject.id :'',
              title: editedProject ? editedProject.title:'',
              deadline: editedProject ? editedProject.deadline:'',
            } : {
              title: editedProject?editedProject.title:'',
              deadline: editedProject?editedProject.deadline:'',
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              if (isEditMode) {
                handleUpdateProject(values);
              } else {
                handleAddProject(values);
              }
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <FormGroup>
                  <Label for="title">Project Title</Label>
                  <Field
                    name="title"
                    type="text"
                    id="title"
                    className={`form-control ${
                      touched.title && errors.title ? 'is-invalid' : ''
                    }`}
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="invalid-feedback"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="deadline">Deadline</Label>
                  <Field
                    name="deadline"
                    type="date"
                    id="deadline"
                    className={`form-control ${
                      touched.deadline && errors.deadline ? 'is-invalid' : ''
                    }`}
                  />
                  <ErrorMessage
                    name="deadline"
                    component="div"
                    className="invalid-feedback"
                  />
                </FormGroup>
                <ModalFooter>
                  {isEditMode ? (
                    <Button color="primary" type="submit">
                      Update
                    </Button>
                  ) : (
                    <Button color="primary" type="submit">
                      Submit
                    </Button>
                  )}
                  <Button color="secondary" onClick={toggleModal}>
                    Cancel
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>

</React.Fragment>

  )
}

export default HomePage;