import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getGeneralPageById, updatePageById } from "../../slices/qaManagment/GeneralPages/thunk";
import DOMPurify from "dompurify";
import { Row, Col } from "reactstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input } from "reactstrap";
import PageSkeleton from "./Skeleton/PageSkeleton";

export default function DocumentContent(props) {
  const dispatch = useDispatch();

  const createMarkup = (html) => {
    return { __html: DOMPurify.sanitize(html) };
  };

  const documentData = useSelector(
    (state) => state.GeneralPage.documentContent
  );
  const isLoading = useSelector((state) => state.GeneralPage.loading);

  useEffect(() => {
    dispatch(getGeneralPageById(props.id));
  }, [props.id]);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [newDocumentData, setNewDocumentData] = useState({
    title: "",
    description: "",

  });
  const [validationErrors, setValidationErrors] = useState({});

  const toggleEditModal = () => {
    setEditModalOpen(!isEditModalOpen);
    if (!isEditModalOpen) {
      setNewDocumentData({
        title: documentData.title,
        description: documentData.description,
        projectId: documentData.projectId,
        moduleId: documentData.moduleId,
        id: props.id,
      });
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewDocumentData({
  //     ...newDocumentData,
  //     [name]: value,
  //   });
  // };
  const handleInputChange = (e) => {
    const { value } = e.target;


    setNewDocumentData((prevData) => ({
      ...prevData,
      title: value,
    }));



  };





  const validateForm = () => {
    const errors = {};
    if (!newDocumentData.title) {
      errors.title = "Title is required";
    }
    if (!newDocumentData.description.trim()) {
      errors.description = "Description is required";
    }
    return errors;
  };

  const handleSaveClick = () => {
    const errors = validateForm();
    console.log('input change', newDocumentData)
    if (Object.keys(errors).length === 0) {
      // Save the edited data
      dispatch(updatePageById(props.id, newDocumentData));
      toggleEditModal();
    } else {
      setValidationErrors(errors);
    }
  };

  return (
    <>
      <Row className="py-3 px-3" style={{ background: "#D8D5FE", borderRadius: "0px 10px 0px 0px" }}>
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">{documentData.title}</h6>
          <Button className="btn btn-sm btn-primary mr-2" onClick={toggleEditModal}>
            Edit
          </Button>
        </div>
      </Row>
    {isLoading ? <div className="text-center"style={{ height: "500px", overflowY: "scroll", scrollbarWidth: "thin", scrollbarColor: "transparent transparent" }}><PageSkeleton/></div> :( <Row style={{ height: "500px", overflowY: "scroll", scrollbarWidth: "thin", scrollbarColor: "transparent transparent" }}>
        <Col sm={12} className="p-0">
          {props.id !== null ? (
            <div className="p-4">
              <div key={props.id}>
                <div dangerouslySetInnerHTML={createMarkup(documentData.description)} />
              </div>
            </div>
          ) : (
            ""
          )}
        </Col>
      </Row>) }


      <Modal isOpen={isEditModalOpen} toggle={toggleEditModal} fullscreen>
        <ModalBody>
          <Form className="row">
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <FormGroup className="mt-3">
                    <Input
                      className={`border-0 border-bottom rounded-0 border-black shadow-none border-opacity-25 px-0 ${validationErrors.title ? "is-invalid" : ""}`}
                      name="title"
                      type="text"
                      id="title"
                      placeholder="Page Title here..."
                      value={newDocumentData.title}
                      onChange={handleInputChange}
                    />
                    {validationErrors.title && <div className="invalid-feedback">{validationErrors.title}</div>}
                  </FormGroup>
                </div>
              </div>
            </div>
            <div className="col-12 px-0">
              <FormGroup>
                <div className={`${validationErrors.description ? "is-invalid pageEditor" : "pageEditor"}`}>
                  <CKEditor
                    editor={ClassicEditor}
                    data={newDocumentData.description}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setNewDocumentData((prevData) => ({ ...prevData, description: data }));
                    }}
                  />
                </div>
                {validationErrors.description && <div className="invalid-feedback">{validationErrors.description}</div>}
              </FormGroup>
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={toggleEditModal}>
            Cancel
          </Button>
          <Button color="success" onClick={handleSaveClick}>
            Save
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

