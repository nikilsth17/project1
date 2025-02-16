import React, { useEffect, useState } from 'react';
import ProductsServices from '../../services/Inventory Services/ProductsServices';

const TestHRResult = () => {
  const [productList, setProductList] = useState([]);
  const [totalProductCount, setTotalProductCount] = useState(0);

  async function fetchProducts() {
    try {
      const fetchedProducts = await ProductsServices.getList();
      console.log("Fetched Products:", fetchedProducts);
      setProductList(fetchedProducts);

      // Calculate the total product count after fetching
      const total = fetchedProducts.length;
      console.log("Total Product Count:", total);
      setTotalProductCount(total);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  console.log("Product List:", productList);
  console.log("Total Product Count:", totalProductCount);

  return (
    <div>
      <h2>Total Product Count from API: {totalProductCount}</h2>
      {/* Render other components or data here */}
    </div>
  );
};

export default TestHRResult;
