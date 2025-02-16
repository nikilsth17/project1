import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Container,Row,Col,CardHeader,Button, Card, CardBody } from 'reactstrap'

const Searchpage = () => {
  const navigate = useNavigate();
  return (
    <div>    
        <React.Fragment>
    
        <Container fluid>
       
        {/* <CardHeader>
                    <div className="d-flex align-items-center">
                        <h5 className="card-title mb-0 flex-grow-1 fs-17">
                        Add, Edit & Remove
                        </h5>
                        <div className="flex-shrink-0">
                          <div className="d-flex gap-2 flex-wrap">
                            <Button
                              className="btn btn-success"
                            //  onClick={() => navigate('/system-user/create')}
                            >
                              + New Users
                            </Button>
                          </div>
                        </div>
                      </div>
                      </CardHeader> */}
                   
                      <div>
         <Row>
    <Col className="col-sm">
                                <div className="d-flex justify-content-sm-right">
                                    <div className="search-box ms-2">
                                        <input type="text" className="form-control search" placeholder="Search..."
                                   />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        </div>
                    
                        </Container>
                        
                       
</React.Fragment>
                        </div>
  )
}

export default Searchpage