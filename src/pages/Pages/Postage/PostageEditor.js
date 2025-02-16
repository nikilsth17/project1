// // import React, { useEffect, useState } from "react";
// // import {
// //   Button,
// //   Col,
// //   Container,
// //   FormGroup,
// //   Label,
// //   Row,
// //   Form,
// //   Card,
// //   CardBody,
// // } from "reactstrap";

// // import PostageService from "../../../services/AccountingServices/PostageService";
// // import Select from "react-select";
// // import { Link, useNavigate } from "react-router-dom";
// // import { Navigate } from "react-router-dom";

// // const PostageEditor = (props) => {

// //   const [filteredPostage, setFilteredPostage] = useState([]);
// //   const [fromPostage, setFromPostage] = useState(null);
// //   // const [toPostage, setToPostage] = useState(null);
// //   const navigate=useNavigate();

// //   // Function to fetch postcode data based on the query
// //   const fetchPostcodeData = async (query) => {
// //     try {
// //       alert(query);
// //       const data = await PostageService.getList(query);
// //       console.log(data);
// //       const postcodeOptions = data.map((item) => ({
// //         value: item.postCode,
// //         label: item.postCode,
// //       }));
// //       setFilteredPostage(postcodeOptions);
// //     } catch (error) {
// //       console.error("Error fetching Postcode list:", error);
// //     }
// //   };

// //   const handleCreatePost = async (event) => {
// //     event.preventDefault();
// //     try {

// //       navigate("/postage-display");
// //     } catch (error) {
// //       console.error("Error creating/updating:", error);
// //     }
// //   };

// //   return (
// //     <React.Fragment>
// //       <div className="page-content">
// //         <Container fluid>
// //           <Row>
// //             <Col lg={12}>
// //               <Card>
// //                 <CardBody>
// //                   <Form onSubmit={handleCreatePost}>
// //                     <FormGroup row className="mt-10">
// //                       <Label htmlFor="fromPostage" className="form-label" sm={2}>
// //                         From Postage
// //                       </Label>
// //                       <Col sm={3}>
// //                         <Select
// //                           options={filteredPostage}
// //                           value={fromPostage}
// //                           onInputChange={(inputValue) => {
// //                             if(inputValue=="")return;
// //                             // Call the function to filter Postage based on input
// //                             fetchPostcodeData(inputValue);
// //                           }}
// //                           onChange={(selectedOption) => setFromPostage(selectedOption)}
// //                           isSearchable
// //                           placeholder="Search for a Postcode"
// //                         />
// //                       </Col>
// //                       {/* <Label htmlFor="toPostage" className="form-label" sm={2}>
// //                         To Postage
// //                       </Label>
// //                       <Col sm={3}>
// //                         <Select
// //                           options={filteredPostage}
// //                           value={toPostage}
// //                           onInputChange={(inputValue) => {
// //                             // Call the function to filter Postage based on input
// //                             // fetchPostcodeData(inputValue);
// //                           }}
// //                           onChange={(selectedOption) => setToPostage(selectedOption)}
// //                           isSearchable
// //                           placeholder="Search for a Postcode"
// //                         />
// //                       </Col> */}
// //                       <Col sm={3}>
// //                         <Button color="btn btn-soft-danger" className="btn-md gap-1">
// //                           <Link to={`/postage-display`}>Go</Link>
// //                         </Button>
// //                       </Col>
// //                     </FormGroup>
// //                   </Form>
// //                 </CardBody>
// //               </Card>
// //             </Col>
// //           </Row>
// //         </Container>
// //       </div>
// //     </React.Fragment>
// //   );
// // };

// // export default PostageEditor;
// import React, { useState } from 'react';
// import { Input, List, Form, Button, Label, CardBody, Row, Col, Card, CardTitle, CardText, FormGroup} from 'reactstrap';
// import { useEffect } from 'react';
// import axios from "axios";
// import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import ScrollBar from 'react-perfect-scrollbar';

