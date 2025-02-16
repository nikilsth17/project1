import React from 'react'


import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Button,
  Table,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  ButtonToggle,
  Label,
  FormGroup,
} from "reactstrap";
import { useState, useEffect } from "react";
import FuelTokenServices from '../../../services/HRService/FuelTokenServices';
import VehicleServices from '../../../services/Inventory Services/VehicleServices';

const VehiclelogBookList = (props) => {
    const {Item_id} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isvehicle, setIsvehicle] = useState([]);
    const [isVehicleID, setIsVehicleID] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [reportData, setReportData] = useState({ Item_id: 0 });
  
    async function fetchvehicle(Item_id) {
      console.log(Item_id);
      try {
        const response = await VehicleServices. vehicleLogBookgetList(Item_id);
  
        console.log(response);
        setReportData(response);
      } catch (error) {
        console.error('Error fetching ledger details:', error);
      }
    }
  
  
    useEffect(() => {
        console.log("triggered ....");
        // console.log('Refreshing and checking draw value: ', props.draw);
        // setChildDraw(props.draw);
        // Fetch posts when the component mounts
        fetchvehicle();
      }, [props]);
    
    return (

      <React.Fragment>
     
      <div className="page-content">
   
        <BreadCrumb title="VehicleLog Book Report" pageTitle="Log Book Report " />
       
        <Container fluid>
  <Row>
    <Col>
      <Card>
        <CardBody>
                  <div id="customerList">
                    <Row className="g-4 mb-3"></Row>
  
                    <div className="table-responsive table-card mt-3 mb-1">
                      <table
                        className="table align-middle table-nowrap"
                        id="employeeTable"
                      >
                        <thead className="table-light">
                          <tr>
                            <th className="sort" data-sort="sn">
                              S.N
                            </th>
  <th className="sort" data-sort="vehicleNo">
  Vehicle No.
                            </th>
                            <th className="sort" data-sort="txnDate">
                            Employee
                            </th>
                            <th className="sort" data-sort="bill_No">
                            Destination
                            </th>
                            <th className="sort" data-sort="total_Amt">
                             Transction Date
                            </th>
                            <th className="sort" data-sort="remarks">
                              Transction Quantity
                            </th>
                            <th className="sort" data-sort="action">
                            Remarks
                            </th>

                          </tr>
                        </thead>
                        <tbody>
                          { reportData.length > 0 ? (
                    reportData.map((transaction, index) => (
                      <tr key={transaction.id}>
                        <td>{index+1}</td>
                        <td>{transaction.vehicleNo}</td>
                        <td>{transaction.employeeName}</td>
                        <td>{transaction.destination}</td>
                        <td>{transaction.txnDate}</td>
                        <td>{transaction.txn_Qty}</td>
                        <td>{transaction.remarks}</td>
                       
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">No data available</td>
                    </tr>
                  )}
                        </tbody>
                      </table>
                    </div>
                    <div className="noresult" style={{ display: "none" }}>
                      <div className="text-center">
                        <lord-icon
                          src="https://cdn.lordicon.com/msoeawqm.json"
                          trigger="loop"
                          colors="primary:#121331,secondary:#08a88a"
                          style={{ width: "75px", height: "75px" }}
                        ></lord-icon>
                        <h5 className="mt-2">Sorry! No Result Found</h5>
                        <p className="text-muted mb-0">
                          We've searched more than 150+ Orders We did not find
                          any orders for you search.
                        </p>
                      </div>
                    </div>
                  </div>
  
                  <div className="d-flex justify-content-end">
                    <div className="pagination-wrap hstack gap-2">
                      <Link
                        className="page-item pagination-prev disabled"
                        to="#"
                      >
                        Previous
                      </Link>
                      <ul className="pagination listjs-pagination mb-0"></ul>
                      <Link className="page-item pagination-next" to="#">
                        Next
                      </Link>
                    </div>
                  </div>
                  </CardBody>
      </Card>
    </Col>
  </Row>
</Container>
          
               </div>
               </React.Fragment>
             
 
  )
}

export default VehiclelogBookList