// import React, { useState } from 'react'
// import { API_URL } from '../../data/apiPath';

// const Login = ({ showWelcomeHandler }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const loginHandler = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${API_URL}/vendor/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ email, password })
//       })
//       const data = await response.json();
//       if (response.ok) {
//         alert('Login Success');
//         setEmail("");
//         setPassword("");
//         localStorage.setItem('logintoken', data.token);
//         showWelcomeHandler();
//       }
//       const vendorId = data.vendorId;
//       const vendorResponse = await fetch(`${API_URL}/vendor/single-vendor/${vendorId}`)
//       const vendorData = await vendorResponse.json();
//       if (vendorResponse.ok) {
//         const vendorFirmId = vendorData.vendorFirmId;
//         console.log("Checking For Firm ID:", vendorFirmId);
//         localStorage.setItem('firmId', vendorFirmId);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }


//   return (
//     <div className="loginSection">
//       <h3>Vendor Login</h3>
//       <form className='allForms' onSubmit={loginHandler}>
//         <label>Email</label>
//         <input type="text" name='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email' /><br />
//         <label>Password</label>
//         <input type="password" name='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter your password' /><br />
//         <div className="btnSubmit">
//           <button type='submit'>Submit</button>
//         </div>


//       </form>
//     </div>
//   )
// }

// export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = ({ showWelcomeHandler }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate hook

  const loginHandler = (e) => {
    e.preventDefault();
    // Mock successful login action
    alert('Login Success');
    setEmail("");
    setPassword("");
    
    // You can optionally add localStorage or any other logic here

    // Navigate to /Dining page after successful login
    navigate('/Dining');
  }

  return (
    <div className="loginSection">
      <h3>Vendor Login</h3>
      <form className='allForms' onSubmit={loginHandler}>
        <label>Email</label>
        <input 
          type="text" 
          name='email' 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder='Enter your email' 
        /><br />
        <label>Password</label>
        <input 
          type="password" 
          name='password' 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder='Enter your password' 
        /><br />
        <div className="btnSubmit">
          <button type='submit'>Submit</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
