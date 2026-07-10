import React, { useState, useEffect } from 'react'
import { API_URL } from '../data/apiPath';

const AllProducts = () => {
  const [products, setProducts] = useState([]);

  const productsHandler = async () => {
    const firmId = localStorage.getItem('firmId');
    try {
      const response = await fetch(`${API_URL}/products/${firmId}/products`);
      const newProductsData = await response.json();
      setProducts(newProductsData.products);
      console.log(newProductsData);
    } catch (error) {

    }
  }
  useEffect(() => {
    productsHandler();
  }, []);



  const deleteProductById = async (productId) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.message || "Failed to delete product");
      }
      setProducts(products.filter(product => product._id !== productId));
      alert("Product Deleted Successfully!");
    } catch (error) {
      console.error('Error Deleting Product:', error);
      alert("Failed to Delete Product");
    }
  };


  return (
    <div>
      {products.length === 0 ? (
        <p>No Products Added</p>
      ) : (
        <table className="productTable">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Image</th>
              <th>Delete Or Update</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => {
              return (
                <>
                  <tr key={item._id}>
                    <td>{item.productName}</td>
                    <td>{item.price}</td>
                    <td>
                      {item.image && (
                        <img src={`${API_URL}/uploads/${item.image}`} alt="No Image" style={{ width: '50px', height: '50px' }} />
                      )}
                    </td>
                    <td>
                      <button className='btn btn-danger'>Delete</button>
                      <button className='btn btn-primary'>Edit</button>
                    </td>
                  </tr>
                </>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default AllProducts
