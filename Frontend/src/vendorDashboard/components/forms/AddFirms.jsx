import React, { useState } from 'react'
import { API_URL } from '../../data/apiPath';

const AddFirms = () => {
    const [firmName, setFirmName] = useState("");
    const [area, setArea] = useState("");
    const [category, setCategory] = useState([]);
    const [region, setRegion] = useState([]);
    const [offer, setOffer] = useState("");
    const [file, setFile] = useState(null);

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        if (category.includes(value)) {
            setCategory(category.filter((item) => item !== value));
        }
        else {
            setCategory([...category, value])
        }
    }


    const handleRegionChange = (event) => {
        const value = event.target.value;
        if (region.includes(value)) {
            setRegion(region.filter((item) => item !== value));
        }
        else {
            setRegion([...region, value]);
        }
    }

    const handleImageUpLoad = (event) => {
        const selectedImage = event.target.files[0];
        setFile(selectedImage);
    }



    const handleFirmSubmit = async (e) => {
        e.preventDefault();
        try {
            const loginTokens = localStorage.getItem('logintoken');
            console.log("Retrieved Token:", loginTokens); // Debugging purpose
            if (!loginTokens) {
                console.error("User Not Authenticated: Token not found");
                alert("Please log in again.");
                return; // Stop execution if no token is found
            }
            const formData = new FormData();
            formData.append('firmName', firmName);
            formData.append('area', area);
            formData.append('offer', offer);
            formData.append('image', file);

            category.forEach((value) => {
                formData.append('category', value);
            })
            region.forEach((value) => {
                formData.append('region', value);
            })
            const response = await fetch(`${API_URL}/firm/add-firm`, {
                method: 'POST',
                headers: {
                    'token': `${loginTokens}`
                },
                body: formData
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data);
                alert("Firm Added Successfully");
                setFirmName("");
                setArea("");
                setCategory([]);
                setRegion([]);
                setOffer("");
                setFile(null);
            }
            else if(data.message === "One Vendor Can Have Only One Firm"){
                alert("Vendor cannot have Multiple Firms!")
            }else{
                alert("Failed To Add Firm");
            }
            console.log("This is Firm ID:",data.firmId);
            const getFirmID = data.firmId;

            localStorage.setItem('firmId',getFirmID);
        } catch (error) {
            console.error("Failed To Add Firm", error);
        }
    }

    return (
        <div className="firmSection">
            <form className="tableForm" onSubmit={handleFirmSubmit}>
                <label>Firm Name</label><br />
                <input type='text' name='firmName' value={firmName} onChange={(e) => setFirmName(e.target.value)} />
                <label>Area</label><br />
                <input type='text' name='area' value={area} onChange={(e) => setArea(e.target.value)} />
                <div className="checkinp">
                    <label>Category</label>
                    <div className="checkBoxContainer">
                        <label>Veg</label>
                        <input type='checkbox' checked={category.includes('veg')} value='veg' onChange={handleCategoryChange} />
                    </div>
                    <div className="checkBoxContainer">
                        <label>Non Veg</label>
                        <input type='checkbox' checked={category.includes('non-veg')} value='non-veg' onChange={handleCategoryChange} />
                    </div>
                </div>
                <div className="checkinp">
                    <label>Region</label>
                    <div className="checkBoxContainer">
                        <label>South Indina</label>
                        <input type='checkbox' checked={region.includes('south-indian')} value='south-indian' onChange={handleRegionChange} />
                    </div>
                    <div className="checkBoxContainer">
                        <label>NORTH INDIAN</label>
                        <input type='checkbox' checked={region.includes('north-indian')} value='north-indian' onChange={handleRegionChange} />
                    </div>
                    <div className="checkBoxContainer">
                        <label>CHINESE</label>
                        <input type='checkbox' checked={region.includes('chinese')} value='chinese' onChange={handleRegionChange} />
                    </div>
                </div>
                <label>Offers</label><br />
                <input type='text' name='offer' value={offer} onChange={(e) => setOffer(e.target.value)} />
                <label>Firm Image</label><br />
                <input type='file' onChange={handleImageUpLoad} />
                <div className='btnSubmit'>
                    <button type='submit'>Submit</button>
                </div>
            </form>
        </div>
    )
}

export default AddFirms


