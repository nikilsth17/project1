import React, { useEffect, useState } from "react";
import { Card, CardBody } from "reactstrap";
import GeneralServices from '../../services/AustServices/GeneralService/GeneralServices';

const ItemType = () => {
  const [myDataList, setMyDataList] = useState([]);

  async function fetchPosts() {
    try {
      const response = await GeneralServices.getItemType();
      setMyDataList(response); // Assuming the response is an array of items
    } catch (error) {
      console.error("Error fetching item types:", error);
      // Optionally: Set an error state or show an error message to the user
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <React.Fragment>
     
        <CardBody>
          <table className="table table-bordered table-stripped">
            <thead>
              <tr>
                <th className="table-primary">SN</th>
                <th className="table-primary">Name</th>
              </tr>
            </thead>
            <tbody>
              {myDataList.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
    
    </React.Fragment>
  );
};

export default ItemType;
