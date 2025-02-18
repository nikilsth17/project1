import React from "react";
import { Navigate } from "react-router-dom";
import BulkSalesEditor from "../pages/Inventory Txn/Sales/BulkSalesEditor";
//Tables

import ReactTable from "../pages/Tables/ReactTables";

//QA Management
import DocumentContent from "../Components/QAManagementComponent/DocumentContent";
import HomePage from "../pages/QAManagement/HomePage";
import ModuleDetailPage from "../pages/QAManagement/ModuleDetailPage";
import ModuleList from "../pages/QAManagement/ProjectDetailPage";
import TestResult from "../pages/QAManagement/TestResult";
import UserManagement from "../pages/QAManagement/UserManagement";

//AuthenticationInner pages
import BasicSignIn from "../pages/AuthenticationInner/Login/BasicSignIn";
import CoverSignIn from "../pages/AuthenticationInner/Login/CoverSignIn";

//pages
import Settings from "../pages/Pages/Profile/Settings/Settings";
import SimplePage from "../pages/Pages/Profile/SimplePage/SimplePage";
import Starter from "../pages/Pages/Starter/Starter";
import Timeline from "../pages/Pages/Timeline/Timeline";

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

//Inventory
//Product Categories
import PLList from "../pages/Inventory/ProductCategories/PLList";
import ProductCategoriesDisplay from "../pages/Inventory/ProductCategories/ProductCategoriesDisplay";
import ProductCategoriesEditor from "../pages/Inventory/ProductCategories/ProductCategoriesEditor";
//ProductUnits
import PUDisplay from "../pages/Inventory/ProductUnits/PUDisplay";
import PUEditor from "../pages/Inventory/ProductUnits/PUEditor";
import PUList from "../pages/Inventory/ProductUnits/PUList";
//Products
import PDisplay from "../pages/Inventory/Products/PDisplay";
import PEditor from "../pages/Inventory/Products/PEditor";
import PList from "../pages/Inventory/Products/PList";
//Customers
import SaleCustomersEditor from "../pages/Inventory/SaleCustomers/SaleCustomersEditor";
import SaleCustomersLists from "../pages/Inventory/SaleCustomers/SaleCustomersLists";
import SalesCustomersDisplay from "../pages/Inventory/SaleCustomers/SalesCustomersDisplay";
//Vendors
import VendorsDisplay from "../pages/Inventory/Vendors/VendorsDisplay";
import VendorsEditor from "../pages/Inventory/Vendors/VendorsEditor";
import VendorsList from "../pages/Inventory/Vendors/VendorsList";
//Sales
import SaleDisplay from "../pages/Inventory Txn/Sales/SaleDisplay";
import SaleEditor from "../pages/Inventory Txn/Sales/SaleEditor";
import SaleList from "../pages/Inventory Txn/Sales/SaleList";
//Purchases
import PurchaseDisplay from "../pages/Inventory Txn/Purchases/PurchaseDisplay";
import PurchaseEditor from "../pages/Inventory Txn/Purchases/PurchaseEditor";
import PurchaseList from "../pages/Inventory Txn/Purchases/PurchaseList";
//CustomerReport
import CustomerStatemenSummary from "../pages/InventoryReport/CustomerReport/CustomerStatemenSummary";
import CustomerStDetail from "../pages/InventoryReport/CustomerReport/CustomerStDetail";
//itemWTReport
import ProductItemwisetReport from "../pages/InventoryReport/InventoryIemReport/ProductItemwisetReport";
import TodaysItemTxnDetails from "../pages/InventoryReport/InventoryIemReport/TodaysItemTxnDetails";
//stocksummary_report
import StockSummaryReport from "../pages/InventoryReport/StockSummary/StockSummaryReport";
//VendorSummary
import VendorSDetail from "../pages/InventoryReport/VendorSummary/VendorSDetail";
import VendorSSummary from "../pages/InventoryReport/VendorSummary/VendorSSummary";
//Ssystem User
import SystemDisplay from "../pages/System Role/SystemDisplay";
import SystemEditor from "../pages/System Role/SystemEditor";
import SystemList from "../pages/System Role/SystemList";
//Management

import UserManageDisplay from "../pages/System Role/Usermanagement/UserManageDisplay";
import UserManageEditor from "../pages/System Role/Usermanagement/UserManageEditor";
import UserManageList from "../pages/System Role/Usermanagement/UserManageList";
//MenuInfo
import MenuInfoGetList from "../pages/System Role/MenuInfo/MenuInfoGetList";

//G & L

import GeneralLedgerList from "../pages/Pages/GeneralLedger/GeneralLedgerList";
import LedgerListPage from "../pages/Pages/Ledger/LedgerListPage";

//Employee
import EmployeeDisplay from "../pages/Pages/Employee/EmployeeDisplay";
import EmployeeEditor from "../pages/Pages/Employee/EmployeeEditor";
import EmployeeList from "../pages/Pages/Employee/EmployeeList";

//
import EmployeeWithTxnDetailList from "../pages/Pages/Employee/EmployeeWithTxnDetailList";
//Employee Salary
import EmployeeSalaryDisplay from "../pages/Pages/EmployeeSalary/EmployeeSalaryDisplay";
import EmployeeSalaryEditor from "../pages/Pages/EmployeeSalary/EmployeeSalaryEditor";
import EmployeeSalaryList from "../pages/Pages/EmployeeSalary/EmployeeSalaryList";

