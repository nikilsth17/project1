// import React, { useEffect, useState } from "react";
// import LoggerService from "../../services/LoggerServices/LoggerServices";
// import { Col, Container, Row } from "reactstrap";
// import { useNavigate } from "react-router-dom";
// import BreadCrumb from "../../Components/Common/BreadCrumb";
// import { Triangle } from "react-loader-spinner";
// import toast from "react-hot-toast";

// const Logger = () => {
//   const [loggerList, setLoggerList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const fetchLoggerList = async () => {
//     try {
//       setLoading(true);
//       const response = await LoggerService.getList();
//       setLoggerList(response);
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       console.log("🚀 ~ fetchLoggerList ~ error:", error);
//       // toast.error(error.response?.data, { autoClose: 3000 });
//     }
//   };

//   useEffect(() => {
//     fetchLoggerList();
//   }, []);

//   // const breadcrumbItems = [{ title: "< Logger File", link: "/logger" }];

//   return (
//     <Container fluid>
//       <div className="page-content">
//         <BreadCrumb title="Logger File" pageTitle="Logger" />
//         {loading && (
//           <Row className="justify-content-center align-items-center">
//             <Col xs={2}>
//               <Triangle
//                 visible={true}
//                 height={80}
//                 width={80}
//                 color="#5B71B9"
//                 ariaLabel="triangle-loading"
//                 wrapperStyle={{}}
//                 wrapperClass=""
//               />
//               <h6 className="mt-2">Loading...</h6>
//             </Col>
//           </Row>
//         )}

//         {!loading && loggerList.length === 0 && (
//           <Row className="justify-content-center align-items-center">
//             <p className="p-2 pt-5 justify-content-center align-item-center">
//               <Col xs={12} className="text-center">
//                 <img
//                   src="/blankdata.png"
//                   alt="No data available"
//                   style={{ width: "400px", height: "300px" }}
//                 />
//               </Col>
//             </p>
//           </Row>
//         )}

//         {!loading && loggerList.length > 0 && (
//           <Row>
//             {loggerList.map((item) => (
//               <Col
//                 key={item}
//                 onClick={() => {
//                   navigate(`/logger/${item}`);
//                 }}
//                 xs={3}
//                 md={2}
//                 className="mb-2 text-center cursor-pointer"
//               >
//                 <img
//                   src="folder.png"
//                   alt={`Folder ${item}`}
//                   style={{ width: "70px", height: "70px" }}
//                 />
//                 <div className="mt-0 fw-semibold">{item}</div>
//               </Col>
//             ))}
//           </Row>
//         )}
//       </div>
//     </Container>
//   );
// };

// export default Logger;

import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "reactstrap";
import SimpleBar from "simplebar-react";
import { Triangle } from "react-loader-spinner";
import LoggerService from "../../services/LoggerServices/LoggerServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "../../Components/Common/BreadCrumb";

const Logger = () => {
  const [loggerList, setLoggerList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const fetchLoggerList = async () => {
    try {
      setLoading(true);
      const response = await LoggerService.getList();
      setLoggerList(response);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("🚀 ~ fetchLoggerList ~ error:", error);
      toast.error("An error occurred while fetching data.", {
        autoClose: 3000,
      });
    }
  };

  const fetchFolderDetails = async (folderId) => {
    try {
      setLoading(true);
      const response = await LoggerService.getLogDetail(folderId);
      console.log("🚀 ~ fetchFolderDetails ~ folderId:", folderId);
      setSelectedFolder(response);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("🚀 ~ fetchFolderDetails ~ error:", error);
      toast.error("An error occurred while fetching folder details.", {
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchLoggerList();
  }, []);

  const handleFolderClick = (folderId) => {
    fetchFolderDetails(folderId);
    console.log("🚀 ~ handleFolderClick ~ folderId:", folderId);
  };

  return (
    <React.Fragment>
      <ToastContainer closeButton={false} />

      <div className="page-content">
        <BreadCrumb title="Logger" pageTitle="Logger List" />
        <Container fluid>
          <Card>
            <Row className="p-1">
              <Col lg={3}>
                <SimpleBar className="file-manager-sidebar">
                  <ul
                    className="list-unstyled file-manager-menu"
                    style={{
                      maxHeight: "400px",
                      maxWidth: "200px",
                      overflowY: "auto",
                    }}
                  >
                    <div className="p-3 ">
                      {loggerList.map((folder, index) => (
                        <li key={folder.id}>
                          <div
                            className="folder-item"
                            onClick={() => handleFolderClick(folder)}
                          >
                            <div className="d-flex gap-2">
                              <li>{index + 1}.</li>

                              <img
                                src="folder.png"
                                alt={`Folder ${folder.name}`}
                                style={{ width: "40px", height: "40px" }}
                              />
                              <p className="pt-2">{folder}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </div>
                  </ul>
                </SimpleBar>
              </Col>

              <Col lg={9} className="pt-4">
                {loading ? (
                  <Row className="justify-content-center align-items-center ">
                    <Col xs={2}>
                      <Triangle
                        visible={true}
                        height="80"
                        width="80"
                        color="#5B71B9"
                        ariaLabel="triangle-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                      />
                      <h6 className="mt-2">Loading...</h6>
                    </Col>
                  </Row>
                ) : selectedFolder ? (
                  <Card className="p-2">{selectedFolder}</Card>
                ) : (
                  <Row className="justify-content-center align-items-center">
                    <p className="p-2 pt-5 justify-content-center align-item-center">
                      <Col xs={12} className="text-center">
                        <img
                          src="blankdata.png"
                          alt="No data available"
                          style={{ width: "400", height: "300px" }}
                        />
                      </Col>
                    </p>
                  </Row>
                )}
              </Col>
            </Row>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Logger;
