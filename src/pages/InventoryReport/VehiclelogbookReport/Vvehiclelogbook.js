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
import NumberWithCommas from '../../Pages/Starter/NumberWithCommas';
import { useState, useEffect } from "react";
import FuelTokenServices from '../../../services/HRService/FuelTokenServices';
import VehicleServices from '../../../services/Inventory Services/VehicleServices';

const Vvehiclelogbook = (props) => {
    const {Item_id} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isvehicle, setIsvehicle] = useState([]);
    const [isVehicleID, setIsVehicleID] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [reportData, setReportData] = useState({ Item_id: 0 });
//GEtlist
    async function fetchvehiclelogbBook(Item_id) {
      console.log(Item_id);
      try {
        const response = await VehicleServices.vehicleLogBookgetList(Item_id);
  
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
        fetchvehiclelogbBook(Item_id);
        setSelectedDate(selectedDate)
      }, [Item_id,selectedDate]);
  
    async function fetchitemPosts(Item_id) {
      console.log(Item_id);
      try {
        const response = await VehicleServices.vehicleLogBook(Item_id);
  
        console.log(response);
        setReportData(response);
      } catch (error) {
        console.error('Error fetching ledger details:', error);
      }
    }
  
    // Function to get product list
    async function fetchVehicle() {
      try {
        const fetchedvehicle = await VehicleServices.getList();
        console.log('Fetched Products:', fetchedvehicle);
        setIsvehicle(fetchedvehicle);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    // Define an async function to call vehicleLogBookdateandtime
// async function fetchDataDateTime(id,dateofvehicle) {
//   try {
//        const data = await  VehicleServices.vehicleLogBookdateandtime(id, dateofvehicle);

//        console.log(data); // Handle the response data as needed
//        setReportData(data);
//       } catch (error) {
//     console.error('An error occurred:', error);
//   }
// }

//     // Define an async function to call vehicleLogBookdateandtime
//     async function fetchDataDate(dateofvehicle) {
//       try {
//            const data = await  VehicleServices. vehicleLogBookDate( dateofvehicle);
//         console.log(data); // Handle the response data as needed
//         setReportData(data);
//       } catch (error) {
//         console.error('An error occurred:', error);
//       }
//     }


  
    const getTodayDate = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
    useEffect(() => {
        fetchVehicle();
        
      // setSelectedDate(getTodayDate());
    }, []);
  
    // const generateReport = () => {
    //   fetchitemPosts(isVehicleID);
    //   fetchDataDateTime(isVehicleID,selectedDate);
    //   fetchDataDateTime(selectedDate);
    // }

      // Function to generate the report
      const generateReport = async () => {
        if (isVehicleID && selectedDate) {
          // If both vehicle and date are selected
          try {
            const data = await VehicleServices.vehicleLogBookdateandtime(isVehicleID, selectedDate);
            setReportData(data);
          } catch (error) {
            console.error('An error occurred while fetching data:', error);
          }
        } else if (isVehicleID) {
          // If only the vehicle is selected
          try {
            const data = await VehicleServices.vehicleLogBook(isVehicleID);
            setReportData(data);
          } catch (error) {
            console.error('An error occurred while fetching data:', error);
          }
        } else if (selectedDate) {
          // If only the date is selected
          try {
            const data = await VehicleServices.vehicleLogBookDate(selectedDate);
            setReportData(data);
          } catch (error) {
            console.error('An error occurred while fetching data:', error);
          }
        } else {
          // Handle the case when no selection is made
          console.error('Please select a vehicle or date.');
        }
      };
      
    return (
      <div className="page-content">
      <React.Fragment>
        <BreadCrumb title="VehicleLog Book Report" pageTitle="Log Book Report " />
       <Container fluid>
          <Row>
            <Col>
              <Card>
                <CardBody>
  {/* <CardHeader>
               <CreateButton to='/itemwiseT_report/details/${id}' text='+ Details'  />
      
                </CardHeader> */}
                  <Row>
                    <FormGroup row>
                      <Col sm={3}>
                        <Label for="isVehicleID">Vehicle:</Label>
                      </Col>
                      <Col sm={3}>
                         <select
                      value={isVehicleID}
                      className="form-control"
                      onChange={(e) => setIsVehicleID(e.target.value)}
                    >
                      <option value="">Select Vehicle</option>
                      {isvehicle.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.vehicle_No}
                        </option>
                      ))}
                    </select>
                      </Col>
   <Col sm={3}>
        <Label for='date' sm={2}>Date</Label>
      </Col>
      <Col sm={3}>
        <input
          type="date"
          value={selectedDate}
          className="form-control"
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </Col>
     </FormGroup>
                      <Col sm={3}>
  <Label  sm={2}></Label></Col>
  <Col sm={3}>
                        <Button color="primary" onClick={generateReport}>
                         <div> Generate Report</div>
                        </Button>
                      </Col>
                   
                  </Row>
                </CardBody>
              </Card>
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
  <th className="sort" data-sort="sn">
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
                        <td>
                        <Link
                                          to={`/vehicle-form/vehcletxndetail/${transaction.vehicleId}`}
                                        >
                                         {transaction.vehicleNo}
                                        </Link>
                          </td>
                        <td>
                        <Link
                                          to={`/employee-form/viewdetails/${transaction.employeeId}`}
                                        >
                                                                   {transaction.employeeName}
                                        </Link>
</td>
                        <td>{transaction.destination}</td>
                        <td>{transaction.txnDate}</td>
                        <td className='text-end'>
                          
                        <NumberWithCommas
                                          number={transaction.txn_Qty}
                                        />
                          </td>
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
      </React.Fragment>
    </div>
  )
}

export default Vvehiclelogbook