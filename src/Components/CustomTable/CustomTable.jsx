import React from "react";
import DataTable from "react-data-table-component";
// import Checkbox from "@material-ui/core/Checkbox";

// import ArrowDownward from "@material-ui/icons/ArrowDownward";

// const sortIcon = <ArrowDownward />;
// const selectProps = { indeterminate: (isIndeterminate) => isIndeterminate };

const customStyles = {
  headCells: {
    style: {
      fontSize: "0.92rem", // Change the font size here
      fontWeight: 610, // Optionally change other styles
    },
  },
  rows: {
    style: {
      fontSize: "0.9rem", // Change the font size of rows here
      // You can also optionally add other row styles here
    },
  },
};

function CustomDataTable(props) {
  return (
    <DataTable
      //   pagination
      //   sortIcon={sortIcon}
      customStyles={customStyles}
      //   dense
      {...props}
    />
  );
}

export default CustomDataTable;
