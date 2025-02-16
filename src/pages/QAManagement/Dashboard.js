import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Container,
  Row,
} from "reactstrap";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import { Triangle } from "react-loader-spinner";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import ItemServices from "../../services/DibyaServices/ItemServices/ItemServices";

const allRevenueData = [
  {
    name: "Orders",
    type: "area",
    data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
  },
  {
    name: "Earnings",
    type: "bar",
    data: [
      89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36,
      88.51, 36.57,
    ],
  },
  {
    name: "Refunds",
    type: "line",
    data: [8, 12, 7, 17, 21, 11, 5, 9, 7, 29, 12, 35],
  },
];

const monthRevenueData = [
  {
    name: "Orders",
    type: "area",
    data: [54, 85, 66, 18, 29, 31, 12, 14, 38, 72, 33, 27],
  },
  {
    name: "Earnings",
    type: "bar",
    data: [
      89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36,
      88.51, 36.57,
    ],
  },
  {
    name: "Refunds",
    type: "line",
    data: [18, 22, 27, 37, 41, 21, 15, 19, 27, 19, 22, 45],
  },
];

const halfYearRevenueData = [
  {
    name: "Orders",
    type: "area",
    data: [34, 65, 46, 68, 49, 61, 42, 44, 78, 52, 63, 67],
  },
  {
    name: "Earnings",
    type: "bar",
    data: [
      89.25, 98.58, 68.74, 108.87, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36,
      88.51, 36.57,
    ],
  },
  {
    name: "Refunds",
    type: "line",
    data: [8, 22, 87, 47, 41, 31, 5, 9, 47, 49, 32, 55],
  },
];

const yearRevenueData = [
  {
    name: "Orders",
    type: "area",
    data: [14, 35, 26, 38, 29, 31, 22, 24, 58, 32, 33, 77],
  },
  {
    name: "Earnings",
    type: "bar",
    data: [
      99.25, 88.58, 78.74, 118.87, 87.54, 94.03, 61.24, 58.57, 102.57, 62.36,
      48.51, 66.57,
    ],
  },
  {
    name: "Refunds",
    type: "line",
    data: [58, 42, 47, 57, 71, 21, 15, 69, 17, 39, 52, 55],
  },
];

const ecomWidgets = [
  {
    id: 1,
    cardColor: "primary",
    label: "Total Earnings",
    badge: "ri-arrow-right-up-line",
    badgeClass: "success",
    percentage: "+16.24",
    counter: "559.25",
    link: "View net earnings",
    bgcolor: "white",
    icon: "bx bx-dollar-circle",
    decimals: 2,
    prefix: "$",
    suffix: "k",
  },
  {
    id: 2,
    cardColor: "secondary",
    label: "Orders",
    badge: "ri-arrow-right-down-line",
    badgeClass: "danger",
    percentage: "-3.57",
    counter: "36894",
    link: "View all orders",
    bgcolor: "white",
    icon: "bx bx-shopping-bag",
    decimals: 0,
    prefix: "",
    separator: ",",
    suffix: "",
  },
  {
    id: 3,
    cardColor: "success",
    label: "Customers",
    badge: "ri-arrow-right-up-line",
    badgeClass: "success",
    percentage: "+29.08",
    counter: "183.35",
    link: "See details",
    bgcolor: "white",
    icon: "bx bx-user-circle",
    decimals: 2,
    prefix: "",
    suffix: "M",
  },
  {
    id: 4,
    cardColor: "info",
    label: "My Balance",
    badgeClass: "muted",
    percentage: "+0.00",
    counter: "165.89",
    link: "Withdraw money",
    bgcolor: "white",
    icon: "bx bx-wallet",
    decimals: 2,
    prefix: "$",
    suffix: "k",
  },
];

