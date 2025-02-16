import React, { useState,useEffect } from 'react'
import LayoutWithBreadCrumb from '../../Pages/Starter/LayoutWithBreadCrumb'
import BreadCrumb from '../../../Components/Common/BreadCrumb'
import { Card, CardBody, Col, Label, Row ,Button,Table,Container} from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import ManagemetServices from '../../../services/Inventory Services/ManagemetServices'
const defData=
{
  "id": "c39159cf-2b1d-4815-8e28-c52979b1394e",
  "userName": "Maya",
  "email": "maya123@gmail.com",
  "phoneNumber": "98456321452",
  "user_RolesDetail": [
    {
      "id": "2346294b-ea34-486e-a0de-761f5cbebe9f",
      "name": "maintainer"
    },
    {
      "id": "bb129eb6-5378-4d22-8421-ce403d506cc8",
      "name": "admim"
    },
    {
      "id": "ea193f3c-49a1-4b6a-8834-1f0a97c960ff",
      "name": "superAdmin25"
    }
  ]
}


const UserManageDisplay = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isUserRole, setIsUserRole] = useState(defData);

  const viewItem = async (itemId) => {
    try {
      const fetchedItem = await ManagemetServices.view(itemId);
      setIsUserRole(fetchedItem);
      setLoading(false);
    } catch (error) {
      console.error("Error viewing item:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    viewItem(uuid);
  }, [uuid]);

  return (
    <React.Fragment>
    <div className="page-content">
      <Button
        className="btn btn-soft-success mb-3 text-start"
        onClick={() => navigate(`/user-management`)}
      >
        Back to List
      </Button>
      <Container fluid>
        <Row>
          <Col lg={12}>
            <div className="table-responsive">
              <Row>
                <Col lg={6}>
                  <Card>
                    <CardBody>
                      <span className="placeholder col-12  mb-5 pt-5  bg-success rounded-3"></span>

                      <div className="table-responsive">
                        <Table>
                          <thead className="ml-0 bg-light">
                            <tr>

                            <th >S.N</th>
                            <th >Name</th>
                           
                         </tr>
                          </thead>
                          <tbody>
{isUserRole.user_RolesDetail && Array.isArray(isUserRole.user_RolesDetail) ? (
                            isUserRole.user_RolesDetail.map((userRoles, index) => (
                              <tr key={userRoles.id}>
                                <td>{index + 1}</td>
                              <td>{userRoles.name}</td>
                                
                              </tr>
                            ))
                          ) : (
                            // Display a loading message when data is not available
                            <tr>
                              <td colSpan="7">Loading...</td>
                            </tr>
                          )}
</tbody>{" "}
                        </Table>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={6}>
                  <Card>
                    <CardBody>
<p>User Roles Details</p>

                      <table className="table table-bordered">
                        <tbody>
                        
                          
                          <tr>
                            <th className="ps-5" scope="row">
                              User Name:
                            </th>
                            <td className="text-muted">
                              {isUserRole?.userName}


                            </td>
                          </tr>
    <tr>
                            <th className="ps-5" scope="row">
                              E-mail:
                            </th>
                            <td className="text-muted">
                              {isUserRole?.email}


                            </td>
                          </tr>
 <tr>
                            <th className="ps-5" scope="row">
                              Phone Number:
                            </th>
                            <td className="text-muted">
                              {isUserRole?.phoneNumber}


                            </td>
                          </tr>
                       
                        </tbody>
                      </table>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  </React.Fragment>
  );
};

export default UserManageDisplay;