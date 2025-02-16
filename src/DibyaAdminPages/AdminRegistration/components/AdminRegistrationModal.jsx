import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";
import {
  Button,
  Col,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import AuthServices from "../../../services/DibyaServices/AuthServices/Auth.services";
import toast from "react-hot-toast";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import RegisterValidation from "../../../validation/RegisterAdmin/RegisterValidation";

const AdminRegistrationModal = ({
  isOpen,
  toggleModal,
  adminLoading,
  isEdit,
  editValues,
  setIsEdit,
  fetchAdminList,
}) => {
  const [roles, setRoles] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const response = await AuthServices.getAuthRoles();
        setRoles(response);
      } catch (error) {
        console.log("🚀 ~ error:", error);
      }
    })();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: isEdit ? editValues?.userName : "",
      password: "",
      confirmPassword: "",
      emailAddress: isEdit ? editValues?.email : "",
      phoneNumber: isEdit ? editValues?.phoneNumber : "",
      address: isEdit ? editValues.address : "",
      roles: [
        {
          id: "",
          name: "",
          normalizedName: "",
          concurrencyStamp: "",
        },
      ],
    },
    validationSchema: RegisterValidation,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        if (isEdit) {
          await AuthServices.updateAdmin(editValues?.id, {
            ...values,
            email: values.emailAddress,
            roles: roles,
          });
          toast.success("Admin Edited successfully!");
        } else {
          await AuthServices.registerAdmin({
            ...values,
            roles: roles,
          });
          toast.success("Admin created successfully!");
        }
        setLoading(false);
        fetchAdminList();
        toggleModal();
      } catch (error) {
        console.log("🚀 ~ onSubmit:async ~ error:", error);
        toast.error(error.response.data);
        setLoading(false);
      }
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      toggle={() => {
        setIsEdit(false);
        toggleModal();
      }}
    >
      <ModalHeader
        onClick={() => {
          setIsEdit(false);
          toggleModal();
        }}
      >
        {isEdit ? "Edit Admin" : "Admin Registration"}
      </ModalHeader>
      <form onSubmit={formik.handleSubmit}>
        <ModalBody>
          <CustomInput
            label="Username"
            type="text"
            placeholder="User Name"
            value={formik.values.username}
            name="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            invalid={formik.touched.username && formik.errors.username}
            errors={formik.errors.username}
          />
          {/* <FormGroup>
            <Label className="mb-0">
              Username:<span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              placeholder="User Name"
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={formik.touched.username && formik.errors.username}
              // value={createdDate}
              // onChange={(e) => {
              //   setCreatedDate(e.target.value);
              // }}
            />
            {formik.touched.username && formik.errors.username && (
              <FormFeedback type="invalid">
                {formik.errors.username}
              </FormFeedback>
            )}
          </FormGroup> */}
          <Row>
            <Col>
              <FormGroup>
                <Label className="mb-0">
                  Email:<span className="text-danger">*</span>
                </Label>
                <Input
                  type="email"
                  name="emailAddress"
                  value={formik.values.emailAddress}
                  placeholder="Email Address"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={
                    formik.touched.emailAddress && formik.errors.emailAddress
                  }
                  // value={createdDate}
                  // onChange={(e) => {
                  //   setCreatedDate(e.target.value);
                  // }}
                />
                {formik.touched.emailAddress && formik.errors.emailAddress && (
                  <FormFeedback type="invalid">
                    {formik.errors.emailAddress}
                  </FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label className="mb-0">
                  Phone Number:<span className="text-danger">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                  }
                  // value={createdDate}
                  // onChange={(e) => {
                  //   setCreatedDate(e.target.value);
                  // }}
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <FormFeedback type="invalid">
                    {formik.errors.phoneNumber}
                  </FormFeedback>
                )}
              </FormGroup>{" "}
            </Col>
          </Row>

          <FormGroup>
            <Label className="mb-0">
              Address:<span className="text-danger">*</span>
            </Label>
            <Input
              id="address"
              name="address"
              value={formik.values.address}
              placeholder="Address"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              invalid={formik.touched.address && formik.errors.address}
              // value={createdDate}
              // onChange={(e) => {
              //   setCreatedDate(e.target.value);
              // }}
            />
            {formik.touched.address && formik.errors.address && (
              <FormFeedback type="invalid">
                {formik.errors.address}
              </FormFeedback>
            )}
          </FormGroup>
          <Row>
            <Col>
              <FormGroup>
                <Label className="mb-0">
                  Password:<span className="text-danger">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.password && formik.errors.password}
                  // value={createdDate}
                  // onChange={(e) => {
                  //   setCreatedDate(e.target.value);
                  // }}
                />
                {formik.touched.password && formik.errors.password && (
                  <FormFeedback type="invalid">
                    {formik.errors.password}
                  </FormFeedback>
                )}
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label className="mb-0">
                  Confirm Password:<span className="text-danger">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  // value={createdDate}
                  // onChange={(e) => {
                  //   setCreatedDate(e.target.value);
                  // }}
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <FormFeedback type="invalid">
                      {formik.errors.confirmPassword}
                    </FormFeedback>
                  )}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" type="submit">
            {adminLoading && <Spinner size="sm" className="me-2" />}
            {adminLoading ? "Saving..." : "Save"}
          </Button>
          <Button
            color="danger"
            onClick={() => {
              setIsEdit(false);
              formik.resetForm();
              toggleModal();
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default AdminRegistrationModal;
