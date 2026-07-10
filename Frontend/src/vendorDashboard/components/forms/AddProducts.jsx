import React ,{useState} from 'react'
import { API_URL } from '../../data/apiPath';

const AddProducts = () => {
    const [productName,setProductName] = useState("");
    const [price,setPrice] = useState("");
    const [category,setCategory] = useState([]);
    const [bestSeller,setBestSeller] = useState(false);
    const [image,setImage] = useState(null);
    const [description,setDescription] = useState("");

    const handleCategoryChange = (event)=>{
        const value = event.target.value;
        if(category.includes(value)){
            setCategory(category.filter((item)=> item!==value));
        }else{
            setCategory([...category,value]);
        }
    }


    const handleImageUpLoad = (event) => {
        const selectedImage = event.target.files[0];
        setFile(selectedImage);
    }

    const handleBestSeller = (event)=>{
        const value = event.target.value === 'true'
        setBestSeller(value);
    }



    const handleAddProduct = async(e)=>{
        e.preventDefault();
        try {
            const loginToken = localStorage.getItem('logintoken');
            const firmId = localStorage.getItem('firmId');
            if(!loginToken || firmId){
                console.error("User Not Authenticated");
            }
            const formData = new FormData();
            formData.append('productName',productName);
            formData.append('price',price);
            formData.append('description',description);
            formData.append('image',image);

            category.forEach((value)=>{
                formData.append('category',category);
            });
            const response = await fetch(`${API_URL}/products/add-product/${firmId}`,{
                method:'POST',
                body:formData
            });
            const data = await response.json();
            if(response.ok){
                alert("Product Added Successfully");
            }
        } catch (error) {
            console.error(data.message);
            alert("Failed To Add Product");
        }
    }



    return (
        <div className="firmSection">
            <form className="tableForm" onSubmit={handleAddProduct}>
                <label>Product Name</label><br />
                <input type='text' value={productName} onChange={(e)=>setProductName(e.target.value)}/>
                <label>Price</label><br />
                <input type='text' value={price} onChange={(e)=>setPrice(e.target.value)}/>
                <div className="checkinp">
                    <label>Category</label>
                    <div className="checkBoxContainer">
                        <label>Veg</label>
                        <input type='checkbox' value='veg' checked={category.includes('veg')} onChange={handleCategoryChange}/>
                    </div>
                    <div className="checkBoxContainer">
                        <label>Non-Veg</label>
                        <input type='checkbox' value='non-veg' checked={category.includes('non-veg')} onChange={handleCategoryChange}/>
                    </div>
                </div>
                <div className="checkinp">
                    <label>Best Seller</label>
                    <div className="checkBoxContainer">
                        <label>Yes</label>
                        <input type='radio' value='true' checked={bestSeller===true} onChange={handleBestSeller}/>
                    </div>
                    <div className="checkBoxContainer">
                        <label>No</label>
                        <input type='radio' value='false' checked={bestSeller===false} onChange={handleBestSeller}/>
                    </div>
                </div>
                <label>Description</label><br />
                <input type='text' value={description} onChange={(e)=>setDescription(e.target.value)}/>
                <label>Product Image</label><br />
                <input type='file' onChange={handleImageUpLoad}/>
                <div className='btnSubmit'>
                    <button type='submit'>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default AddProducts