const customStyles = {
  headCells: {
    style: {
      fontSize: "0.92rem",
      fontWeight: 610,
    },
  },
  headRow: {
    style: {
      background: "#645BD0",
      color: "white",
    },
  },
  rows: {
    style: {
      fontSize: "0.9rem",
    },
  },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  async function fetchItemList() {
    try {
      const fetchedItem = await ItemServices.itemList();
      console.log("Fetched Item List:", fetchedItem);
      setItemList(fetchedItem);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching Item List:", err);
    }
  }

  const handleDelete = async (itemId) => {
    try {
      if (window.confirm("Do you really want to delete this item?")) {
        const deletedItem = await ItemServices.deleteItem(itemId);
        console.log("Item deleted successfully:", deletedItem);
        setItemList((prevItemList) =>
          prevItemList.filter((item) => item.id !== itemId)
        );
        toast.success("Item Deleted Successfully", { autoClose: 3000 });
      } else {
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    fetchItemList();
  }, []);
  const columns = [
    {
      name: "S.N",
      selector: (row) => row.sn,
      sortable: true,
      width: "75px",
    },
    {
      name: "Image",
      cell: (row) => (
        <img
          src={`data:image/jpeg;base64, ${row.image}`}
          alt="Image"
          style={{ width: "100px", height: "auto" }}
        />
      ),
      sortable: true,
    },
    {
      name: "Item",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Total Sale",
      selector: (row) => row.ingredients || "No data available",
      sortable: true,
    },
    {
      name: "Unit",
      selector: (row) => row.unit || "No data available",
      sortable: true,
      right: true,
    },
    {
      name: "Price",
      selector: (row) =>
        row.price ? row.price.toLocaleString() : "No data available",
      right: true,
      sortable: true,
    },
    {
      name: "Bulk Price",
      selector: (row) =>
        row.bulkPrice ? row.bulkPrice.toLocaleString() : "No data available",
      right: true,
      sortable: true,
    },
    // {
    //   name: "Action",
    //   cell: (row) => row.action,
    // },
  ];

  const data = itemList
    ?.filter((item) => {
      const searchText = filterText.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchText) ||
        (item.price && item.price.toString().toLowerCase().includes(searchText))
      );
    })
    .map((item, index) => ({
      id: item.id,
      sn: index + 1,
      image: item.image,
      name: item.name,
      price: item.price,
      bulkPrice: item.bulkPrice,
      unit: item.unit,
      ingredients: item.ingredients,
      action: (
        <ButtonGroup size="sm">
          <Link to={`/items/${item.id}`}>
            <Button color="btn btn-soft-success" className="btn-sm gap-1">
              <i className="bx bx-show" />
            </Button>
          </Link>
          <Link to={`/items/edit/${item.id}`}>
            <Button color="btn btn-soft-warning" className="btn-sm gap-1 ms-1">
              <i className="ri-edit-line" />
            </Button>
          </Link>
          <Button
            className="btn btn-soft-danger btn-sm gap-1 ms-1"
            color="danger"
            onClick={() => handleDelete(item.id)}
          >
            <i className="ri-delete-bin-5-line" />
          </Button>
        </ButtonGroup>
      ),
    }));

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            {ecomWidgets.map((item) => {
              return (
                <Col xs={3}>
                  <Card className={"card-animate bg-" + item.cardColor}>
                    <CardBody>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1 overflow-hidden">
                          <p className="text-uppercase fw-bold text-white-50 text-truncate mb-0">
                            {item.label}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <h5 className={"fs-14 mb-0 text-white"}>
                            {item.badge ? (
                              <i
                                className={"fs-13 align-middle " + item.badge}
                              ></i>
                            ) : null}{" "}
                            {item.percentage} %
                          </h5>
                        </div>
                      </div>
                      <div className="d-flex align-items-end justify-content-between mt-4">
                        <div>
                          <h4 className="fs-22 fw-bold ff-secondary mb-4 text-white">
                            <span
                              className="counter-value"
                              data-target="559.25"
                            >
                              <CountUp
                                start={0}
                                prefix={item.prefix}
                                suffix={item.suffix}
                                separator={item.separator}
                                end={item.counter}
                                decimals={item.decimals}
                                duration={4}
                              />
                            </span>
                          </h4>
                          <Link
                            to="#"
                            className="text-decoration-underline text-white-50"
                          >
                            {item.link}
                          </Link>
                        </div>
                        <div className="avatar-sm flex-shrink-0">
                          <span
                            className={`avatar-title bg-white bg-opacity-10 rounded fs-3`}
                          >
                            <i className={`text-white ${item.icon}`}></i>
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              );
            })}
            <span className="mt-2 fs-5 fw-semibold">Best Selling Products</span>

            <DataTable
              responsive
              striped
              pagination
              fixedHeader
              highlightOnHover
              pointerOnHover
              persistTableHead
              progressPending={loading}
              customStyles={customStyles}
              paginationResetDefaultPage={resetPaginationToggle}
              progressComponent={
                <div className="my-3">
                  <Triangle
                    visible={true}
                    height="80"
                    width="80"
                    color="#5B71B9"
                    ariaLabel="triangle-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                  <h5 className="mt-1">Loading...</h5>
                </div>
              }
              columns={columns}
              data={data}
            />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
