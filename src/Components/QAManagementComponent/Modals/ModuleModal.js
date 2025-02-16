import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Button,
} from 'reactstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';

const ModuleModal = ({
  isModalOpen,
  toggleModal,
  isEditMode,
  editedData,
  selectedParentModuleId,
  selectedParentModuleName,
  moduleData,
  handleAddModule,
  handleUpdateModule,
  setSelectedParentModuleName,
  setSelectedParentModuleId,
  id,
  type
}) => {
  const validationSchema = Yup.object().shape({
    moduleName: Yup.string().required('Module Name is required'),
    parent_Module_Id: Yup.string().nullable(),
  });




  return (
    <Modal isOpen={isModalOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>
        {isEditMode ? <div className='text-primary'>Edit Module</div> : <div className='text-primary'>Add New Module</div>}
      </ModalHeader>
      <ModalBody>
        <Formik
               initialValues={editedData ? { // Conditionally define initialValues
                id: editedData ? editedData?.id :'',
                projectId: id,
                moduleName: editedData ? editedData.moduleName:'',
                parent_Module_Id: selectedParentModuleId || null,
    
              } : {
                projectId: id,
                moduleName: editedData?editedData.moduleName:'', 
              }}
          
          validationSchema={validationSchema}
          onSubmit={(values) => {
            if (isEditMode) {
              handleUpdateModule(values);
            } else {
              // Add the selectedModuleId and  parent_Module_Id to the values object
              handleAddModule({
                ...values,
                 parent_Module_Id: selectedParentModuleId,
              });
            }
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <FormGroup>
                <Label for="moduleName">Module Name</Label>
                <Field
                  name="moduleName"
                  type="text"
                  id="moduleName"
                  className={`form-control ${
                    touched.moduleName && errors.moduleName ? 'is-invalid' : ''
                  }`}
                />
                <ErrorMessage
                  name="moduleName"
                  component="div"
                  className="invalid-feedback"
                />
              </FormGroup>

            {!isEditMode && type!=='submodule' ? (
            <FormGroup>
                <Label for="parent_Module_Id">Module Type</Label>
                <Select
                  name="parent_Module_Id"
                  id="parent_Module_Id"
                  className={` ${
                    touched.parent_Module_Id && errors.parent_Module_Id ? 'is-invalid' : ''
                  }`}
                  onChange={(selectedOption) => {
                    setSelectedParentModuleName(selectedOption ? selectedOption.label : '');
                    setSelectedParentModuleId(selectedOption ? selectedOption.value : null);
                  }}
                  value={
                    isEditMode
                      ? { label: selectedParentModuleName, value: selectedParentModuleId }
                      : selectedParentModuleId
                        ? moduleData.find((option) => option.value === selectedParentModuleId)
                        : { label: "New Module", value: null }
                  }
                  options={[
                    ...moduleData.map((module) => ({
                      value: module.id,
                      label: module.moduleName,
                    })),
                  ]}
                />
                <ErrorMessage
                  name="parent_Module_Id"
                  component="div"
                  className="invalid-feedback"
                />
              </FormGroup>) :''
            }
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
  );
};

export default ModuleModal;