//Advance
import AdvanceDisplay from "../pages/Pages/AdvanceRecords/AdvanceDisplay";
import AdvanceEditor from "../pages/Pages/AdvanceRecords/AdvanceEditor";
import AdvanceList from "../pages/Pages/AdvanceRecords/AdvanceList";

//Production
import ProductionDisplay from "../pages/Pages/Production/ProductionDisplay";
import ProductionEditor from "../pages/Pages/Production/ProductionEditor";
import ProductionList from "../pages/Pages/Production/ProductionList";

//Production
import ShiftingToDockDisplay from "../pages/Pages/ShiftingToDock/ShiftingToDockDisplay";
import ShiftingToDockEditor from "../pages/Pages/ShiftingToDock/ShiftingToDockEditor";
import ShiftingToDockList from "../pages/Pages/ShiftingToDock/ShiftingToDockList";

//Production
import ShiftingToCounterDisplay from "../pages/Pages/ShiftingToCounter/ShiftingToCounterDisplay";
import ShiftingToCounterEditor from "../pages/Pages/ShiftingToCounter/ShiftingToCounterEditor";
import ShiftingToCounterList from "../pages/Pages/ShiftingToCounter/ShiftingToCounterList";

//Payroll
import PayrollDisplay from "../pages/Pages/Payroll/PayrollDisplay";
import PayrollEditor from "../pages/Pages/Payroll/PayrollEditor";
import PayrollList from "../pages/Pages/Payroll/PayrollList";

//JournalVoucher
import JournalVouchersDisplay from "../pages/Pages/JournalVouchers/JournalVoucherDisplay";
import JournalVouchersEditor from "../pages/Pages/JournalVouchers/JournalVoucherEditor";
import JournalVouchersList from "../pages/Pages/JournalVouchers/JournalVoucherList";

//Income
import IncomeDisplay from "../pages/Pages/IncomeVouchers/IncomeDisplay";
import IncomeEditor from "../pages/Pages/IncomeVouchers/IncomeEditor";
import IncomeList from "../pages/Pages/IncomeVouchers/IncomeList";

// Expense
import ExpensesDisplay from "../pages/Pages/ExpensesVouchers/ExpensesDisplay";
import ExpensesEditor from "../pages/Pages/ExpensesVouchers/ExpensesEditor";
import ExpensesList from "../pages/Pages/ExpensesVouchers/ExpensesList";

//UnapprovedList
import UnApprovedExpenseList from "../pages/Pages/UnApproved/UnApprovedExpense";
import UnApprovedIncomeList from "../pages/Pages/UnApproved/UnApprovedIncome";
import UnApprovedVouchersList from "../pages/Pages/UnApproved/UnApprovedVoucher";

//Approved List
import ApprovedExpenseList from "../pages/Pages/Approved/ApprovedExpenses";
import ApprovedIncomeList from "../pages/Pages/Approved/ApprovedIncome";
import ApprovedVouchersList from "../pages/Pages/Approved/ApprovedVouchers";
//
import Approved from "../pages/Pages/Approved/Approved";
import IncomeApprove from "../pages/Pages/Approved/IncomeApprove";
import UnApproved from "../pages/Pages/UnApproved/UnApproved";

// AccountingReport

import BalanceSheet from "../pages/Pages/BalanceSheet/BalanceSheet";
import LedgerStatement from "../pages/Pages/LedgerStatement/LedgerStatement";
import ProfitLoss from "../pages/Pages/ProfitLoss/ProfitLoss";
import Trial from "../pages/Pages/TrialBalance/Trial";

//
import TestHRResult from "../pages/QAManagement/TestHRResult";
//
import VehicleTypeDisplay from "../pages/Inventory/VehicleType/VehicleTypeDisplay";
import VehicleTypeEditor from "../pages/Inventory/VehicleType/VehicleTypeEditor";
import VehicleTypeList from "../pages/Inventory/VehicleType/VehicleTypelist";

//Postage

import PostageDisplay from "../pages/Pages/Postage/PostageDisplay";
import PostageEditor from "../pages/Pages/Postage/PostageEditor";

//
import VehicleDisplay from "../pages/Inventory/Vehicle/VehicleDisplay";
import VehicleEditor from "../pages/Inventory/Vehicle/VehicleEditor";
import VehicleList from "../pages/Inventory/Vehicle/VehicleList";
import Fuellogbookreport from "../pages/InventoryReport/FuellogbookReport/Fuellogbookreport";
import Vvehiclelogbook from "../pages/InventoryReport/VehiclelogbookReport/Vvehiclelogbook";
import TokenDisplay from "../pages/Pages/Fuel Token/TokenDisplay";
import TokenEditor from "../pages/Pages/Fuel Token/TokenEditor";
import TokenList from "../pages/Pages/Fuel Token/TokenList";

import ExpensesApprove from "../pages/Pages/Approved/ExpensesApprove";
import JournalApprove from "../pages/Pages/Approved/JournalApprove";

// import JournalApprove from "../pages/Pages/Approved/JournalApprove";
import JournalUnApprove from "../pages/Pages/UnApproved/UnApproveJournal";