// const PostageEditor = () => {
//   const [users, setUsers] =useState([]);
//   const [text, setText] =useState();
//   const [fromPostalCode, setFromPostalCode] =useState();
//   const [toPostalCode, setToPostalCode] =useState();
//   const [tousers, setToUsers] =useState([]);
//   const [totext, setToText] =useState();
//   const navigate=useNavigate();
//   const [data, setData] =useState([]);

//     const loadUser = async(query) => {
//        const response =  await axios.get(`http://api.parcelcalculator.sebs.asia/PostalCode/search?query=`+query)
//        console.log(response)
//       setUsers(response);
//     }
//     const loadToUser = async(query) => {
//       const response =  await axios.get(`http://api.parcelcalculator.sebs.asia/PostalCode/search?query=`+query)
//       console.log(response)
//      setToUsers(response);
//    }
//    const fetchPosts = async() => {
//     const response =  await axios.get(`http://api.parcelcalculator.sebs.asia/DeliveryCatalogue/services?FromPostalCode=`+fromPostalCode+'&ToPostalCode='+toPostalCode)
//     console.log(response)
//    setData(response);
//  }
//    const onUserHandler =(location,isFromCode)=>{
//     let simplifiedLocation = location.location+" "+location.state+" "+location.postCode;
//     if(isFromCode){
//       setFromPostalCode(location.postCode);
//       setText(simplifiedLocation);
//     }
//     else {
//       setToPostalCode(location.postCode);   setToText(simplifiedLocation);
//     }

//     setUsers ([]);
//    }
//   const OnChnageHandler = (text) =>{
//     setText(text);
//     if(text.length >= 3){

//       loadUser(text);
//     }
//     else{
//       setUsers([]);
//     }

//   }

//   const OnToChangeHandler = (totext) =>{
//     setToText(totext);
//     if(totext.length >= 3){

//       loadToUser(totext);
//     }
//     else{
//       setToUsers([]);
//     }

//   }
//   const handleReportClick = () => {
//     fetchPosts(fromPostalCode, toPostalCode);
//   };

//   return (
//     <div className='page-content'>
//       <Row>
//       <Col lg={12}>
//           <Card>
//             <CardBody>
//        <FormGroup row>
//         <Label htmlFor="fromPostage" className="form-label" sm={2}>
//          From Postage
//        </Label>
//        <Col sm={3}>
//        <div>
//           <Input type='text' className='col-md-12 input'
//             onChange={ e => OnChnageHandler(e.target.value)}
//             value={text} />

//           {users && users.map((user , i) =>
//            <div key={i} onClick={()=>onUserHandler(user,true)}>{user.location} {user.state}{user.postCode}</div>
//           )}
//       </div>
//         </Col>

//         <Label htmlFor="toPostage" className="form-label" sm={2}>
//         To Postage
//        </Label>
//        <Col sm={3}>
//        <div>
//           <Input type='text' className='col-md-12 input'
//             onChange={ e => OnToChangeHandler(e.target.value)}
//             value={totext} />

//           {tousers && tousers.map((user , i) =>
//            <div key={i} onClick={()=>onUserHandler(user,false)}>
//             <ScrollBar>
//             {user.location} {user.state}{user.postCode}</ScrollBar></div>
//           )}
//       </div>
//        </Col>
//        <Col sm={1}>
//        <Button color="btn btn-soft-success" className="btn-md gap-1" onClick={handleReportClick}>
//                       <Link to={`/postage-form/${fromPostalCode}/${toPostalCode}`}>Go</Link>
//                        </Button>
//                        </Col>
//        </FormGroup>
//        </CardBody>
//        </Card>

//       </Col>
//       </Row>

//     </div>
//   );
// };

// export default PostageEditor;

// import React, { useState } from "react";
// import {
//   Input,
//   List,
//   Form,
//   Button,
//   Label,
//   CardBody,
//   Row,
//   Col,
//   Card,
//   CardTitle,
//   CardText,
// } from "reactstrap";
// import { useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";

