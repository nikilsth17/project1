import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Label,
  Input,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import SuburbService from "../../../services/SuburbServices/SuburbService";
import toast from "react-hot-toast";

const SuburbForm = ({
  isOpen,
  toggle,
  suburbToEdit,
  onRefresh,
  setSuburbData,
  suburbData,
  fetchSuburb,
}) => {
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: suburbToEdit?.name || "",
      status: suburbToEdit?.status ?? 1, // Default to true with proper boolean
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Suburb name is required"),
      status: Yup.boolean().required("Status is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        if (suburbToEdit) {
          const response = await SuburbService.update(suburbToEdit.id, values);
          setSuburbData(
            suburbData.map((pkg) =>
              pkg.id === suburbToEdit.id ? response.data : pkg
            )
          );
          fetchSuburb();
          toast.success("Suburb updated successfully");
        } else {
          console.log("Creating new suburb with values:", values); // Debug log
          const response = await SuburbService.create(values);
          setSuburbData([...suburbData, response.data]);
          toast.success("Suburb created successfully");
        }
        toggle();
      } catch (error) {
        console.error("Error saving suburb:", error); // Enhanced error logging
        toast.error("An error occurred while saving the suburb");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (suburbToEdit) {
      formik.setValues({
        name: suburbToEdit.name,
        status: suburbToEdit.status ?? 1,
      });
    } else {
      formik.resetForm({
        values: {
          name: "",
          status: 1, // Set default value for new suburbs
        },
      });
    }
  }, [suburbToEdit]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
  }, [isOpen]);
  // Custom handler for checkbox change
  const handleStatusChange = (e) => {
    // Get the checked value from the event
    const isChecked = e.target.checked;

    formik.setFieldValue("status", isChecked);
  };
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {suburbToEdit ? "Edit Suburb" : "Add Suburb"}
      </ModalHeader>
      <ModalBody>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-floating mb-3">
            <Input
              id="name"
              type="text"
              name="name"
              placeholder="Suburb Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`form-control ${
                formik.errors.name && formik.touched.name ? "is-invalid" : ""
              }`}
            />
            <Label for="name">
              Suburb Name <span className="text-danger">*</span>
            </Label>
            {formik.errors.name && formik.touched.name && (
              <div className="invalid-feedback">{formik.errors.name}</div>
            )}
          </div>

          <div className="form-check form-switch mb-3">
            <Input
              type="checkbox"
              id="flexSwitchCheckDefault"
              name="status"
              className="form-check-input"
              checked={formik.values.status}
              onChange={handleStatusChange} // Using custom handler
            />
          </div>

          <Button type="submit" color="success" disabled={loading}>
            {suburbToEdit ? "Update" : "Create"}
          </Button>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default SuburbForm;
