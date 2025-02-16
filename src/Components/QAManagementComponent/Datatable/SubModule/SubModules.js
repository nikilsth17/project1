
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableContainer from "../../../Common/TableContainerReactTable";
import { Link } from "react-router-dom";
import { fetchSubModulesForModule } from "../../../../slices/qaManagment/subModule/thunk";
import { deleteSubModule } from "../../../../slices/qaManagment/subModule/reducer";





export default function SubModules(props) {
  const dispatch = useDispatch();
  const subModules = useSelector(state => state.SubModule.subModule);

  console.log("submodules for this module", subModules);

  useEffect(() => {
    //fetch all the testcases for the module
    dispatch(fetchSubModulesForModule(props.id));
  },[dispatch, props.id])


  //delete testcase byid
  const handleDelete = (moduleid) => {
    dispatch(deleteSubModule(moduleid));
  }


  const columns = [
    {
      Header: "S.N.",
      accessor : (row, index) => index + 1,
      disableFilters: true,
      filterable: false,
    },
    {
      Header: "Sub Module",
      accessor: "moduleName",
      disableFilters: true,
      filterable: false,
      
    },
    {
      Header: "Parent Module",
      accessor: "parentModuleName",
      disableFilters: true,
      filterable: false,
     
    },
      {
        Header: "Status",
        accessor: 'status',
        disableFilters: true,
        filterable: false,
        Cell: ({ value }) => {
          return value === true ? (
            <span className="badge rounded-pill bg-success px-2 fs-12">Success</span>
          ) : value === false ? (
            <span className="badge rounded-pill bg-danger px-2 fs-12">Fail</span>
          ) : (
            <span className="badge rounded-pill bg-secondary px-2 fs-12">Pending</span>
          );
        }
      },
  
    {
      Header: "Action",
      Cell: ({ row }) => (
        <div className="hstack gap-3  text-center">
          <Link className="link-success" onClick={()=>props.onEditSubModule(row.original)} >
            <i className="ri-edit-2-line"></i>
          </Link>
          <Link onClick={() => handleDelete(row.original.id)}
            className="link-danger "
          >
            <i className="ri-delete-bin-line"></i>
          </Link>
        </div>
      ),
    },
  ];



  return (
    <React.Fragment>
      {/* Display loading state */}
     
        <TableContainer
          columns={columns}
          data={subModules}
          isPagination={true}
          // isGlobalFilter={true}
          iscustomPageSize={false}
          isBordered={false}
          customPageSize={20}
          className="custom-header-css tabletable-striped-columns align-middle table-nowrap "
          tableClassName="table-centered  align-middle table-nowrap mb-0"
          theadClassName="text-danger table-light text-center "
          // SearchPlaceholder="Search..."
          styleVariant='subModule'
        />
   
    </React.Fragment>
  );
}

