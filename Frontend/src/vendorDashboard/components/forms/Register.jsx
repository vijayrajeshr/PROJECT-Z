import React , {useState} from 'react'
import { API_URL } from '../../data/apiPath';


const Register = ({showLoginHandler}) => {
    const[username,setUsername]  = useState("");
    const[email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const [loading,setLoading] = useState(true);

const handleSubmit = async(e) =>{
    e.preventDefault();
    try {
        const response = await fetch(`${API_URL}/vendor/register`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({username,email,password})
        })
        const data = await response.json();
        if(response.ok){
            console.log(data);
            setUsername("");
            setEmail("");
            setPassword("");
            alert("Vendor Registered Successfully!");
            showLoginHandler();
        }
        else{
            alert("There is some problem")
        }
    } catch (error) {
        console.error("Registeration Failed",error);
        alert("Registeration Failed")
    }
}

    return (
        <div className="registerSection">
            <h3>Vendor Register</h3>
            <form className='allForms' onSubmit={handleSubmit}>
                <label>Username</label>
                <input type="text" name='username' value={username} onChange={(e)=> setUsername(e.target.value)} placeholder='Enter your Username' /><br />
                <label>Email</label>
                <input type="text" name='email' value={email} onChange={(e)=> setEmail(e.target.value)} placeholder='Enter your email' /><br />
                <label>Password</label>
                <input type="password" name='password' value={password} onChange={(e)=> setPassword(e.target.value)} placeholder='Enter your password' /><br />
                <div className="btnSubmit">
                    <button type='submit'>Submit</button>
                </div>


            </form>
        </div>
    )
}

export default Register
