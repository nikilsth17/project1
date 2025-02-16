import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from "reactstrap";
import LayoutForCRUDListingPage from "../Starter/LayoutForCRUDListingPage";

import LEEditor from "./LEEditor";
import LEDisplay from "./LEDisplay";
import LedgerList from "./LedgerList";

const LedgerListPage = (props) => {
  const InitialData = {
    ledgerName: "",
    description: "",
    code: "",
    parentGLID: null,
    status: true,
    glType: null, // Change to null
    parentGLName: "",
  };
  const [data, setData] = useState(InitialData);
  const [draw, setDraw] = useState(1);
  const [showEditor, setShowEditor] = useState(false);
  const [showDisplay, setShowDisplay] = useState(false);
  const [showList, setShowList] = useState(false);
  const [afterSaveAction, setAfterSaveAction] = useState("");

  const onCloseEditor = () => {
    //code to refresh list and hide editor panel
    setShowEditor(false);
    setShowDisplay(false);
    setDraw(draw + 1);
  };
  const handleAddNew = () => {
    setData(InitialData);
    setShowEditor(true);
    setShowDisplay(false);
  };
  const onEditClicked = (row) => {
    console.log("edit btn clicked... setting and showing data ", row);
    setData(row);

    setShowEditor(true);
    setShowDisplay(false);
    setShowList(false);
    setDraw(draw + 1);
  };
  const onViewClick = (row) => {
    console.log("view btn clicked... setting and showing data ", row);
    setData(row);
    setShowDisplay(true);
    setShowEditor(false);
  };
  const onDeleteClick = (row) => {
    console.log("view btn clicked... setting and showing data ", row);
    setData(row);

    setShowDisplay(false);
    setShowEditor(false);
    setDraw(draw + 1);
  };

  useEffect(() => {}, [props]);

  return (
    <React.Fragment>
      <LayoutForCRUDListingPage
        title=" Ledger List"
        pageTitle=" Ledger"
        handleAddNew={handleAddNew}
      >
        {showEditor && (
          <React.Fragment>
            <LEEditor
              myPropHoldingData={data}
              onCloseEditor={onCloseEditor}
              newXYZProp="ABC"
            />
          </React.Fragment>
        )}

        {showDisplay && (
          <React.Fragment>
            <LEDisplay myPropViewData={data} onCloseEditor={onCloseEditor} />
          </React.Fragment>
        )}

        <LedgerList
          onEditClicked={onEditClicked}
          draw={draw}
          onViewClicked={onViewClick}
          onDeleteClick={onDeleteClick}
        />
      </LayoutForCRUDListingPage>
    </React.Fragment>
  );
};
export default LedgerListPage;