import VehicleTransctionDetail from "../pages/Inventory/Vehicle/VehicleTransctionDetail";
import VendorwithTXNDetails from "../pages/Inventory/Vendors/VendorwithTXNDetails";
import AutoVoucher from "../pages/InventoryReport/AutoVoucher";
import InventoryDayBook from "../pages/InventoryReport/InventoryDayBook";
import EmployeeSettlementDisplay from "../pages/Pages/EmployeeSettlement/EmployeeSettlementDisplay";
import EmployeeSettlementEditor from "../pages/Pages/EmployeeSettlement/EmployeeSettlementEditor";
import EmployeeSettlementList from "../pages/Pages/EmployeeSettlement/EmployeeSettlementList";
import Validation from "../pages/Pages/Validation/Validation";
import ParcelMail from "../pages/System Role/ParcelMail";
import CustomerGetlist from "../pages/CustomerType/CustomerGetlist";
import CustomerEditor from "../pages/CustomerType/CustomerEditor";
import CustomerViewDetail from "../pages/CustomerType/CustomerViewDetail";
import ServiceList from "../pages/Inventory/OneWorldServicing/ServiceList";
import ServiceEditor from "../pages/Inventory/OneWorldServicing/ServiceEditor";
import ServiceViewDetail from "../pages/Inventory/OneWorldServicing/ServiceViewDetail";
import PackageTypeGetList from "../pages/Inventory Txn/PaymentType/PackageTypeGetList";
import PackageTypeEditor from "../pages/Inventory Txn/PaymentType/PackageTypeEditor";
import PackagetTypeViewDetail from "../pages/Inventory Txn/PaymentType/PackagetTypeViewDetail";
import Goodcategorylist from "../pages/GoodCategory/Goodcategorylist";
import GoodcategoryEditor from "../pages/GoodCategory/GoodcategoryEditor";
import GoodcategoryViewDetail from "../pages/GoodCategory/GoodcategoryViewDetail";
import InsuranceGetList from "../pages/Insurance/InsuranceGetList";
import InsuranceEditor from "../pages/Insurance/InsuranceEditor";
import InsuranceViewDetail from "../pages/Insurance/InsuranceViewDetail";
import ConfigureSettingGetList from "../pages/Setting/ConfigureSettingGetList";
import ConfigureSettingUpdate from "../pages/Setting/ConfigureSettingUpdate";
import ConfigureSettingViewDeatail from "../pages/Setting/ConfigureSettingViewDeatail";
import ResetPassword from "../pages/Authentication/ResetPassword";
import ChangePassword from "../pages/Authentication/ChangePassword";
import PasswordChange from "../pages/Authentication/PasswordChange";
import InstructionList from "../pages/Instruction/InstructionList";
import InstructionEditor from "../pages/Instruction/InstructionEditor";
import InstructionViewDetail from "../pages/Instruction/InstructionViewDetail";
import YupValidation from "../pages/Yup Valid/YupValidation";
import GeneralReports from "../pages/General/GeneralReports";
import CustomerTypeTXnDetail from "../pages/CustomerType/CustomerTypeTXnDetail";
import CustomerAUList from "../pages/Customer AUs/CustomerAUList";
import CustomerAUEditor from "../pages/Customer AUs/CustomerAUEditor";
import CustomerAUDetail from "../pages/Customer AUs/CustomerAUDetail";
import EmailSettingGEtlist from "../pages/Setting/EmailSetting.js/EmailSettingGEtlist";
import EmailSettingUpdate from "../pages/Setting/EmailSetting.js/EmailSettingUpdate";
import GeneralSettingList from "../pages/Pages/General Settings/GeneralSettingsList";
import GeneralSettingEditor from "../pages/Pages/General Settings/GeneralSettingsEditor";
import EmailTemplategetlist from "../pages/Setting/Email Template/EmailTemplategetlist";
import EmailTemplateUpdate from "../pages/Setting/Email Template/EmailTemplateUpdate";
import ServiceSeting from "../pages/Setting/ServiceSettingg/ServiceSeting";
import ServiceSettingViewDetail from "../pages/Setting/ServiceSettingg/ServiceSettingViewDetail";
import ServicesettingvdEditor from "../pages/Setting/ServiceSettingg/ServicesettingvdEditor";
import ServicesettingAust from "../pages/Setting/ServiceSettingg/ServicesettingAust";
import Servicesettingcurriour from "../pages/Setting/ServiceSettingg/Servicesettingcurriour";
import Customershipmentdetail from "../pages/Customer AUs/Customershipmentdetail";
import AmazonSetttinglist from "../pages/Setting/Amazon S/AmazonSetttinglist";
import Emailtesting from "../pages/Setting/EmailSetting.js/Emailtesting";
import Registergetlist from "../pages/Authentication/Registergetlist";
import Rolesadminget from "../pages/Authentication/Rolesadminget";
import CurrencyGetlist from "../pages/Currecny/CurrencyGetlist";
import CurrencyEditor from "../pages/Currecny/CurrencyEditor";
import CurrencyViewDetail from "../pages/Currecny/CurrencyViewDetail";
import ImportReasonList from "../pages/ImportReason/ImportReasonList";
import ImportReasonEditor from "../pages/ImportReason/ImportReasonEditor";
import ImportReasonDisplay from "../pages/ImportReason/ImportReasonDisplay";
import DepoList from "../pages/Depos/DepoList";
import DepotEditor from "../pages/Depos/DepoEditor";
import DepotDetails from "../pages/Depos/DepoDetails";
import ShipmentReport from "../pages/Shipment Report/ShipmentReport";
import ShipmentDetail from "../pages/Shipment Report/ShipmentDetail";
import InvoiceGetlist from "../pages/InvoiceCrud/InvoiceGetlist";
import InvoiceUpdate from "../pages/InvoiceCrud/InvoiceUpdate";
import InvoiceViewDetails from "../pages/InvoiceCrud/InvoiceViewDetails";

