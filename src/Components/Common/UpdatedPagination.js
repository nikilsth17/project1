import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Row, Pagination, PaginationItem, PaginationLink } from "reactstrap";

const UpdatedPagination = ({
  data,
  currentPage,
  setCurrentPage,
  perPageData,
  className,
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = (e) => {
    setCurrentPage(e);
  };

  const handleprevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handlenextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const getDisplayedPages = useCallback(() => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(data?.length / perPageData); i++) {
      pageNumbers.push(i);
    }

    // Show fewer pages on mobile screens
    const isMobile = windowWidth < 768;
    const visiblePages = isMobile ? 3 : 5;

    if (pageNumbers.length <= visiblePages) {
      return pageNumbers;
    }

    let displayedPages = [];
    const halfVisible = Math.floor(visiblePages / 2);

    if (currentPage <= halfVisible + 1) {
      // Near start
      displayedPages = [...pageNumbers.slice(0, visiblePages - 1)];
      if (pageNumbers.length > visiblePages) {
        displayedPages.push('...', pageNumbers[pageNumbers.length - 1]);
      }
    } else if (currentPage >= pageNumbers.length - halfVisible) {
      // Near end
      displayedPages = [1, '...'];
      displayedPages.push(...pageNumbers.slice(-1 * (visiblePages - 1)));
    } else {
      // Middle
      displayedPages = [1, '...'];
      const startPage = currentPage - Math.floor((visiblePages - 4) / 2);
      const endPage = startPage + (visiblePages - 4);
      displayedPages.push(...pageNumbers.slice(startPage - 1, endPage));
      displayedPages.push('...', pageNumbers[pageNumbers.length - 1]);
    }

    return displayedPages;
  }, [currentPage, data?.length, perPageData, windowWidth]);

  useEffect(() => {
    const pageNumbers = Math.ceil(data?.length / perPageData);
    if (pageNumbers && pageNumbers < currentPage) {
      setCurrentPage(pageNumbers);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [data?.length, currentPage, perPageData, setCurrentPage]);

  const displayedPages = getDisplayedPages();

  return (
    <Row className="g-0 justify-content-end mb-4">
      <div className="col-auto">
        <Pagination size={windowWidth < 768 ? "sm" : ""} className={className}>
          <PaginationItem disabled={currentPage <= 1}>
            <PaginationLink
              previous
              onClick={handleprevPage}
              href="#"
            >
              {windowWidth < 768 ? '←' : 'Previous'}
            </PaginationLink>
          </PaginationItem>

          {displayedPages.map((item, key) => (
            <PaginationItem 
              key={key} 
              active={currentPage === item}
              disabled={item === '...'}
            >
              <PaginationLink
                href="#"
                onClick={() => item !== '...' ? handleClick(item) : null}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem 
            disabled={currentPage >= Math.ceil(data?.length / perPageData)}
          >
            <PaginationLink
              next
              onClick={handlenextPage}
              href="#"
            >
              {windowWidth < 768 ? '→' : 'Next'}
            </PaginationLink>
          </PaginationItem>
        </Pagination>
      </div>
    </Row>
  );
};

export default UpdatedPagination;