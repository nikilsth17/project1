import React from 'react';
import LayoutWithBreadCrumb from '../Pages/Starter/LayoutWithBreadCrumb';
import { useFormik } from "formik";
import * as Yup from "yup";

const YupValidation = () => {
    const formik = useFormik({
        initialValues: {
          name: '',
          grade: '',
          age: '',
          phoneNumber: '',
        },
        validate: (values) => {
          const errors = {};
    
          if (!values.name) {
            errors.name = 'Name is required';
          }
          if (!values.grade) {
            errors.grade = 'Grade is required';
          }
          if (!values.age) {
            errors.age = 'Age is required';
          } else if (parseInt(values.age, 10) < 0 || parseInt(values.age, 10) >= 150) {
            errors.age = 'Invalid age';
          }
    
          // Conditionally validate phone number based on age
          if (parseInt(values.age, 10) >= 18 && !values.phoneNumber) {
            errors.phoneNumber = 'Phone number is required';
          }
    
          return errors;
        },
        onSubmit: (values) => {
          // Handle form submission logic here
          console.log(values);
        },
      });

    return (
        <LayoutWithBreadCrumb>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                    />
                    {formik.errors.name && formik.touched.name && (
                        <div>{formik.errors.name}</div>
                    )}
                </div>

                <div>
                    <label htmlFor="grade">Grade:</label>
                    <input
                        id="grade"
                        name="grade"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.grade}
                    />
                    {formik.errors.grade && formik.touched.grade && (
                        <div>{formik.errors.grade}</div>
                    )}
                </div>

                <div>
                    <label htmlFor="age">Age:</label>
                    <input
                        id="age"
                        name="age"
                        type="number"
                        onChange={formik.handleChange}
                        value={formik.values.age}
                    />
                    {formik.errors.age && formik.touched.age && (
                        <div>{formik.errors.age}</div>
                    )}
                </div>
                {parseInt(formik.values.age, 10) >= 18 && (
                <div>
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.phoneNumber}
                    />
                    {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                        <div>{formik.errors.phoneNumber}</div>
                    )}
                </div>
                     )}

                <button type="submit">Submit</button>
            </form>
        </LayoutWithBreadCrumb>
    );
};

export default YupValidation;