import CustomerReport from "../pages/CustomerReport/CustomerReport";
import InvoiceReport from "../pages/Invoice Reports/InvoiceReport";
import Logger from "../pages/Logger/Logger";
import LogDetail from "../pages/Logger/LogDetail";
import RateCardList from "../pages/Pages/RateCard/RateCardList";
import RateCardEditor from "../pages/Pages/RateCard/RateCardCreate";
import DocumentViewer from "../pages/DocumentViewer/CustomerDocumentViewer";
import AdminDocumentViewer from "../pages/DocumentViewer/AdminDocumentViewer";
import CustomerDocumentViewer from "../pages/DocumentViewer/CustomerDocumentViewer";
import Aapiloglist from "../pages/Setting/apilog/Aapiloglist";
import AapilogDetail from "../pages/Setting/apilog/AapilogDetail";
import Requestloglist from "../pages/Setting/Request log/Requestloglist";
import RequestlogDetail from "../pages/Setting/Request log/RequestlogDetail";
import RateCardEdit from "../pages/Pages/RateCard/RateCardEdit";
import RateCardCreate from "../pages/Pages/RateCard/RateCardCreate";
import InvoiceDetails from "../pages/Pages/InvoiceDetails/InvoiceDetails";
import DummyLabel from "../pages/Pages/Dummylabel";
import Dummy from "../pages/Pages/Dummylabel";
import ServiceExtra from "../pages/Setting/ServiceSettingg/ServiceExtra";
import ServiceExtraEditor from "../pages/Setting/ServiceSettingg/ServiceExtraEditor";
import EmailLogList from "../pages/Pages/EmailLog/EmailLogList";
import EmailLogDetail from "../pages/Pages/EmailLog/EmailLogDetail";
import IncomingApiLogList from "../pages/Setting/IncomingApiLog/IncomingApiLogList";
import IncomingApiLogDetail from "../pages/Setting/IncomingApiLog/IncomingApiLogDetail";
import ShipmentEdit from "../pages/ShipmentEdit/ShipmentEdit";
import ManifestList from "../pages/Manifest/ManifestList";
import ManifestDescription from "../pages/Manifest/components/ManifestDescription";
import ManifestDetail from "../pages/Manifest/ManifestDetail";
import ManifestViewer from "../pages/Manifest/components/ManifestViewer";
import Item from "../DibyaAdminPages/Items/page";
import Customers from "../DibyaAdminPages/Customer/page";
// import CustomerDetail from "../DibyaAdminPages/CustomerDetail/CustomerDetail";
import ItemList from "../DibyaAdminPages/Items/components/ListItems";
import ItemDetails from "../DibyaAdminPages/ItemsDetail/Details";
import ItemCreate from "../DibyaAdminPages/ItemAdd/ItemCreate";
import AdminRegistration from "../DibyaAdminPages/AdminRegistration/page";
import HeadersList from "../DibyaAdminPages/Headers/components/HeadersList";
import HeaderCreate from "../DibyaAdminPages/Headers/components/HeadersCreate";
import CategoryList from "../DibyaAdminPages/Category/components/CategoryList";
import CategoryCreate from "../DibyaAdminPages/Category/components/CategoryCreate";
import SubCategoryCreate from "../DibyaAdminPages/Category/components/SubCategory";
import SpecialOccasionList from "../DibyaAdminPages/SpecialOccasion/SpecialOccasionList";
import SpecialOccasionCreate from "../DibyaAdminPages/SpecialOccasion/SpecialOccasionCreate";
import SpecialOccasionItemList from "../DibyaAdminPages/SpecialOccasionAddItem/SpecialOccasionItemList";
import SpecialOccasionAddItem from "../DibyaAdminPages/SpecialOccasionAddItem/SpecialOccasionAdd";
import ComboList from "../DibyaAdminPages/Combo/components/ComboList";
import Orders from "../DibyaAdminPages/Order/page";
import ComboAdd from "../DibyaAdminPages/Combo/components/ComboAdd";
import UnitList from "../DibyaAdminPages/Unit/UnitList";

import GeneralSetting from "../DibyaAdminPages/GeneralConfigSettings/GeneralConfigSettingList";

import EmailSettingsList from "../DibyaAdminPages/EmailSettings/EmailSettingsList";

import WhatsAppSettingsList from "../DibyaAdminPages/WhatsAppSettingsList/WhatsAppSettingsList";

