import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
  useRowSelect
} from "react-table";
import { Table, Row, Col, Button, Input, CardBody } from "reactstrap";
import { DefaultColumnFilter } from "./filters";
import './TableContainerReactTable.css'


// Define a default UI for filtering
function GlobalFilter({
  globalFilter,
  setGlobalFilter,
  SearchPlaceholder,
}) {
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <React.Fragment>
      <CardBody className="p-0">
        <form>
          <Row className="g-3 justify-content-end">
            
            <Col sm={6} className="justify-content-end d-flex p-0">
              <div className="search-box mb-2  d-inline-block">
                <input
                  onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                  }}
                  id="search-bar-0"
                  type="text"
                  className="form-control search border-0 shadow-none rounded-0 border-bottom border-dark"
                  placeholder={SearchPlaceholder}
                  value={value || ""}
                />
                <i className="bx bx-search-alt search-icon"></i>
              </div>
            </Col>
          </Row>
        </form>
      </CardBody>

    </React.Fragment>
  );
}


const TableContainer = ({
  columns,
  data,
  isPagination,
  isGlobalSearch,
  isGlobalFilter,
  customPageSize,
  tableClass,
  theadClass,
  trClass,
  thClass,
  divClass,
  SearchPlaceholder,
  styleVariant,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: 0, pageSize: customPageSize, selectedRowIds: 0, sortBy: [
          {
            desc: false,
          },
        ],
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );

  const generateSortingIndicator = (column) => {
    return column.isSorted ? (column.isSortedDesc ? <span>&#8593;</span> : <span>&#8595;</span>) : "";
  };

  const onChangeInSelect = (event) => {
    setPageSize(Number(event.target.value));
  };
  const onChangeInInput = (event) => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };

  return (
    <Fragment>
      {(isGlobalSearch || isGlobalFilter) && (
        <Row className="mb-3">
          {isGlobalSearch && (
            <Col md={1}>
              <select
                className="form-select"
                value={pageSize}
                onChange={onChangeInSelect}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </Col>
          )}
          {isGlobalFilter && (
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
              SearchPlaceholder={SearchPlaceholder}
            />
          )}
        </Row>
      )}


      <div className={divClass}>
      <div className={divClass} style={{ ...(styleVariant === 'subModule' ? { border: '1px solid #BDBAE4', borderRadius: '5px' } : {}), overflow: 'auto' }}>
        <Table hover {...getTableProps()} className={`${tableClass}  ${styleVariant} tablecss `}  >
          <thead className={`${theadClass} theadcss`}>
            {headerGroups.map((headerGroup) => (
              <tr className={`${trClass} thcss`} key={headerGroup.id}  {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id} className={`${thClass} `} {...column.getSortByToggleProps()}>
                    {column.render("Header")}
                    {generateSortingIndicator(column)}
                    {/* <Filter column={column} /> */}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <Fragment key={row.getRowProps().key}>
                  <tr className="trcss">
                    {row.cells.map((cell) => {
                      return (
                        <td key={cell.id} className="tdcss" {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </Table>
        </div>
      </div>

      {/* {isPagination &&
        <Row className="align-items-center mt-2 g-3 text-center text-sm-start">
        <div className="col-sm">
            <div className="text-muted">Showing<span className="fw-semibold ms-1">{page.length}</span> of <span className="fw-semibold">{data.length}</span> Results
            </div>
        </div>
        <div className="col-sm-auto">
            <ul className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0">
                <li className={!canPreviousPage ? "page-item disabled" : "page-item"}>
                    <Link to="#"  className="page-link" onClick={previousPage}>Previous</Link>
                </li>
                {pageOptions.map((item, key) => (
                  <React.Fragment key={key}>
                      <li className="page-item">
                          <Link to="#" className={pageIndex === item ? "page-link active" : "page-link"} onClick={() => gotoPage(item)}>{item + 1}</Link>
                      </li>
                  </React.Fragment>
                ))}
                <li className={!canNextPage ? "page-item disabled" : "page-item"}>
                  <Link to="#"  className="page-link" onClick={nextPage}>Next</Link>
                </li>
            </ul>
        </div>
      </Row>
      } */}
    </Fragment>
  );
};

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default TableContainer;