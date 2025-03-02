import React from "react";
import { Navigate } from "react-router-dom";
//Tables

import ReactTable from "../pages/Tables/ReactTables";

import ModuleDetailPage from "../pages/QAManagement/ModuleDetailPage";
import ModuleList from "../pages/QAManagement/ProjectDetailPage";
import TestResult from "../pages/QAManagement/TestResult";
import UserManagement from "../pages/QAManagement/UserManagement";

//AuthenticationInner pages
import BasicSignIn from "../pages/AuthenticationInner/Login/BasicSignIn";
import CoverSignIn from "../pages/AuthenticationInner/Login/CoverSignIn";



import Alt404 from "../pages/AuthenticationInner/Errors/Alt404";
import Basic404 from "../pages/AuthenticationInner/Errors/Basic404";
import Cover404 from "../pages/AuthenticationInner/Errors/Cover404";
import Error500 from "../pages/AuthenticationInner/Errors/Error500";
import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";
import BasicLogout from "../pages/AuthenticationInner/Logout/BasicLogout";
import CoverLogout from "../pages/AuthenticationInner/Logout/CoverLogout";
import SearchResults from "../pages/Pages/SearchResults/SearchResults";
import SiteMap from "../pages/Pages/SiteMap/SiteMap";

//login
import ApiKey from "../pages/APIKey/index";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";

// User Profile
import UserProfile from "../pages/Authentication/user-profile";

import Dummypage from "../pages/QAManagement/Dummypage";


import ResetPassword from "../pages/Authentication/ResetPassword";
import ChangePassword from "../pages/Authentication/ChangePassword";
import PasswordChange from "../pages/Authentication/PasswordChange";

import Registergetlist from "../pages/Authentication/Registergetlist";
import Rolesadminget from "../pages/Authentication/Rolesadminget";

import ShipmentReport from "../pages/Shipment Report/ShipmentReport";
import ShipmentDetail from "../pages/Shipment Report/ShipmentDetail";

import CustomerReport from "../pages/CustomerReport/CustomerReport";
import InvoiceReport from "../pages/Invoice Reports/InvoiceReport";

import AdminDocumentViewer from "../pages/DocumentViewer/AdminDocumentViewer";
import CustomerDocumentViewer from "../pages/DocumentViewer/CustomerDocumentViewer";

import RateCardEdit from "../pages/Pages/RateCard/RateCardEdit";

import InvoiceDetails from "../pages/Pages/InvoiceDetails/InvoiceDetails";

import ShipmentEdit from "../pages/ShipmentEdit/ShipmentEdit";




import CustomerList from "../CosmosAdminPages/Customer/Pages/CustomerList";

import User from "../project1/User/page/User";
import FertilityPage from "../project1/Fertility/page/FertilityPage";
import Unit from "../project1/Administrative Unit/page/Unit";
import Dashboard from "../project1/Dashboard/Dashboard";

//ApprovedList

const authProtectedRoutes = [
  { path: "/home", component: <Navigate to="/project" /> },

  //Cosmos

  { path: "/users", component: <UserManagement /> },
  { path: "/dashboard", component: <Dashboard /> },
  // { path: "/dashboard", component: <HomePage /> },
 




  { path: "/apps-api-key", component: <ApiKey /> },

  //User Profile
  { path: "/profile", component: <UserProfile /> },
  { path: "/Admin-roles", component: <Rolesadminget /> },
  { path: "/User-Role", component: <Registergetlist /> },
  { path: "/User-Role/create", component: <Register /> },
  { path: "/User-Role/edit/:id", component: <Register /> },
  // { path: "/Yup", component: <YupValidation /> },
  { path: "/change-password", component: <ChangePassword /> },
  { path: "/shipment-report", component: <ShipmentReport /> },
  { path: "/shipmentdetail/:id", component: <ShipmentDetail /> },
  { path: "/shipmentedit/:id", component: <ShipmentEdit /> },

  { path: "/invoice-report", component: <InvoiceReport /> },
  { path: "/invoice-report/detail/:id", component: <InvoiceDetails /> },

  { path: "/customer-report", component: <CustomerReport /> },

  // this route should be at the end of all other routesPaymentsReport
  { path: "/ratecard/edit/:id", component: <RateCardEdit /> },
  // { path: "*", component: <Navigate to="/auth-404-cover" /> },

  {
    path: "/admin-docs-viewer/:id",
    component: <AdminDocumentViewer />,
  },
  {
    path: "/customer-docs-viewer/:id",
    component: <CustomerDocumentViewer />,
  },

  {
    path: "/manifest-list",
    // component: <ManifestList />,
  },
  {
    path: "/manifest-detail/:id",
    // component: <ManifestDetail />,
  },
  {
    path: "/manifest-docs-viewer/:id",
    // component: <ManifestViewer />,
  },
  {
    path: "/items",
    // component: <ItemList />,
  },
  {
    path: "/items/:id",
    // component: <ItemDetails />,
  },
  {
    path: "/customers",
    // component: <Customers />,
  },
 



  // =============================== COSMOS ADMIN PAGES =====================================
  // customer list
  { path: "/customer", component: <CustomerList /> },
  // { path: "/customer/detail/:id", component: <CustomerDetails /> },

  // {path:"/contact-us",component:<ContactUs/>}

  ///////project 1
  { path: "/user", component: <User /> },
  { path: "/fertility", component: <FertilityPage /> },
  { path: "/administrative-unit", component: <Unit /> },
  { path: "/language", component: <Unit /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/register", component: <Register /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/reset-password", component: <ResetPassword /> },

  { path: "/forgot-password-change", component: <PasswordChange /> },

  //AuthenticationInner pages
  { path: "/auth-signin-basic", component: <BasicSignIn /> },
  { path: "/auth-signin-cover", component: <CoverSignIn /> },
  { path: "/auth-logout-basic", component: <BasicLogout /> },
  { path: "/auth-logout-cover", component: <CoverLogout /> },
  { path: "/auth-404-basic", component: <Basic404 /> },
  { path: "/auth-404-cover", component: <Cover404 /> },
  { path: "/auth-404-alt", component: <Alt404 /> },
  { path: "/auth-500", component: <Error500 /> },
  { path: "/auth-offline", component: <Offlinepage /> },
];

export { authProtectedRoutes, publicRoutes };