import UnitCreate from "../DibyaAdminPages/Unit/UnitCreate";
import UnitEdit from "../DibyaAdminPages/Unit/UnitEdit";
import Dashboard from "../DibyaAdminPages/Dashboard/Dashboard";
import ViewAdminPage from "../DibyaAdminPages/AdminRegistration/components/ViewAdminPage/ViewAdminPage";
import OrderEdit from "../DibyaAdminPages/Order/OrderEdit/OrderEdit";
import OrderDetail from "../DibyaAdminPages/Order/OrderDetail";
import AddItemToPacakge from "../DibyaAdminPages/ItemAdd/components/AddItemtoPackages";
import SingleItemCreate from "../DibyaAdminPages/ItemAdd/SingleItemCreate";
import Guestuser from "../DibyaAdminPages/Guest User/Guestuser";
import ItemDetail from "../DibyaAdminPages/Item Detail/ItemDetail";
import GuestDetail from "../DibyaAdminPages/Guest User/GuestUserDetail";
import OrderPending from "../DibyaAdminPages/OrderPending";
import Delivery from "../services/DibyaServices/Delivery/Delivery";
import PaymentDetail from "../services/DibyaServices/Delivery/PaymentDetail";
import PaymentReports from "../CosmosAdminPages/PaymentReports";
import TaxInvoices from "../CosmosAdminPages/TaxInvoices";

import Calender from "../CosmosAdminPages/Calendar";
import CustomerList from "../CosmosAdminPages/Customer/Pages/CustomerList";
import AppointmentList from "../CosmosAdminPages/Appointment/Pages/AppointmentList";
import Bookings from "../CosmosAdminPages/Booking/Pages/Bookings";
// import CustomerDetail from "../DibyaAdminPages/CustomerDetail/CustomerDetail";
import AppointmentDetail from "../CosmosAdminPages/Appointment/Pages/AppointmentDetail";
import Packages from "../CosmosAdminPages/PackagePage/Packages";
import PackageDetail from "../CosmosAdminPages/PackagePage/PackageDetail";
import UnavailbleTimeSlot from "../CosmosAdminPages/Unavailable TIme Slot/UnavailbleTimeSlot";
import UnavailbleTimeSlotList from "../CosmosAdminPages/Unavailable TIme Slot/UnavailableTimeSlotList";
import PaymentType from "../CosmosAdminPages/Payment Type/PaymentType";
import PaymentTypeDetail from "../CosmosAdminPages/Payment Type/PaymentTypeDetail";
import WeeklySchedule from "../CosmosAdminPages/Weekly Schedule/WeeklySchedule";
import OneTimeSchedule from "../CosmosAdminPages/One Time Schedule/OneTimeSchedule";
import ScheduleDetail from "../CosmosAdminPages/One Time Schedule/ScheduleDetail";
import CustomerDetails from "../CosmosAdminPages/Customer/Pages/CustomerDetails";
import DriverList from "../CosmosAdminPages/Drivers/DriverList";
import SettingPage from "../CosmosAdminPages/Settings/SettingPage";
import CustomerReports from "../CosmosAdminPages/Customer/Pages/CustomerReports";
import SMS from "../CosmosAdminPages/SMS/SMS";
import ContactUs from "../CosmosAdminPages/ContactUs/ContactUs";
import DriverDetail from "../CosmosAdminPages/Drivers/DriverDetail";
import Suburb from "../CosmosAdminPages/Suburb/page/Suburb";
import DriverWeeklySchedule from "../CosmosAdminPages/Drivers/DriverWeeklySchedule";
import DriverWeeklyScheduleDetail from "../CosmosAdminPages/Drivers/Component/DriverWeeklyScheduleDetail";
import DriverAppointmentList from "../CosmosAdminPages/Appointment/Pages/DriverAppointmentList";
import DriverOneTimeSchedule from "../CosmosAdminPages/DriverOneTimeSchedule/DriverOneTimeSchedule";
import DriverDetails from "../CosmosAdminPages/Drivers/Component/DriverDetails";
import DriverCalender from "../CosmosAdminPages/CalendarDriver/page/DriverCalendar";
import Detail from "../CosmosAdminPages/Customer/Component/Detail";
import CustomerDetailDriver from "../CosmosAdminPages/Customer/Component/CustomerDetailDriver";
import User from "../project1/User/page/User";
import FertilityPage from "../project1/Fertility/page/FertilityPage";

//ApprovedList

