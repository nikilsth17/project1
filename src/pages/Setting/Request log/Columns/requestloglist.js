import { Link } from "react-router-dom";

export const requestloglist = [
  {
    name: "S.N",
    selector: (row) => row.id,
    sortable: true,
    width: "80px",
  },
  {
    name: "Message ",
    selector: (row) => row.message,
    sortable: true,
    width: "450px",
  },
  // {
  //   name: "Message Template",
  //   selector: (row) => row.messageTemplate,
  //   sortable: true,
  //   width: "200px",
  // },
  {
    name: "Date",
    selector: (row) => row.timeStamp,
    sortable: true,
    // width: "150px",
  },
  {
    name: " Level ",
    selector: (row) => row.level,
    sortable: true,
    // width: "150px",
  },
  {
    name: "Exception",
    selector: (row) => row.exception,
    sortable: true,
    // width: "150px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    sortable: true,
  },
];
