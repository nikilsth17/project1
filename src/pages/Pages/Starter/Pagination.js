import React from "react";
import { Link } from "react-router-dom";

function TablePagination({
  pagesCount,
  currentPage,
  handlePreviousClick,
  handleNextClick,
  handlePageClick,
}) {
  const preventDefault = (event) => {
    event.preventDefault();
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const visiblePageRange = 5; // Adjust this value as needed

    let startPage, endPage;

    if (pagesCount <= visiblePageRange) {
      startPage = 1;
      endPage = pagesCount;
    } else {
      if (currentPage <= Math.ceil(visiblePageRange / 2)) {
        startPage = 1;
        endPage = visiblePageRange;
      } else if (currentPage > pagesCount - Math.floor(visiblePageRange / 2)) {
        startPage = pagesCount - visiblePageRange + 1;
        endPage = pagesCount;
      } else {
        startPage = currentPage - Math.floor(visiblePageRange / 2);
        endPage = startPage + visiblePageRange - 1;
      }
    }

    // Render page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <Link
            to="#"
            className="page-link"
            onClick={(event) => {
              preventDefault(event);
              handlePageClick(i); // Call handlePageClick with the page number
            }}
          >
            {i}
          </Link>
        </li>
      );
    }

    if (startPage > 1) {
      pageNumbers.unshift(
        <li key="startEllipsis" className="page-item disabled">
          <Link
            to="#"
            className="page-link"
            onClick={(event) => {
              preventDefault(event);
              handlePageClick(1); // Go to page 1
            }}
          >
            ...
          </Link>
        </li>
      );
    }

    if (endPage < pagesCount) {
      pageNumbers.push(
        <li key="endEllipsis" className="page-item disabled">
          <Link
            to="#"
            className="page-link"
            onClick={(event) => {
              preventDefault(event);
              handlePageClick(pagesCount); // Go to the last page
            }}
          >
            ...
          </Link>
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="d-flex justify-content-end">
      <div className="pagination-wrap hstack gap-2">
        <Link
          className={`page-item pagination-prev ${
            currentPage <= 1 ? "disabled" : ""
          }`}
          to="#"
          onClick={(event) => {
            preventDefault(event);
            handlePageClick(1);
          }}
        >
          <i class="bx bx-chevrons-left fs-5"></i>
        </Link>
        <Link
          className={`page-item pagination-prev ${
            currentPage <= 1 ? "disabled" : ""
          }`}
          to="#"
          onClick={(event) => {
            preventDefault(event);
            if (currentPage > 1) {
              handlePreviousClick(currentPage - 1);
            }
          }}
        >
          <i class="bx bx-chevron-left fs-5"></i>
        </Link>
        <ul className="pagination listjs-pagination mb-0">
          {renderPageNumbers()}
        </ul>
        <Link
          className={`page-item pagination-next ${
            currentPage >= pagesCount ? "disabled" : ""
          }`}
          to="#"
          onClick={(event) => {
            preventDefault(event);
            if (currentPage < pagesCount) {
              handleNextClick(currentPage + 1);
            }
          }}
        >
          <i class="bx bx-chevron-right fs-5"></i>
        </Link>
        <Link
          className={`page-item pagination-next ${
            currentPage >= pagesCount ? "disabled" : ""
          }`}
          to="#"
          onClick={(event) => {
            preventDefault(event);
            handlePageClick(pagesCount);
          }}
        >
          <i class="bx bx-chevrons-right fs-5"></i>
        </Link>
      </div>
    </div>
  );
}

export default TablePagination;
