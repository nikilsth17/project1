import React, { useState } from "react";
import { Link } from "react-router-dom"; // Assuming you are using React Router

const NavigationButtons = ({ searchResults }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Change this number to the desired items per page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = searchResults.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(searchResults.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <div className="pagination-wrap hstack gap-2">
        <Link
          className={`page-item pagination-prev ${
            currentPage === 1 ? "disabled" : ""
          }`}
          to="#"
          onClick={handlePreviousPage}
        >
          Previous
        </Link>
        <ul className="pagination listjs-pagination mb-0"></ul>
        <Link
          className={`page-item pagination-next ${
            currentPage >= Math.ceil(searchResults.length / itemsPerPage)
              ? "disabled"
              : ""
          }`}
          to="#"
          onClick={handleNextPage}
        >
          Next
        </Link>
      </div>
    </div>
  );
};

export default NavigationButtons;
