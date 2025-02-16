import React, { useState, useEffect } from 'react'
import LayoutWithBreadCrumb from '../../Pages/Starter/LayoutWithBreadCrumb';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import {
  Row,
  Col, Button, ButtonGroup, Card, CardBody, CardHeader, Container, Input, Label, Form, FormGroup
} from 'reactstrap';
import ManagemetServices from '../../../services/Inventory Services/ManagemetServices';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Select from "react-select";
import SystemServices from '../../../services/Inventory Services/SystemServices';
import { isValidPhoneNumber } from '../../Pages/Starter/PhonenumberValidation';


const UserManageEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log(id);
  const initialFormData = {
    id: "",
    userName: "",
    email: "",
    phoneNumber: "",
    user_Roles: []
  }

  const [formData, setFormData] = useState(initialFormData);
  const [userRole, setUserRole] = useState([]);

  const [isValidTelNo, setIsValidTelNo] = useState(true);
  const [selectedMulti2, setselectedMulti2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();




  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedRole = await SystemServices.getList();
        setUserRole(fetchedRole);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);



  // useEffect(() => {
  //   if (id && isEditing) {
  //     // If both id and isEditing are truthy, fetch the item data for editing
  //     ProductCategoriesServices.view(id)
  //       .then((item) => {
  //         setFormData(item);
  //       })
  //       .catch((error) => console.error('Error fetching item:', error));
  //   }
  // }, [id, isEditing]);







  useEffect(() => {
    if (id) {
      // If there's an id, it means we are editing an existing category
      setIsEditing(true);
      ManagemetServices.view(id)
        .then((item) => {
          setFormData({
            userName:item.userName,
            email:item.email,
            phoneNumber:item.phoneNumber,
            user_Roles: item.user_RolesDetail,

          });
        })
        .catch((error) => console.error("Error fetching item:", error));
    } else {
      setIsEditing(false);
      setFormData(initialFormData);
    }
  }, [id]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
     // Validate the phone number
     if (name === 'phoneNumber') {
      setIsValidTelNo(isValidPhoneNumber(value));
    }
  };



  const handleUserRolesChange = (selectedOptions) => {
    setFormData({ ...formData, user_Roles: selectedOptions });
  };


  const handleSave = async (e) => {
    e.preventDefault();
    try {
      var request = {...formData};
      request.user_Roles=request.user_Roles.map((x)=>({
        "name":x.label, 
      }));

      if (formData.id) {
        // Editing an existing role with a UUID
        await ManagemetServices.update(formData.id, formData);
        console.log('Role updated successfully');
      } else {
     
      const response = await ManagemetServices.create(request);
      console.log('Category created:', response);

       } navigate('/user-management');
       } // Redirect to the item list after create/update
     catch (error) {
      console.error('Error creating/updating category:', error);
    }
  };




  return (
    <React.Fragment>
      <div className='page-content'>
        <BreadCrumb title="User Management Form" pageTitle="User Management " />
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card >
               
                <CardBody>
                  <Row>
                    <Col>
                      <Form onSubmit={handleSave}>
                           <FormGroup row>
                         
                            <Label for="userName" sm={2}>
                              userName:
                            </Label>
                          
                          <Col sm={4}>
                            <Input
                              type="text"
                              name="userName"
                              id="userName"
                              value={formData.userName}
                              onChange={handleInputChange}
                              // placeholder="Enter userName"
                              required
                            />
                          </Col>
                          
                            <Label for="email" sm={2}>
                              E-mail:
                            </Label>
                         
                          <Col sm={4}>
                            <Input
                              type="email"
                              name="email"
                              id="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              // placeholder="Enter email"
                              required
                            />
                          </Col>
                        </FormGroup>



                        <FormGroup row>
                         
                            <Label for="phoneNumber" sm={2}>
                              Phone Number:
                            </Label>
                       
                          <Col sm={4}>
                           
                             <Input
            type="text"
            className="form-control"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
          {!isValidTelNo && (
            <p style={{ color: 'red' }}>Invalid phone number. Please enter a 10-digit number.</p>
          )}
                          </Col>
                          <Label for="user_Roles" sm={2}>
                            User Roles:
                          </Label>
                          <Col sm={4}>
                            <Select
                              value={formData.user_Roles}
                              isMulti
                              isClearable

                              onChange={handleUserRolesChange}
                              options={userRole.map((role) => ({
                                value: role.id,
                                label: role.name,
                              }))}
                            />
                          </Col>
                        </FormGroup>



                        {/* <Col sm={3}>
              <Label for="user_Roles" sm={4}>
              User_Roles:
              </Label>
              </Col>
            <Col sm={3}>
                        <select 
                          type="text"
                          id="user_Roles"
                          placeholder="Enter user_Roles"
                          value={formData.user_Roles.name}
                          name="user_Roles"
                          onChange={handleInputChange}
                          className="form-control"
                        >
                          <option value="">Select userRole</option>
                          {userRole.map((role) => (
                            <option key={role.id} value={role.name}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </Col> */}


                        
                          <div className='text-end'>
                            <Button type="submit" >
                              Save
                            </Button>
                          </div>
                        
                      </Form>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default UserManageEditor