// const PostageEditor = () => {
//   const [users, setUsers] = useState([]);
//   const [text, setText] = useState();
//   const [fromPostalCode, setFromPostalCode] = useState();
//   const [toPostalCode, setToPostalCode] = useState();
//   const [tousers, setToUsers] = useState([]);
//   const [totext, setToText] = useState();
//   const navigate = useNavigate();
//   const [data, setData] = useState([]);

//   const loadUser = async (query) => {
//     const response = await axios.get(
//       `http://api.parcelcalculator.sebs.asia/PostalCode/search?query=` + query
//     );
//     console.log(response);
//     setUsers(response);
//   };
//   const loadToUser = async (query) => {
//     const response = await axios.get(
//       `http://api.parcelcalculator.sebs.asia/PostalCode/search?query=` + query
//     );
//     console.log(response);
//     setToUsers(response);
//   };
//   const fetchPosts = async () => {
//     const response = await axios.get(
//       `http://api.parcelcalculator.sebs.asia/DeliveryCatalogue/services?FromPostalCode=` +
//         fromPostalCode +
//         "&ToPostalCode=" +
//         toPostalCode
//     );
//     console.log(response);
//     setData(response);
//   };
//   const onUserHandler = (location, isFromCode) => {
//     let simplifiedLocation =
//       location.location + " " + location.state + " " + location.postCode;
//     if (isFromCode) {
//       setFromPostalCode(location.postCode);
//       setText(simplifiedLocation);
//     } else {
//       setToPostalCode(location.postCode);
//       setToText(simplifiedLocation);
//     }

//     setUsers([]);
//   };
//   const OnChnageHandler = (text) => {
//     setText(text);
//     if (text.length >= 3) {
//       loadUser(text);
//     } else {
//       setUsers([]);
//     }
//   };

//   const OnToChangeHandler = (totext) => {
//     setToText(totext);
//     if (totext.length >= 3) {
//       loadToUser(totext);
//     } else {
//       setToUsers([]);
//     }
//   };
//   const handleReportClick = () => {
//     fetchPosts(fromPostalCode, toPostalCode);
//   };

//   return (
//     <div className="page-content">
//       <Row>
//         <Card>
//           <CardBody>
//             <Row>
//               <Label htmlFor="fromPostage" className="form-label" sm={2}>
//                 From Postage
//               </Label>
//               <Col sm={2}>
//                 <div>
//                   <Input
//                     type="text"
//                     className="col-md-12 input"
//                     onChange={(e) => OnChnageHandler(e.target.value)}
//                     value={text}
//                   />
//                   {(users??[]).length >0&& (
//                     <div style={{ height: "200px", overflowY: "scroll" }}>
//                       {users?.map((user, i) => (
//                         <div key={i} onClick={() => onUserHandler(user, true)}>
//                           {user.location} {user.state}
//                           {user.postCode}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </Col>

//               <Label htmlFor="toPostage" className="form-label" sm={2}>
//                 To Postage
//               </Label>
//               <Col sm={2}>
//                 <div>
//                   <Input
//                     type="text"
//                     className="col-md-12 input"
//                     onChange={(e) => OnToChangeHandler(e.target.value)}
//                     value={totext}
//                   />

//                   {!!tousers.length && (
//                     <div style={{ height: "200px", overflowY: "scroll" }}>
//                       {tousers?.map((user, i) => (
//                         <div key={i} onClick={() => onUserHandler(user, true)}>
//                           {user.location} {user.state}
//                           {user.postCode}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </Col>
//               <Col sm={3}>
//                 <Button
//                   color="btn btn-soft-danger"
//                   className="btn-md gap-1"
//                   onClick={handleReportClick}
//                 >
//                   <Link to={`/postage-form/${fromPostalCode}/${toPostalCode}`}>
//                     Go
//                   </Link>
//                 </Button>
//               </Col>
//             </Row>
//           </CardBody>
//         </Card>
//       </Row>
//     </div>
//   );
// };
// export default PostageEditor;

