import React from 'react';
import { Card, CardBody, CardFooter, CardHeader, Button, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteProjectById } from '../../../slices/qaManagment/project/thunk';

const ProjectListCard = (props) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dispatch = useDispatch();

    const cardStyle = {
        height: '200px' || height,
        borderRadius: '2px',
        border: isHovered?  "2px solid #7D74DD  " : "1px solid  #7D74DD ",
        backgroundColor: "#F2F1FB",
        transition: "transform 0.3s",
        transform: isHovered ? "scale(1.05)" : "scale(1)", // Apply scale on hover
        boxShadow: isHovered ? "0 4px 8px rgba(0, 0, 0, 0.1)" : "none", // Apply shadow on hover


    }
    const project={
        id:props.id,
        title:props.title,
        deadline: props.Deadline


    }
    console.log("project:",project)

    const toggleDropdown = (e) => {
        e.stopPropagation(); // Prevent the click event from bubbling up to the cardClickHandler
        // Add your action button logic here
        e.preventDefault(); // P
        setIsHovered(false);
        setIsDropdownOpen(!isDropdownOpen);
    };

    const onMouseEnterDropdown = () => {
        setIsDropdownOpen(true);
    };

    const onMouseLeaveDropdown = () => {
        setIsDropdownOpen(false);
    };

    const editButtonHandler = (e) => {
        e.stopPropagation(); // Prevent the click event from bubbling up to the cardClickHandler
        props.onEditProject(project); // Call the edit function
        e.preventDefault();
    };
    const deleteButtonHandler = (e) => {
        e.stopPropagation(); // Prevent the click event from bubbling up to the cardClickHandler
        dispatch(deleteProjectById(props.id));
        e.preventDefault();
    };

    return (

        <Link to={`/project/${props.id}`} className='text-decoration-none'>
                <Card className='text-center d-flex' style={cardStyle}   onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                 <CardHeader className='p-0 bg-transparent border-0 px-2 pt-2'>
                    <div className="d-flex justify-content-end align-items-end">
                        <i className='ri-more-2-fill' style={{cursor:'pointer'}}  onClick={toggleDropdown}>

                        </i>
                        <Dropdown isOpen={isDropdownOpen} toggle={toggleDropdown} direction="left" onMouseEnter={onMouseEnterDropdown} onMouseLeave={onMouseLeaveDropdown}>
                            <DropdownToggle tag="span" data-toggle="dropdown" aria-expanded={isDropdownOpen}>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem className='text-danger '  onClick={deleteButtonHandler}><i className='ri-delete-bin-line me-2' style={{fontSize:"12px"}}></i>Delete</DropdownItem>
                                <DropdownItem onClick={editButtonHandler} > <i className='ri-edit-fill me-2 text-body-secondary'></i>Edit</DropdownItem>
                            </DropdownMenu>

                        </Dropdown>
                    </div>
                </CardHeader>
                    <CardBody className='align-item-center justify-content-center d-flex flex-column'
           >
                           {props.title ? props.title : 'Project Title'}


                    </CardBody>
                    <CardFooter className='bg-transparent border-0' style={{fontSize:'12px'}}>
                        <div className='text-end text-body-secondary'>
                            <span>Deadline: {props.Deadline ? (new Date(project.deadline).toLocaleDateString() ) : "2023-12-25"} </span>

                             {/* <span>2023-12-25</span> */}
                             {/* {props.deadline} */}
                             </div>
                    </CardFooter>
                </Card>
        </Link>


    )
}

export default ProjectListCard;

