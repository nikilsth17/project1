import React, { useState, useEffect } from 'react';
import ManagemetServices from '../../../services/Inventory Services/ManagemetServices';
import LayoutWithBreadCrumb from '../../Pages/Starter/LayoutWithBreadCrumb';
import { Card, CardBody, CardHeader, Container, Table,Row,Col } from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';

const MenuInfoGetList = () => {
  const [controllerData, setControllerData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [selectedVmActions, setSelectedVmActions] = useState({});

  // Function to handle selection of vmActions for an item
  const handleVmActionSelect = (itemId, actionId) => {
    // Copy the existing selected vmActions for the item
    const itemVmActions = selectedVmActions[itemId] || [];

    // Check if the actionId is already in the selected vmActions for this item
    const isActionSelected = itemVmActions.includes(actionId);

    if (isActionSelected) {
      // If the action is already selected, remove it from the selected vmActions
      const updatedVmActions = itemVmActions.filter((id) => id !== actionId);
      setSelectedVmActions({
        ...selectedVmActions,
        [itemId]: updatedVmActions,
      });
    } else {
      // If the action is not selected, add it to the selected vmActions
      setSelectedVmActions({
        ...selectedVmActions,
        [itemId]: [...itemVmActions, actionId],
      });
    }
  };

  // Logic to determine if a vmAction is selected for a specific item
  const isVmActionSelected = (itemId, actionId) => {
    const itemVmActions = selectedVmActions[itemId] || [];
    return itemVmActions.includes(actionId);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await ManagemetServices.MenuInfogetList();
      setControllerData(response);
    };
    fetchData();
  }, []);

  const toggleSelect = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
      setSelectAll(false);
    } else {
      setSelectedItems([...selectedItems, id]);

      if (selectedItems.length + 1 === controllerData.length) {
        setSelectAll(true);
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(controllerData.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  return (
   
    <React.Fragment>
    <div className='page-content'>
      <Container fluid>
        <BreadCrumb title="Menu List" pageTitle="Menu" />
        <Row>
          <Col>
            <Card>
              <CardBody>
                <Table responsive striped bordered>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={selectAll}
                />
              </th>
              <th>S.N</th>
              <th>Controller Name</th>
              <th>Controller Caption</th>
              <th>Module</th>
              <th>vmActions</th>
            </tr>
          </thead>
          <tbody>
            {controllerData.map((item, index) => (
              <tr key={item.id}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => toggleSelect(item.id)}
                    checked={selectedItems.includes(item.id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{item.controller_Name}</td>
                <td>{item.controller_Caption}</td>
                <td>{item.module}</td>
                <td>
        {/* Loop through vmActions and render checkboxes */}
        {item.vmActions.map((action) => (
          <div key={action.id}>
            <input
              type="checkbox"
              onChange={() => handleVmActionSelect(item.id, action.id)}
              checked={isVmActionSelected(item.id, action.id)}

            />
            <label>{action.action_Caption}</label>
          </div>
        ))}
      </td>
              </tr>
            ))}
          </tbody>
          </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>
</React.Fragment>
 
  );
};

export default MenuInfoGetList;