import React, { useState } from "react";
import {
  Input,
  List,
  Form,
  Button,
  Label,
  CardBody,
  Row,
  Col,
  Card,
  CardTitle,
  CardText,
} from "reactstrap";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const PostageEditor = () => {
  const [users, setUsers] = useState([]);
  const [text, setText] = useState();
  const [fromPostalCode, setFromPostalCode] = useState();
  const [toPostalCode, setToPostalCode] = useState();
  const [tousers, setToUsers] = useState([]);
  const [totext, setToText] = useState();
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const loadUser = async (query) => {
    const response = await axios.get(
      `http://api.parcelcalculator.sebs.asia/api/PostalCode/search?query=` +
        query
    );
    console.log(response);
    setUsers(response);
  };
  const loadToUser = async (query) => {
    const response = await axios.get(
      `http://api.parcelcalculator.sebs.asia/api/PostalCode/search?query=` +
        query
    );
    console.log(response);
    setToUsers(response);
  };
  const fetchPosts = async () => {
    const response = await axios.get(
      `http://api.parcelcalculator.sebs.asia/api/DeliveryCatalogue/services?FromPostalCode=` +
        fromPostalCode +
        "&ToPostalCode=" +
        toPostalCode
    );
    console.log(response);
    setData(response);
  };
  const onUserHandler = (location, isFromCode) => {
    let simplifiedLocation =
      location.location + " " + location.state + " " + location.postCode;
    if (isFromCode) {
      setFromPostalCode(location.postCode);
      setText(simplifiedLocation);
    } else {
      setToPostalCode(location.postCode);
      setToText(simplifiedLocation);
    }
    setUsers([]);
    setToUsers([]);
  };
  const OnChnageHandler = (text) => {
    setText(text);
    if (text.length >= 3) {
      loadUser(text);
    } else {
      setUsers([]);
    }
  };

  const OnToChangeHandler = (totext) => {
    setToText(totext);
    if (totext.length >= 3) {
      loadToUser(totext);
    } else {
      setToUsers([]);
    }
  };
  const handleReportClick = () => {
    fetchPosts(fromPostalCode, toPostalCode);
  };

  return (
    <div className="page-content">
      <Row>
        <Card>
          <CardBody>
            <Row>
              <Label htmlFor="fromPostage" className="form-label" sm={2}>
                From Postage
              </Label>
              <Col sm={3}>
                <div>
                  <Input
                    type="text"
                    className="col-md-12 input"
                    onChange={(e) => OnChnageHandler(e.target.value)}
                    value={text}
                  />
                  {!!users.length && (
                    <div style={{ height: "200px", overflowY: "scroll" }}>
                      {users?.map((user, i) => (
                        <div key={i} onClick={() => onUserHandler(user, true)}>
                          {user.location} {user.state} {user.postCode}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Col>

              <Label htmlFor="toPostage" className="form-label" sm={2}>
                To Postage
              </Label>
              <Col sm={3}>
                <div>
                  <Input
                    type="text"
                    className="col-md-12 input"
                    onChange={(e) => OnToChangeHandler(e.target.value)}
                    value={totext}
                  />

                  {!!tousers.length && (
                    <div style={{ height: "200px", overflowY: "scroll" }}>
                      {tousers?.map((user, i) => (
                        <div key={i} onClick={() => onUserHandler(user, false)}>
                          {user.location} {user.state} {user.postCode}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Col>
              <Col sm={1}>
                <Button
                  color="btn btn-soft-danger"
                  className="btn-md gap-1"
                  onClick={handleReportClick}
                >
                  <Link to={`/postage-form/${fromPostalCode}/${toPostalCode}`}>
                    Go
                  </Link>
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Row>
    </div>
  );
};
export default PostageEditor;
