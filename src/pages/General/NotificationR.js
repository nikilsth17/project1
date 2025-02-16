import React, { useState, useEffect, useMemo, useCallback } from "react";

import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button, Card, CardBody } from "reactstrap";
import GeneralServices from '../../services/AustServices/GeneralService/GeneralServices';


const NotificationR = () => {
    const [MyDatalist, setMyDataList] = useState([]);
    const navigate = useNavigate();
  
    // Assuming you want to navigate to JournalVouchersEditor when some event occurs
    // const handleNavigation = () => {
    //   navigate("/journal-vouchers/create"); // Replace with the actual path
    // };
  
    // Example button that triggers the navigation
  
    async function fetchPosts(id) {
      try {
        const response = await GeneralServices.getNotificationReceiver(id);
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
    {/* <Button color="danger" onClick={handleNavigation} className="float-end">Create Journal Vouchers</Button> */}
   
      <CardBody>
        <table className="table table-bordered table-stripped">
          <thead>
            <tr>
              <th className="table-primary">SN</th>
              <th className="table-primary">Title</th>
         
            </tr>
          </thead>
          <tbody>
            {MyDatalist.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.title}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
  
  </React.Fragment>
  )
}

export default NotificationR