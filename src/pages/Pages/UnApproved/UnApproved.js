import React, { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";

import UnApprovedExpenseList from "./UnApprovedExpense";
import UnApprovedIncomeList from "./UnApprovedIncome";
import UnApprovedVouchersList from "./UnApprovedVoucher";
import LayoutForCRUDListingPage from "../Starter/LayoutForCRUDListingPage";

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
        title="UnApproved Vouchers List"
        pageTitle="UnApproved Vouchers"
      >
        <Nav tabs>
          <NavItem>
            <NavLink
              className={activeTab === "vouchers" ? "active" : ""}
              onClick={() => toggleTab("vouchers")}
            >
              UnApproved Journal Vouchers
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "income" ? "active" : ""}
              onClick={() => toggleTab("income")}
            >
              UnApproved Income Vouchers
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "expenses" ? "active" : ""}
              onClick={() => toggleTab("expenses")}
            >
              UnApproved Expense Vouchers
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="vouchers">
            <UnApprovedVouchersList />
          </TabPane>
          <TabPane tabId="income">
            <UnApprovedIncomeList />
          </TabPane>
          <TabPane tabId="expenses">
            <UnApprovedExpenseList />
          </TabPane>
        </TabContent>
      </LayoutForCRUDListingPage>
    </React.Fragment>
  );
};

export default UnApproved;
