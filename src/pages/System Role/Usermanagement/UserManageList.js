import React,{useEffect,useState} from 'react'
import Searchpage from '../../Pages/Starter/Searchpage'
import LayoutWithBreadCrumb from '../../Pages/Starter/LayoutWithBreadCrumb'
import BreadCrumb from '../../../Components/Common/BreadCrumb'
import { CardBody,Card, Button, CardHeader,Table,Label,Input ,ButtonGroup} from 'reactstrap'
import { useNavigate ,Link} from 'react-router-dom'
import ManagemetServices from '../../../services/Inventory Services/ManagemetServices'
import CreateButton from '../../Pages/Starter/CreateButton'


const UserManageList = () => {
  const navigate = useNavigate();
  // const [item, setItem] = useState([]);
   const [formList, setFormList] = useState([]); // State for your list of items
    const [selectedItems, setSelectedItems] = useState([]);
    
  async function fetchPosts() {
    try {
      const fetchedPosts = await ManagemetServices.getList();
      console.log("Fetched Posts:", fetchedPosts);
      setFormList(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (itemId) => {
    try {
      // Send a DELETE request to delete the item by ID
      await ManagemetServices.delete(itemId);
      alert("want to delete User Management");

      // Update the state to remove the deleted item from the list
      setFormList((prevData) => prevData.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

    // Handle checkbox selection
const handleCheckboxChange = (itemId) => {
const updatedSelectedItems = [...selectedItems];
if (updatedSelectedItems.includes(itemId)) {
  // Item is already selected, so remove it
  updatedSelectedItems.splice(updatedSelectedItems.indexOf(itemId), 1);
} else {
  // Item is not selected, so add it
  updatedSelectedItems.push(itemId);
}
setSelectedItems(updatedSelectedItems);
};

  return (
    <div>
      <React.Fragment>
        <LayoutWithBreadCrumb>
        <BreadCrumb title="User Management List" pageTitle= "User Management " />
       <Card>
       
        <CardHeader>
                  
                      <CreateButton to='/user-management/create' text=' + Assigns Roles'  />
                      </CardHeader>
                      <CardBody>
                      <div>
               {/* <Searchpage /> */}
               </div>
               <div className="table-responsive">
                          <Table>
                            <thead className="ml-0 bg-light">
                <tr>
                {/* <td>
                    <Label check>
                      <Input
                        type="checkbox"
                     
                      />
                    </Label>
                  </td> */}
                    <td className='sort'>S.N</td>
                    <td className='sort'>User Name</td>
                    <td className='sort'>E-mail</td>
                    <td className='sort'>Phone Number</td>
                    <td className='sort'>Status</td>
                    <td className='sort'>User Roles</td>
                    <td className='sort'>Actions</td>
                </tr>
                </thead>
                
            <tbody>
              {formList.map((item,index) => (
                <tr key={item.id}>
                  {/* <td>
                    <Label check>
                      <Input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                    </Label>
                  </td> */}
               <td>{index+1}</td>
                  <td>{item.userName}</td>
                  <td>{item.email}</td>
                  <td>{item.phoneNumber}</td>
                  <td className="status">
  <span
    className={`badge ${
      item.status === true ? 'bg-danger' : 'bg-success'
    }-subtle text-uppercase text-dark`}
  >
    {item.status ? 'Active' : 'In-Active'}
  </span>
</td>
<td>{item.user_Roles.map(role => role.name).join(', ') || 'No Roles'}</td>

               
                  <td>
                <ButtonGroup size="sm">
                                <div className="d-flex gap-1">
                                  <Button color="btn btn-soft-success" className="btn-sm gap-1">
                                    <Link to={`/user-management/details/${item.id}`}>
                                      <i className="bx bx-show" />
                                    </Link>
                                  </Button>
                                  <Button color="btn btn-soft-warning" className="btn-sm gap-1">
                                    <Link to={`/user-management/edit/${item.id}`}>
                                      <i className="ri-edit-line"></i>
                                    </Link>
                                  </Button>
                                  <Button className="btn btn-soft-danger btn-sm gap-1" color="danger"
                                onClick={() => handleDelete(item.id)}>
                                    <i className="ri-delete-bin-5-fill"></i>
                                  </Button>
                                </div>
                              </ButtonGroup>
              </td>
                </tr>
              ))}
            </tbody>
               </Table>
               </div>
    
      
            </CardBody>
            </Card>
        </LayoutWithBreadCrumb>
      </React.Fragment>
    </div>
  )
}

export default UserManageList