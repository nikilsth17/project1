import React, { useState, useEffect, useMemo, useCallback } from "react";

import { Link, Navigate, useNavigate } from "react-router-dom";


// import UnApprovedVoucherListService from "../../services/UnapprovedVoucherListS";

import { Button, Card, CardBody, Row, CardTitle, CardText, Col } from "reactstrap";


import UnApprovedVoucherListService from "../../../services/AccountingServices/UnApprovedVoucherList";
import BreadCrumb from "../../../Components/Common/BreadCrumb";


const PostageList = (props) => {
  const [MyDatalist, setMyDataList] = useState([]);
  const navigate = useNavigate();
  
  // Assuming you want to navigate to JournalVouchersEditor when some event occurs
  // const handleNavigation = () => {
  //   navigate("/journal-vouchers/create"); // Replace with the actual path
  // };
  
  // Example button that triggers the navigation
  
  

  async function fetchPosts(id) {
    try {
      const response = await UnApprovedVoucherListService.getList(id);
      console.log("data");
      console.log(response);
      setMyDataList(response);
    } catch (error) {
      console.error("Error fetching ledger details:", error);
    }
  }
  
  useEffect(() => {
  
    fetchPosts();
  }, []);
 
  return (

    <React.Fragment>
  <div className="page-content">
    
   
    <Card>
      <CardBody>
        <Row>
          <Col sm="12">
            {MyDatalist.map((item, index) => (
              <Card key={index} body>
                <CardTitle tag="h5">{item.title}</CardTitle>
                <CardText>
                {item.description}                
                </CardText>
                <Button>Go somewhere</Button>
              </Card>
            ))}
          </Col>
        </Row>
      </CardBody>
    </Card>
  </div>
</React.Fragment>

  );
}
export default PostageList;