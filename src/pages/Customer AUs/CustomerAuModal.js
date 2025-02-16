import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalHeader, Col, Label } from "reactstrap";
import Select from "react-select";
import { useFormik } from "formik";

const CustomerAuModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [customerType, setCustomerType] = useState([]);
  const [isCustomerType, setIsCustomerType] = useState(null);

  useEffect(() => {
    const fetchselectData = async () => {
      try {
        const fetchedcustomertype = await CustomerTypeServices.getList();
        setCustomerType(fetchedcustomertype);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchselectData();
  }, []);

  const customeroptions = customerType.map((vendor) => ({
    value: vendor.id,
    label: vendor.title + " " + vendor.description, // Corrected concatenation
  }));

  const handlecstomertypeChange = (selectedOption) => {
    setIsCustomerType(selectedOption);
    formik.setFieldValue("customerTypeId", selectedOption?.value || null);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div>
      <Modal isOpen={showModal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}> Customer Type Editor</ModalHeader>
        <ModalBody>
          <form>
            <div className="mb-3">
              <Label for="  countryId" sm={2}>
                Customer Type:
              </Label>
              <Col sm={4}>
                <Select
                  name="customerTypeId"
                  id="customerTypeId"
                  value={isCustomerType}
                  onChange={handlecstomertypeChange}
                  options={customeroptions}
                />
                {/* {formik.touched.customerTypeId && formik.errors.customerTypeId && (
                                    <div className="invalid-feedback">
                                        {formik.errors.customerTypeId}
                                    </div>
                                )} */}
              </Col>
            </div>
            {/* Add other fields as needed */}
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default CustomerAuModal;
