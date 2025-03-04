import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Row } from "reactstrap";

const Pagination = ({
  data,
  currentPage,
  setCurrentPage,
  perPageData,
  className,
}) => {
  const handleClick = (e) => {
    setCurrentPage(e);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data?.length / perPageData); i++) {
    pageNumbers.push(i);
  }
  const handleprevPage = () => {
    let prevPage = currentPage - 1;
    setCurrentPage(prevPage);
  };
  const handlenextPage = () => {
    let nextPage = currentPage + 1;
    setCurrentPage(nextPage);
  };

  useEffect(() => {
    if (pageNumbers.length && pageNumbers.length < currentPage) {
      setCurrentPage(pageNumbers.length);
    }
  }, [pageNumbers.length, currentPage, setCurrentPage]);
  return (
    <React.Fragment>
      <Row className="g-0 justify-content-end mb-4">
        <div className="col-sm-6">
          {/* <div className="text-muted">
            Showing<span className="fw-semibold ms-1">1</span> of{" "}
            <span className="fw-semibold">{data.length}</span> Results
          </div> */}
        </div>
        <div className="col-sm-auto">
          <ul className={className}>
            {currentPage <= 1 ? (
              <Link className="page-item pagination-prev disabled" href="#!">
                Previous
              </Link>
            ) : (
              <li
                className={
                  currentPage <= 1 ? "page-item disabled" : "page-item"
                }
              >
                <Link to="#!" className="page-link" onClick={handleprevPage}>
                  Previous
                </Link>
              </li>
            )}
            {pageNumbers.map((item, key) => (
              <React.Fragment key={key}>
                <li className="page-item">
                  <Link
                    to="#!"
                    className={
                      currentPage === item ? "page-link active" : "page-link"
                    }
                    onClick={() => handleClick(item)}
                  >
                    {item}
                  </Link>
                </li>
              </React.Fragment>
            ))}
            {currentPage >= pageNumbers.length ? (
              <Link className="page-item pagination-next disabled" href="#!">
                Next
              </Link>
            ) : (
              <li
                className={
                  currentPage <= 0 ? "page-item disabled" : "page-item"
                }
              >
                <Link to="#!" className="page-link" onClick={handlenextPage}>
                  Next
                </Link>
              </li>
            )}
          </ul>
        </div>
      </Row>
    </React.Fragment>
  );
};

export default Pagination;
