import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button, Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Link } from "react-router-dom";
import ItemCategoryEditor from './ItemCategoryEditor';
import ItemCategoryDisplay from "./ItemCategoryDisplay";
import ItemCategoryList from "./ItemCategoryList";


const ItemCategoriesPage = (props) => {
  const InitialData = {
    id: 0, title: '', code: '', description: ''
  };
  const [data, setData] = useState(InitialData);
  const [showEditor, setShowEditor] = useState(false);
  const [showDisplay, setShowDisplay] = useState(false);
  const [afterSaveAction, setAfterSaveAction] = useState('');

  const onCloseEditor = (id) => {
    //code to refresh list and hide editor panel
    setData(InitialData);
    setShowEditor(false);
  }
  const handleAddNew = () => {
    setData(InitialData);
    setShowEditor(true);
  }
  const onEditClicked = (row) => {
    setData(row);
    setShowEditor(true);
  }

  useEffect(() => {

  }, [props]);

  return (
    <React.Fragment>
      <div className="page-content">

        <Container fluid>
          <BreadCrumb title="Item Categories List" pageTitle="Item Categories" />
          <Row>
            <Col lg={12}>

              <Card id="ItemCategoriesList">
                <CardHeader>
                  <div className="d-flex align-items-center">
                    <h5 className="card-title mb-0 flex-grow-1 fs-17">Item Categories</h5>
                    <div className="flex-shrink-0">
                      <div className="d-flex gap-2 flex-wrap">
                        <Button
                          onClick={handleAddNew}
                          className="btn btn-danger"
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Create
                          General Ledger
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  {showEditor &&
                    <React.Fragment>
                      <ItemCategoryEditor data={data} onCloseEditor={onCloseEditor} />
                    </React.Fragment>
                  }
                  {showDisplay &&
                    <React.Fragment>
                      <ItemCategoryDisplay data={data} onCloseEditor={onCloseEditor}/>
                    </React.Fragment>
                  }
                  <ItemCategoryList onEditClicked={onEditClicked} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>

  );
}
export default ItemCategoriesPage;