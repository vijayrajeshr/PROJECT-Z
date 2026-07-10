import React from 'react'

const NavBar = ({showLoginHandler,showRegisterHandler}) => {
  return (
    <div className="navSection">
        <div className="company">
            Vendor DashBoard
        </div>
        <div className="userAuth">
            <span onClick={showLoginHandler}>Login /</span>
            <span onClick={showRegisterHandler}>Register</span>
        </div>
    </div>
  )
}

export default NavBar
