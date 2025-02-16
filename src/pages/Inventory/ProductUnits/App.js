import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes,Switch, useHistory } from "react-router-dom"; 


import CustomerList from "../Home/CustomerList";
import ProductCategoryList from "../Home/ProductCategoryList";
import SupplierCategoryList from "../Home/SupplierCategoryList";


const cartStyle = {
  position: "absolute",
  top: "80px",
  right: "30px",
  border: "1px solid #ccc",
  padding: "20px",
  backgroundColor: "white",
  width: "300px",
};

const cartContentStyle = {
  textAlign: "right",
};

const App = () => {
  const [productData, setProductData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [productForm, setProductForm] = useState({});
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('productData')) || [];
    setProductData(savedData);
  }, []);

  const handleEdit = (index) => {
    setEditingIndex(index);
    const { Code, TitleEnglish, TitleNepali, Status } = productData[index];
    setProductForm({
      Code,
      TitleEnglish,
      TitleNepali,
      Status,
    });
  };

  const handleDelete = (index) => {
    const updatedData = productData.filter((_, i) => i !== index);
    setProductData(updatedData);
    localStorage.setItem('productData', JSON.stringify(updatedData));
  };


 

  return (
    
    <section>
      <div style={{ marginBottom: "0px" }}>
        <CustomerList />
        <ProductCategoryList data={productData}
           onEdit={handleEdit}
           onDelete={handleDelete}  />
      <SupplierCategoryList />
    
      </div>
    </section>
 
  );
};

export default App;
