import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "reactstrap";
import Dropzone from "react-dropzone";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const FileDropzone = ({
  selectedFiles,
  setSelectedFiles,
  formik,
  existingImage,
}) => {
  console.log("🚀 ~ existingImage:", existingImage);
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  // // Initialize with existing image if available
  // useEffect(() => {
  //   if (existingImage && selectedFiles.length === 0) {
  //     setSelectedFiles([
  //       {
  //         preview: existingImage,
  //         // name: "Current Image",
  //         payload: null,
  //         formattedSize: "",
  //         isExisting: true,
  //       },
  //     ]);
  //   }
  // }, [existingImage]);

  // Reset files when modal opens/closes or existingImage changes
  useEffect(() => {
    const initializeFiles = () => {
      setSelectedFiles([]);

      if (existingImage) {
        setSelectedFiles([
          {
            preview: existingImage,
            payload: null,
            formattedSize: "",
            isExisting: true,
          },
        ]);
      }
    };

    initializeFiles();

    return () => {
      setSelectedFiles([]);
      selectedFiles.forEach((file) => {
        if (!file.isExisting && file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [existingImage]);

  const handleAcceptedFiles = (files) => {
    // Clear existing files first
    setSelectedFiles([]);

    const formattedFiles = files.map((file) => ({
      ...file,
      preview: URL.createObjectURL(file),
      formattedSize: formatBytes(file.size),
      isExisting: false,
      payload: file,
    }));

    setSelectedFiles(formattedFiles);

    if (files.length > 0) {
      formik?.setFieldValue("avatar", files[0]);
      formik?.setFieldValue("existingImage", null); // Clear existing image reference
    }
  };

  const handleFileRemove = (indexToRemove) => {
    setSelectedFiles((prevFiles) => {
      const fileToRemove = prevFiles[indexToRemove];

      // Clean up URL.createObjectURL
      if (!fileToRemove.isExisting && fileToRemove.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }

      const newFiles = prevFiles.filter((_, index) => index !== indexToRemove);

      // Clear form values when removing file
      if (newFiles.length === 0) {
        formik?.setFieldValue("avatar", null);
        formik?.setFieldValue("existingImage", null);
      }

      return newFiles;
    });
  };

  // Cleanup function for URL.createObjectURL
  useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => {
        if (!file.isExisting && file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  return (
    <Dropzone
      onDrop={handleAcceptedFiles}
      accept={{ "image/*": [".jpeg", ".jpg", ".png"] }}
      maxFiles={1}
    >
      {({ getRootProps, getInputProps }) => (
        <div className="dropzone dz-clickable pt-3">
          <div className="dz-message needsclick mb-5 p-3" {...getRootProps()}>
            <i className="align-item-center display-4 text-muted ri-upload-cloud-2-fill" />
            <input {...getInputProps()} />
            <h6 className="fs-15 fw-semi-bold pt-3">
              Drop files here or <Link to="#">click to upload.</Link>
            </h6>
          </div>
          {selectedFiles.map((file, index) => (
            <Card
              key={index}
              className="mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
            >
              <Row className="align-items-center">
                <Col className="col-auto">
                  <img
                    height="100"
                    className="avatar-sm rounded bg-light"
                    alt={file.name}
                    src={file.preview}
                  />
                </Col>
                <Col>
                  <Link to="#" className="text-muted font-weight-bold">
                    {file.name}
                  </Link>
                  <p className="mb-0 fs-12">{file.formattedSize}</p>
                </Col>
                <Col lg={2}>
                  <Link to="#" onClick={() => handleFileRemove(index)}>
                    <h6>
                      <i className="ri-delete-bin-2-line text-danger"></i>
                    </h6>
                  </Link>
                </Col>
              </Row>
            </Card>
          ))}
        </div>
      )}
    </Dropzone>
  );
};

FileDropzone.propTypes = {
  selectedFiles: PropTypes.array.isRequired,
  setSelectedFiles: PropTypes.func.isRequired,
  formik: PropTypes.shape({
    setFieldValue: PropTypes.func,
  }),
  existingImage: PropTypes.string,
};

FileDropzone.defaultProps = {
  formik: null,
  existingImage: null,
};

export default FileDropzone;
