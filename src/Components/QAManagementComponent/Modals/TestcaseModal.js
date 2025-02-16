import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function TestcaseModal(props) {
    return(
        <Modal isOpen={isModalOpen} toggle={toggleModal} fullscreen >
        <ModalHeader toggle={toggleModal} className='bg-light px-5' >
      
          <div >New Test Case for</div>
          <BreadCrumb
                
                  breadcrumbItems={[
                    { title: currentProject ? currentProject.title :"Project", link: '/projects' },
                    { title: currentModule ?( `${currentModule.moduleName}, Module`) : "Module" },
                  ]}
                />
         
        </ModalHeader>
        <ModalBody>
          <Form className='row gx-5 gy-4 mt-5 px-4'>
            <div className="col-12">
              <div className="row">
                <div className="col-6">
                <FormGroup>
              <Label for="testTitle">Test Title</Label>
              <Input
                 className={`border-0 border-bottom rounded-0 border-black shadow-none border-opacity-25 px-0 ${validationErrors.testTitle ? 'is-invalid' : ''}`}
                name='testTitle'
                type="text"
                id="testTitle"
                placeholder='TestCase Title here...'
                value={newTestCaseData.testTitle}
                onChange={handleInputChange}
                onBlur={() => handleBlur('testTitle')} // Validate on blur
              />
              {validationErrors.testTitle && <div className="invalid-feedback">{validationErrors.testTitle}</div>}
            </FormGroup>
                </div>
              </div>
           
            </div>
            <div className="col-6">
            <FormGroup>
        <Label for="scenario">Scenario</Label>
        <div className={`${validationErrors.scenario ? 'is-invalid' : ''}`}>
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
            onBlur={() => handleBlur('scenario')} // Validate on blur
          />
        </div>
        {validationErrors.scenario && <div className="invalid-feedback">{validationErrors.scenario}</div>}
      </FormGroup>
      
            </div>
            
            <div className="col-6">
            <FormGroup>
              <Label for="description">description</Label>
              <div className={`${validationErrors.description ? 'is-invalid' : ''}`}>
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
              onBlur={() => handleBlur('description')} // Validate on blur
              />
              </div>
              {validationErrors.description && <div className="invalid-feedback">{validationErrors.description}</div>}
            </FormGroup>
            </div>
         
         <div className="col-6">
         <FormGroup >
              <Label for="preRequisities">Pre-Requisites</Label>
              <div className={`${validationErrors.preRequisities ? 'is-invalid' : ''}`}>
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
              onBlur={() => handleBlur('preRequisities')} // Validate on blur
              />
              </div>
              {validationErrors.preRequisities && <div className="invalid-feedback">{validationErrors.preRequisities}</div>}
            </FormGroup>
         </div>
           
           <div className="col-6">
      
            <FormGroup>
          <Label for="testSteps">Test Steps</Label>
          <div className={`${validationErrors.testSteps ? 'is-invalid' : ''}`}>
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
            onBlur={() => handleBlur('testSteps')} // Validate on blur
          />
          </div>
          {validationErrors.testSteps && <div className="invalid-feedback">{validationErrors.testSteps}</div>}
        </FormGroup>
           </div>
           
           <div className="col-6">
           <FormGroup>
              <Label for="testData">Test Data</Label>
              <div className={`${validationErrors.testData ? 'is-invalid' : ''}`}>
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
              onBlur={() => handleBlur('testData')} // Validate on blur
              />
              </div>
              {validationErrors.testData && <div className="invalid-feedback">{validationErrors.testData}</div>}
            </FormGroup>
           </div>
          
          <div className="col-6">
          <FormGroup>
              <Label for="expectedResult">Expected Result</Label>
              <div className={`${validationErrors.expectedResult ? 'is-invalid' : ''}`}>
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
              onBlur={() => handleBlur('expectedResult')} // Validate on blur
      
              />
              </div>
              {validationErrors.expectedResult && <div className="invalid-feedback">{validationErrors.expectedResult}</div>}
            </FormGroup>
          </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          {/* <Button color="primary" onClick={handleAddTestCase} >Submit</Button> */}
          <Button color="secondary" onClick={toggleModal}>Cancel</Button>
          {isEditMode ? (
                              <Button color="primary" onClick={handleUpdateTestCase}>Update</Button>
                          ) : (
                              <Button color="primary" onClick={handleAddTestCase}>Submit</Button>
                          )}
        </ModalFooter>
          </Modal>
    )
}
