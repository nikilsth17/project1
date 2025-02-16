import * as Yup from "yup";

const RegisterValidation = Yup.object({
  username: Yup.string().required("User name is required!"),
  address: Yup.string().required("Address is required!"),

  emailAddress: Yup.string()
    .email("Please enter valid email format!")
    .required("Email is required!"),
  phoneNumber: Yup.string().required("Phone number is required!"),
  password: Yup.string()
    .required("Password is required!")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  confirmPassword: Yup.string()
    .required("This is field is required!")
    .oneOf([Yup.ref("password")], "Your passwords do not match."),
});

export default RegisterValidation;