const authProtectedRoutes = [
  { path: "/home", component: <Navigate to="/project" /> },

  //Cosmos
  { path: "/payment-reports", component: <PaymentReports /> },
  { path: "/sms", component: <SMS /> },
  { path: "/unavailable-time-slot", component: <UnavailbleTimeSlot /> },
  {
    path: "/unavailable-time-slot-list",
    component: <UnavailbleTimeSlotList />,
  },
  { path: "/tax-invoices", component: <TaxInvoices /> },

  //Tables
  { path: "/tables-react", component: <ReactTable /> },

  { path: "/project/:id", component: <ModuleList /> },
  { path: "/project/module/testcase/:id", component: <TestResult /> },
  { path: "/project/module/:id", component: <ModuleDetailPage /> },
  { path: "/users", component: <UserManagement /> },
  { path: "/dashboard", component: <Dashboard /> },
  // { path: "/dashboard", component: <HomePage /> },
  { path: "/project/:id#pages/:docId", component: <DocumentContent /> },
  { path: "/dummytest", component: <Dummypage /> },
  { path: "/test-hr-result", component: <TestHRResult /> },

  //Pages
  { path: "/pages-starter", component: <Starter /> },
  { path: "/pages-profile", component: <SimplePage /> },
  // { path: "/pages-profile-settings",component:<Setting/>, component: <Settings /> },
  { path: "/pages-timeline", component: <Timeline /> },

  { path: "/pages-sitemap", component: <SiteMap /> },
  { path: "/pages-search-results", component: <SearchResults /> },

  //Inventory
  //Product Categories
  { path: "/product-category", component: <PLList /> },
  {
    path: "/product-category/details/:id",
    component: <ProductCategoriesDisplay />,
  },
  { path: "/product-category/create", component: <ProductCategoriesEditor /> },
  {
    path: "/product-category/edit/:id",
    component: <ProductCategoriesEditor />,
  },

  //ProductUnits

  //Customers
  // { path: "/customers", component: <SaleCustomersLists /> },
  { path: "/customers/create", component: <SaleCustomersEditor /> },
  { path: "/customers/edit/:id", component: <SaleCustomersEditor /> },
  { path: "/customers/details/:id", component: <SalesCustomersDisplay /> },
  //CustomerType
  { path: "/customer-type", component: <CustomerGetlist /> },
  { path: "/customer-type/create", component: <CustomerEditor /> },
  { path: "/customer-type/edit/:id", component: <CustomerEditor /> },
  { path: "/customer-type/details/:id", component: <CustomerViewDetail /> },

  //CustomerAU
  { path: "/CustomerAUS", component: <CustomerAUList /> },
  { path: "/CustomerAUS/create", component: <CustomerAUEditor /> },
  { path: "/CustomerAUS/edit/:id", component: <CustomerAUEditor /> },
  { path: "/CustomerAUS/details/:id", component: <CustomerAUDetail /> },
  { path: "/shipment-details/:id", component: <Customershipmentdetail /> },

  //EmailSetting
  { path: "/email-setting", component: <EmailSettingGEtlist /> },

  //EmailTemplate
  { path: "/email-template", component: <EmailTemplategetlist /> },
  { path: "/email-template/edit/:key", component: <EmailTemplateUpdate /> },
  //Services
  { path: "/service-list", component: <ServiceList /> },
  { path: "/service-list/create", component: <ServiceEditor /> },
  { path: "/service-list/edit/:id", component: <ServiceEditor /> },
  { path: "/service-list/details/:id", component: <ServiceViewDetail /> },
  //Package Type
  { path: "/Package", component: <PackageTypeGetList /> },
  { path: "/Package/create", component: <PackageTypeEditor /> },
  { path: "/Package/edit/:id", component: <PackageTypeEditor /> },
  { path: "/Package/details/:id", component: <PackagetTypeViewDetail /> },
  //Good Categories
  { path: "/Categories", component: <Goodcategorylist /> },
  { path: "/Categories/create", component: <GoodcategoryEditor /> },
  { path: "/Categories/edit/:id", component: <GoodcategoryEditor /> },
  { path: "/Categories/details/:id", component: <GoodcategoryViewDetail /> },
  //Insurance
  { path: "/Insurance", component: <InsuranceGetList /> },
  { path: "/Insurance/create", component: <InsuranceEditor /> },
  { path: "/Insurance/edit/:id", component: <InsuranceEditor /> },
  { path: "/Insurance/details/:id", component: <InsuranceViewDetail /> },
  //Instruction
  { path: "/Instruction", component: <InstructionList /> },
  { path: "/Instruction/create", component: <InstructionEditor /> },
  { path: "/Instruction/edit/:id", component: <InstructionEditor /> },
  { path: "/Instruction/details/:id", component: <InstructionViewDetail /> },
  //Invoices
  { path: "/Invoice", component: <InvoiceGetlist /> },
  { path: "/Invoice/edit/:id", component: <InvoiceUpdate /> },
  { path: "/Invoice/details/:id", component: <InvoiceViewDetails /> },
  //Configure Setting
  { path: "/Configure Setting", component: <ConfigureSettingGetList /> },
  {
    path: "/Configure Setting/edit/:name",
    component: <ConfigureSettingUpdate />,
  },
  {
    path: "/Configure Setting/details/:name",
    component: <ConfigureSettingViewDeatail />,
  },
  //serviceSetting
  { path: "/service-setting", component: <ServiceSeting /> },
  {
    path: "/service-setting/details/Aramex",
    component: <ServiceSettingViewDetail />,
  },
  {
    path: "/service-setting/details/AusPost",
    component: <ServicesettingAust />,
  },
  {
    path: "/service-setting/details/Courier Please",
    component: <Servicesettingcurriour />,
  },

  { path: "/serviceextra-list/:id", component: <ServiceExtra /> },
  { path: "/serviceextra-list/edit/:id", component: <ServiceExtraEditor /> },
  //Currency
  { path: "/Currency", component: <CurrencyGetlist /> },
  { path: "/Currency/create", component: <CurrencyEditor /> },
  { path: "/Currency/edit/:id", component: <CurrencyEditor /> },
  { path: "/Currency/details/:id", component: <CurrencyViewDetail /> },

  //Outgoing Api log
  { path: "/api-log", component: <Aapiloglist /> },
  { path: "/api-log/:id", component: <AapilogDetail /> },

  //Incoming Api log
  { path: "/incoming-api-log", component: <IncomingApiLogList /> },
  { path: "/incoming-api-log/:id", component: <IncomingApiLogDetail /> },

  //Request log
  { path: "/request-log", component: <Requestloglist /> },
  { path: "/request-log/:id", component: <RequestlogDetail /> },

  //Email log
  { path: "/email-log", component: <EmailLogList /> },
  { path: "/email-log/:id", component: <EmailLogDetail /> },

  {
    path: "/service-setting/edit/:name",
    component: <ServicesettingvdEditor />,
  },
  //emailtest
  { path: "/EmailTest", component: <Emailtesting /> },

  //amazon
  { path: "/amazon-setting", component: <AmazonSetttinglist /> },
  {
    path: "/Service Setting/details/Aramex",
    component: <ServiceSettingViewDetail />,
  },

  //Vendors
  { path: "/vendor", component: <VendorsList /> },
  { path: "/vendor/create", component: <VendorsEditor /> },
  { path: "/vendor/edit/:id", component: <VendorsEditor /> },
  { path: "/vendor/details/:id", component: <VendorsDisplay /> },
  { path: "/vendor/viewdetails/:id", component: <VendorwithTXNDetails /> },
  //Sales
  { path: "/sales", component: <SaleList /> },
  { path: "/sales/create", component: <SaleEditor /> },
  { path: "/sales/edit/:id", component: <SaleEditor /> },
  { path: "/sales/details/:id", component: <SaleDisplay /> },
  //Bulk Sales
  { path: "/Bulk Sales", component: <BulkSalesEditor /> },
  //Purchase
  { path: "/purchases", component: <PurchaseList /> },
  { path: "/purchases/create", component: <PurchaseEditor /> },
  { path: "/purchases/edit/:id", component: <PurchaseEditor /> },
  { path: "/purchases/details/:id", component: <PurchaseDisplay /> },
  //CustomerReport
  { path: "/customer-summary", component: <CustomerStatemenSummary /> },
  { path: "/customer-summary/details/:id", component: <CustomerStDetail /> },
  //ItemWiseReport
  { path: "/itemwiseT_report", component: <ProductItemwisetReport /> },
  {
    path: "/itemwiseT_report/details/:id",
    component: <TodaysItemTxnDetails />,
  },
  //stocksummary
  { path: "/stocksummary_report", component: <StockSummaryReport /> },
  //vendosummary_report
  { path: "/vendosummary_report", component: <VendorSSummary /> },
  { path: "/vendosummary_report/details/:id", component: <VendorSDetail /> },
  //vehiclesummary_report
  // {path: "/vehicleLogBook_report", component:<VehiclelogBookList />},
  { path: "/vehicleLogBook_report", component: <Vvehiclelogbook /> },
  { path: "/vehicleLogBook_report", component: <Vvehiclelogbook /> },
  //Fuellogsummary_report
  // {path: "/vehicleLogBook_report", component:<VehiclelogBookList />},
  { path: "/fuelBook_report", component: <Fuellogbookreport /> },
  //
  { path: "/inventorydaybook-report", component: <InventoryDayBook /> },
  {
    path: "/inventorydaybook-report/:selectedDate",
    component: <AutoVoucher />,
  },

  //System User
  { path: "/system-user", component: <SystemList /> },
  { path: `/postage-display/:id1/:id2`, component: <ParcelMail /> },
  { path: "/system-user/create", component: <SystemEditor /> },
  { path: "/system-user/edit/:uuid", component: <SystemEditor /> },
  { path: "/system-user/details/:uuid", component: <SystemDisplay /> },
  //management
  { path: "/user-management", component: <UserManageList /> },
  { path: "/user-management/create", component: <UserManageEditor /> },
  { path: "/user-management/edit/:id", component: <UserManageEditor /> },
  { path: "/user-management/details/:uuid", component: <UserManageDisplay /> },

  //Import Reason
  { path: "/import-reason", component: <ImportReasonList /> },
  { path: "/import-reason/create", component: <ImportReasonEditor /> },
  { path: "/import-reason/edit/:id", component: <ImportReasonEditor /> },
  { path: "/import-reason/details/:id", component: <ImportReasonDisplay /> },

  //Logger
  { path: "/logger", component: <Logger /> },
  { path: "/logger/:id", component: <LogDetail /> },

  //Depot Office
  { path: "/depot-office", component: <DepoList /> },
  {
    path: "/depot-office/create",
    component: <DepotEditor />,
  },
  { path: "/depot-office/details/:id", component: <DepotDetails /> },
  { path: "/depot-office/edit/:id", component: <DepotEditor /> },

  //menuInfo
  { path: "/menu-Info", component: <MenuInfoGetList /> },

  //Postage
  { path: "/postage-form", component: <PostageEditor /> },
  {
    path: "/postage-form/:fromPostalCode/:toPostalCode",
    component: <PostageDisplay />,
  },

  //Postage
  { path: "/postage-form", component: <PostageEditor /> },
  //general report
  { path: "/pre-defined-value", component: <GeneralReports /> },
  {
    path: "/postage-form/:fromPostalCode/:toPostalCode",
    component: <PostageDisplay />,
  },
  { path: "/dummy-label", component: <Dummy /> },

  //APIkey
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
    component: <ManifestList />,
  },
  {
    path: "/manifest-detail/:id",
    component: <ManifestDetail />,
  },
  {
    path: "/manifest-docs-viewer/:id",
    component: <ManifestViewer />,
  },
  {
    path: "/items",
    component: <ItemList />,
  },
  {
    path: "/items/:id",
    component: <ItemDetails />,
  },
  {
    path: "/customers",
    component: <Customers />,
  },
  // {
  //   path: "/customers/:id",
  //   component: <CustomerDetail />,
  // },
  {
    path: "/item/add",
    component: <ItemCreate />,
  },
  {
    path: "/items/edit/:id",
    component: <ItemCreate />,
  },
  {
    path: "/single-item/add",
    component: <SingleItemCreate />,
  },
  {
    path: "/admin-registration",
    component: <AdminRegistration />,
  },
  {
    path: "/admin/view/:id",
    component: <ViewAdminPage />,
  },

  {
    path: "/headers-list",
    component: <HeadersList />,
  },
  {
    path: "/headers/add",
    component: <HeaderCreate />,
  },
  {
    path: "/headers/edit/:id",
    component: <HeaderCreate />,
  },
  {
    path: "/category-list",
    component: <CategoryList />,
  },
  {
    path: "/category/add",
    component: <CategoryCreate />,
  },
  {
    path: "/category/edit/:id",
    component: <CategoryCreate />,
  },
  {
    path: "/sub-category/add",
    component: <SubCategoryCreate />,
  },
  {
    path: "/special-occasion/list",
    component: <SpecialOccasionList />,
  },
  {
    path: "/special-occasion/add",
    component: <SpecialOccasionCreate />,
  },
  {
    path: "/special-occasion/edit/:id",
    component: <SpecialOccasionCreate />,
  },
  {
    path: "/special-item",
    component: <SpecialOccasionItemList />,
  },
  {
    path: "/specialoccasion-item/add",
    component: <SpecialOccasionAddItem />,
  },
  {
    path: "/specialoccasion-item/edit/:id",
    component: <SpecialOccasionAddItem />,
  },
  {
    path: "/combo-list",
    component: <ComboList />,
  },
  { path: "/combo/add", component: <ComboAdd /> },
  { path: "/combo/edit/:id", component: <ComboAdd /> },
  // { path: "/combo-offer", component: <ComboOfferItemList /> },
  {
    path: "/unit-list",
    component: <UnitList />,
  },
  {
    path: "/general-setting",
    component: <GeneralSetting />,
  },
  {
    path: "/email-setting-list",
    component: <EmailSettingsList />,
  },
  {
    path: "/whatsapp-setting-list",
    component: <WhatsAppSettingsList />,
  },
  {
    path: "/unit/add",
    component: <UnitCreate />,
  },
  {
    path: "/unit/edit/:id",
    component: <UnitEdit />,
  },
  {
    path: "/orders",
    component: <Orders />,
  },
  {
    path: "/delivery",
    component: <Delivery />,
  },
  {
    path: "/paymentDetail",
    component: <PaymentDetail />,
  },
  {
    path: "/orders/:id",
    component: <OrderDetail />,
  },
  {
    path: "/orders/edit/:id",
    component: <OrderEdit />,
  },
  {
    path: "/addtopackage",
    component: <AddItemToPacakge />,
  },
  {
    path: "/guest-user",
    component: <Guestuser />,
  },
  {
    path: "/guest-detail/:id",
    component: <GuestDetail />,
  },
  {
    path: "/item-detail",
    component: <ItemDetail />,
  },
  {
    path: "/orders-pending",
    component: <OrderPending />,
  },

  // =============================== COSMOS ADMIN PAGES =====================================
  // customer list
  { path: "/customer", component: <CustomerList /> },
  // { path: "/customer/detail/:id", component: <CustomerDetails /> },

  //appointment list
  { path: "/appointment", component: <AppointmentList /> },
  { path: "/driver-appointment", component: <DriverAppointmentList /> },
  { path: "/appointment/detail/:id", component: <AppointmentDetail /> },

  //booking pages
  { path: "/bookings", component: <Bookings /> },
  { path: "/apps-calendar", component: <Calender /> },
  { path: "/driver/apps-calendar", component: <DriverCalender /> },
  // packages pages
  { path: "/packages", component: <Packages /> },
  { path: "/package/detail/:id", component: <PackageDetail /> },

  // payment type page
  { path: "/payment-type", component: <PaymentType /> },
  { path: "/payment-type/detail/:id", component: <PaymentTypeDetail /> },

  //schedule page
  { path: "/weekly-schedule", component: <WeeklySchedule /> },
  { path: "/one-time-schedule", component: <OneTimeSchedule /> },
  { path: "/one-time-schedule/detail/:id", component: <ScheduleDetail /> },
  { path: "/customer/detail/:id", component: <CustomerReports /> },
  { path: "/customer-detail/:id", component: <CustomerDetailDriver /> },
  { path: "/settings", component: <SettingPage /> },

  // driver page
  { path: "/drivers", component: <DriverList /> },
  { path: "/driver/detail/:id", component: <DriverDetails /> },
  { path: "/drivers/weekly-schedule", component: <DriverWeeklySchedule /> },
  {
    path: "/driver/weekly-schedule/:id",
    component: <DriverWeeklyScheduleDetail />,
  },
  { path: "/driver/one-time-schedule", component: <DriverOneTimeSchedule /> },
  { path: "/suburb", component: <Suburb /> },
  // {path:"/contact-us",component:<ContactUs/>}

  ///////project 1
  { path: "/user", component: <User /> },
  { path: "/fertility", component: <FertilityPage /> },
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
