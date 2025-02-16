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

import { Link } from "react-router-dom";
import GLEditor from "./GLEditor";
import GLDisplay from "./GLDisplay";
import GLList from "./GLList";
import LayoutForCRUDListingPage from "../Starter/LayoutForCRUDListingPage";

const GeneralLedgerList = (props) => {
  const InitialData = {
    id: 0,
    code: "",
    glName: "",
    description: "",
    glType: "",
    parentGLID: "",
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
    setDraw(draw + 1);
    setShowDisplay(false);
    setShowEditor(false);
  };

  useEffect(() => {
    //yeha ko loading ko code khoi ta?
  }, [props]);

  return (
    <React.Fragment>
      <LayoutForCRUDListingPage
        title="General Ledger List"
        pageTitle="General Ledger"
        handleAddNew={handleAddNew}
      >
        {showEditor && (
          <React.Fragment>
            <GLEditor
              myPropHoldingData={data}
              onCloseEditor={onCloseEditor}
              newXYZProp="ABC"
              className="pb-5"
            />
          </React.Fragment>
        )}

        {showDisplay && (
          <React.Fragment>
            <GLDisplay myPropViewData={data} onCloseEditor={onCloseEditor} />
          </React.Fragment>
        )}
        {showList && (
          <React.Fragment>
            <GLList
              myPropDeleteData={data}
              onCloseEditor={onCloseEditor}
              newXYZProp="ABC"
            />
          </React.Fragment>
        )}

        <GLList
          onEditClicked={onEditClicked}
          draw={draw}
          onViewClicked={onViewClick}
          onDeleteClick={onDeleteClick}
        />
      </LayoutForCRUDListingPage>
    </React.Fragment>
  );
};
export default GeneralLedgerList;
