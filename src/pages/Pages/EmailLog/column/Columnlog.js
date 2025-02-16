export const apilogdatalist = [
  {
    name: "S.N",
    selector: (row) => row.id,
    sortable: true,
    width: "75px",
  },
  {
    name: "Date",
    selector: (row) => row.date,
    sortable: true,
  },
  {
    name: "From",
    selector: (row) => row.from,
    sortable: true,
  },
  {
    name: "To",
    selector: (row) => row.to,
    sortable: true,
  },
  {
    name: "Subject",
    selector: (row) => row.subject,
    sortable: true,
  },

  {
    name: "Message",
    selector: (row) => row.message,
    sortable: true,
    width: "200px",
  },
];
