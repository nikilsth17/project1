import React, { useState,useEffect } from 'react'
import LayoutWithBreadCrumb from '../Pages/Starter/LayoutWithBreadCrumb'
import BreadCrumb from '../../Components/Common/BreadCrumb'
import { Card, CardBody, Col, Label, Row ,Button,Container, Table} from 'reactstrap'
import SystemServices from '../../services/Inventory Services/SystemServices'
import { useNavigate, useParams } from 'react-router-dom'

const SystemDisplay = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isUserRole,setIsUserRole] = useState(null);

  const viewItem = async (itemId) => {
    try {
      console.log("hello");
      const fetchedItem = await SystemServices.view(itemId); // Replace with your API call
      console.log("Fetched Item:", fetchedItem);

      // Update the state to display the details of the selected item
      setIsUserRole(fetchedItem);
      setLoading(false); // Set loading to false after successful fetch
    } catch (error) {
      console.error("Error viewing item:", error);
      setLoading(false); // Set loading to false on error
    }
  };

  useEffect(() => {
    // Fetch the item details when the component mounts based on the id from the URL
    viewItem(uuid);
  }, [uuid]);
  return (
 
<React.Fragment>
<div className="page-content">

    <BreadCrumb  title="User Role Detail" pageTitle="User Role " />
  

        <Button
          className="btn btn-soft-success mb-3 text-start"
          onClick={() => navigate(`/system-user`)}
        >
          Back to List
        </Button>
        <Container fluid>
        <Row>
        <Col  lg={2}></Col>
        <Col lg={8}>
   <Card>
    <CardBody>
  
        <Table bordered>
        <tbody>
        <tr>
                          <th className="ps-5" scope="row">
                            User Name:
                          </th>
                          <td className="text-muted">
                          {isUserRole?.name}
                          </td>
                        </tr>
                        <tr>
                          <th className="ps-5" scope="row">
                          Normalized Name:
                          </th>
                          <td className="text-muted">
                          {isUserRole?.normalizedName}
                          </td>
                        </tr>
                        <tr>
                          <th className="ps-5" scope="row">
                          Concurrency Stamp:
                          </th>
                          <td className="text-muted">
                          {isUserRole?.concurrencyStamp}
                          </td>
                        </tr>
      </tbody>
      </Table>
     </CardBody>
     </Card>
     </Col>
     </Row>
     </Container>
     </div>
     </React.Fragment>

   
  )
}

export default SystemDisplay