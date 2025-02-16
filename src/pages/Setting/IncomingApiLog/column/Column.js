export const column = [
  {
    name: "S.N",
    selector: (row) => row.id,
    sortable: true,
    width: "80px",
  },
  {
    name: "Name ",
    selector: (row) => row.applicationName,
    sortable: true,
    width: "130px",
  },
  {
    name: "Date",
    selector: (row) => row.timestamp,
    sortable: true,
    width: "200px",
  },
  {
    name: " Http ",
    selector: (row) => row.httpMethod,
    sortable: true,
    width: "100px",
  },
  {
    name: " Path",
    selector: (row) => row.path,
    sortable: true,
    width: "380px",
  },

  {
    name: "Status Code",
    selector: (row) => row.responseStatusCode,
    sortable: true,
  },
];
