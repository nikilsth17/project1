
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, deleteUserById, updateUserById } from "../../../slices/qaManagment/UserManagement/thunk";  // Make sure to import your thunk correctly
import TableContainer from "../../../Components/Common/TableContainerReactTable";
import { Link } from "react-router-dom";

export default function UserList({onEditUser}) {
  const dispatch = useDispatch();

  // Fetch users from Redux state
  const users = useSelector((state) => state.User?.users);
  console.log("users", users)
  const loading = useSelector((state) => state.User.loading);
  const error = useSelector((state) => state.User.error);

  useEffect(() => {
    // Fetch users when the component mounts
    dispatch(getUsers());
  }, [dispatch]);

  const columns = [
 
    {
      Header: "S.No.",
      disableFilters: true,
      accessor: (row, index) => index + 1, // Use row index as S.No.
      filterable: false,
     
    },
    {
      Header: "username",
      accessor: "username",
      disableFilters: true,
      filterable: false,
    },
    // {
    //   Header: "Firstname",
    //   accessor: "firstName",
    //   disableFilters: true,
    //   filterable: false,
    // },
    // {
    //   Header: "LastName",
    //   accessor: "lastName",
    //   disableFilters: true,
    //   filterable: false,
    // },
    {
      Header: "Email",
      accessor: "email",
      disableFilters: true,
      filterable: false,
    },
    {
      Header: "Role",
      accessor: "userType",
      disableFilters: true,
      filterable: false,
      Cell: ({ value }) => {
        return value === 0 ? "SuperAdmin" : value === 1 ? "SystemAdmin" : value === 2 ? "User": "";
      },
    },
    
  
    {
      Header: "Action",
      Cell: ({ row }) => (
        row.original.userType !== 0 ? (
          <div className="hstack gap-3 flex-wrap">
            <Link className="link-success fs-15" onClick={() => onEditUser(row.original)}>
              <i className="ri-edit-2-line"></i>
            </Link>
            <Link
              className="link-danger fs-15"
              onClick={() => handleDeleteUser(row.original.id)}
            >
              <i className="ri-delete-bin-line"></i>
            </Link>
          </div>
        ) : null
        
      ),
    },
  ];

  const handleDeleteUser = (userId) => {
    dispatch(deleteUserById(userId));
};

  return (
    <React.Fragment>
      {/* Display loading state */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <TableContainer
          columns={columns}
          data={users}
          isPagination={true}
          isGlobalFilter={true}
          iscustomPageSize={false}
          isBordered={false}
          customPageSize={10}
          className="custom-header-css table align-middle table-nowrap"
          tableClassName="table-centered align-middle table-nowrap mb-0"
          theadClassName="text-muted table-light"
          SearchPlaceholder="Search..."
        />
      )}
    </React.Fragment>
  );
}

