import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import { RiSearchLine } from 'react-icons/ri'; 
const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <Row className="mb-3">
      <Col sm={4}>
        <div className="input-group justify-content-end">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={handleSearch}
          >
                  <RiSearchLine />
          </button>
        </div>
      </Col>
    </Row>
  );
};

export default Search;
