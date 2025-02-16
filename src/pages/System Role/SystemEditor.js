import React, { useState,useEffect } from 'react'
import LayoutWithBreadCrumb from '../Pages/Starter/LayoutWithBreadCrumb'
import BreadCrumb from '../../Components/Common/BreadCrumb'
import { CardBody, CardHeader,Card, Row, Col, Label, Input, FormGroup,Button, Form } from 'reactstrap'
import SystemServices from '../../services/Inventory Services/SystemServices'
import { useNavigate, useParams } from 'react-router-dom'
import { uniqueId } from 'lodash'


const SystemEditor = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const initialFormData = {
    name: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleSave = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (uuid) {
  //       // If there's a UUID, it's an update operation
  //       await SystemServices.update(uuid, formData);
  //       console.log("Category updated successfully");
  //     } else {
  //       const response = await SystemServices.create(formData);
  //       console.log('Category created:', response);
  //     }
  //     navigate('/system-user');
  //   } catch (error) {
  //     console.error('Error creating/updating category:', error);
  //   }
  // };

  const handleSave = async (e) => {
  e.preventDefault();

  try {
    if (formData.id) {
      // Editing an existing role with a UUID
      await SystemServices.update(formData.id, formData);
      console.log('Role updated successfully');
    } else {
      // Creating a new role
      const response = await SystemServices.create(formData);
      console.log('Role created:', response);
    }
    navigate('/system-user');
  } catch (error) {
    console.error('Error creating/updating role:', error);
  }
};


  const viewItem = async (itemId) => {
    try {
      const fetchedItem = await SystemServices.view(itemId);
      console.log("Fetched Item:", fetchedItem);

      setFormData(fetchedItem); // Update the state with the fetched data
      setLoading(false);
    } catch (error) {
      console.error("Error viewing item:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uuid) {
      viewItem(uuid);
    } else {
      setLoading(false);
    }
  }, [uuid]);

  return (
    
      <React.Fragment>
        <div className='page-content'>
          <BreadCrumb title=" User Role Form" pageTitle="User Role " />
          <Card>
           
            <CardBody>
              <Form onSubmit={handleSave}>
                 
                <FormGroup row>
                  <Row>
                    <Col>
                      <div>
                        <Row>
                          
                            <Label for='name' sm={2}>
                              User Role:
                            </Label>
                            <Col sm={4}>
                            <Input
                              type="text"
                              name="name"
                              id="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Enter Name"
                              required
                            />
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </FormGroup>
            
                  <div className='text-end'>
                    <Button type="submit">Save</Button>
                  </div>
                
              </Form>
            </CardBody>
          </Card>
          </div>
      </React.Fragment>
  
  );
};

export default SystemEditor;