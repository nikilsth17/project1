export const columns = [
  {
    name: "S.N",
    selector: (row) => row.index,
    sortable: true,
    width: "75px",
  },

  {
    name: "User Name",
    selector: (row) => row.userName,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },

  {
    name: "Address",
    selector: (row) => row.address,
    sortable: true,
  },
  {
    name: "Phone Number",
    selector: (row) => row.phoneNumber,
    sortable: true,
  },
  {
    name: "Role",
    selector: (row) => row.role,
    sortable: true,
  },
  {
    name: "Action",
    selector: (row) => {
      return (
        <div>
          <span
            title="View Manifest Details"
            className="cursor-pointer fs-5 me-2"
            onClick={toggleModal}
          >
            {/* <Link to={`/shipmentdetail/${row?.id}`}> */}
            <i className="bx bx-show text-primary" />
            {/* </Link> */}
          </span>
        </div>
      );
    },
  },
];
