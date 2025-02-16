import React, { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";

import LayoutForCRUDListingPage from "../Starter/LayoutForCRUDListingPage";
import ApprovedExpenseList from "./ApprovedExpenses";
import ApprovedIncomeList from "./ApprovedIncome";
import ApprovedVouchersList from "./ApprovedVouchers";
import IncomeApprove from "./IncomeApprove";

const UnApproved = (props) => {
  const [activeTab, setActiveTab] = useState("vouchers");

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <React.Fragment>
      <LayoutForCRUDListingPage
        title="Approved Vouchers List"
        pageTitle="Approved Vouchers"
      >
        <Nav tabs>
          <NavItem>
            <NavLink
              className={activeTab === "vouchers" ? "active" : ""}
              onClick={() => toggleTab("vouchers")}
            >
              Approved Journal Vouchers
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "income" ? "active" : ""}
              onClick={() => toggleTab("income")}
            >
              Approved Income Vouchers
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "expenses" ? "active" : ""}
              onClick={() => toggleTab("expenses")}
            >
              Approved Expense Vouchers
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="vouchers">
            <ApprovedVouchersList />
          </TabPane>
          <TabPane tabId="income">
            <ApprovedIncomeList />
          </TabPane>
          <TabPane tabId="expenses">
            <ApprovedExpenseList />
          </TabPane>
        </TabContent>
      </LayoutForCRUDListingPage>
    </React.Fragment>
  );
};

export default UnApproved;
