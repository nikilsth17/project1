import React, { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";


import LayoutForCRUDListingPage from "../Starter/LayoutForCRUDListingPage";
import UnApprovedVouchersList from "../UnApproved/UnApprovedVoucher";
import UnApprovedIncomeList from "../UnApproved/UnApprovedIncome";

const Postage = (props) => {
  const [activeTab, setActiveTab] = useState("vouchers");

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <React.Fragment>
      <LayoutForCRUDListingPage>

      <Nav tabs>
        <NavItem>
          <NavLink
            className={activeTab === "vouchers" ? "active" : ""}
            onClick={() => toggleTab("vouchers")}
          >
            Parcel
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={activeTab === "income" ? "active" : ""}
            onClick={() => toggleTab("income")}
          >
            Letter
          </NavLink>
        </NavItem>

      </Nav>
    
{
      <TabContent activeTab={activeTab}>
        <TabPane tabId="vouchers">
          <UnApprovedVouchersList />
        </TabPane>
        <TabPane tabId="income">
          <UnApprovedIncomeList />
        </TabPane>
        {/* <TabPane tabId="expenses">
          <UnApprovedExpenseList />
        </TabPane> */}
      </TabContent> }
      </LayoutForCRUDListingPage>
    </React.Fragment>
  );
};

export default Postage;
