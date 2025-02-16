import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {deleteModuleByID} from "../../../slices/qaManagment/module/thunk";

const ModuleCard = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const module = {
    id: props.id,
    moduleName: props.moduleName,
    parent_Module_Id: props.parent_Module_Id, // Ensure this is the correct parent module ID
    projectId: props.projectId,
  };

  const NormalcardStyle = {
    height: "200px",
    borderRadius: "2px",
    border: isHovered ? "2px solid #88C8AA" : "1px solid #88C8AA",
    backgroundColor: "#F1F8F5",
    transition: "transform 0.3s",
    transform: isHovered ? "scale(1.05)" : "scale(1)",
    boxShadow: isHovered ? "0 4px 8px rgba(0, 0, 0, 0.1)" : "none",
  };
  const subModuleCardStyle = {
    height: "200px",
    borderRadius: "2px",
    border: isHovered ? "2px solid #DA9646" : "1px solid #DA9646",
    background: " rgba(211, 130, 35, 0.08)",
    transition: "transform 0.3s",
    transform: isHovered ? "scale(1.05)" : "scale(1)",
    boxShadow: isHovered ? "0 4px 8px rgba(0, 0, 0, 0.1)" : "none",
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsHovered(false);
    setIsDropdownOpen(!isDropdownOpen);
    e.preventDefault();
  };

  const onMouseEnterDropdown = () => {
    setIsDropdownOpen(true);
  };

  const onMouseLeaveDropdown = () => {
    setIsDropdownOpen(false);
  };


  return (
    <Link to={`/project/module/${props.id}`}>
      <Card
        className="text-center d-flex"
        style={props.itHasSubModule ? subModuleCardStyle : NormalcardStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="p-0 bg-transparent border-0 px-2 pt-2">
          <div className="d-flex justify-content-end align-items-end">
            <i
              className="ri-more-2-fill"
              style={{ cursor: "pointer" }}
              onClick={toggleDropdown}
            ></i>
            <Dropdown
              isOpen={isDropdownOpen}
              toggle={toggleDropdown}
              direction="left"
              onMouseEnter={onMouseEnterDropdown}
              onMouseLeave={onMouseLeaveDropdown}
            >
              <DropdownToggle
                tag="span"
                data-toggle="dropdown"
                aria-expanded={isDropdownOpen}
              ></DropdownToggle>
              <DropdownMenu>
                <DropdownItem
                  className="text-danger "
                  onClick={()=>
                    dispatch(deleteModuleByID(props.id))}
                >
                  <i
                    className="ri-delete-bin-line me-2"
                    style={{ fontSize: "12px" }}
                  ></i>
                  Delete
                </DropdownItem>

                <DropdownItem onClick={() => props.onEditModule(module)}>
                  {" "}
                  <i className="ri-edit-fill me-2 text-body-secondary"></i>Edit
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardHeader>
        <CardBody className="align-item-center justify-content-center d-flex flex-column">
          {props.moduleName}
        </CardBody>
        <CardFooter
          className="bg-transparent border-0"
          style={{ fontSize: "12px" }}
        ></CardFooter>
      </Card>
    </Link>

  );
};

export default ModuleCard;
