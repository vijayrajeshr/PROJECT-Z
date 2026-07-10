import React,{useState} from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import Login from '../components/forms/Login'
import Register from '../components/forms/Register'
import AddProducts from '../components/forms/AddProducts'
import AddFirms from '../components/forms/AddFirms'
import Welcome from '../components/forms/Welcome'
import AllProducts from '../components/AllProducts'

const LandingPage = () => {
  const [showLogin,setShowLogin] = useState(false);
  const [showRegister,setShowRegister] = useState(false);
  const [showFirm,setShowFirm] = useState(false);
  const [showProduct,setShowProduct] = useState(false);
  const [showWelcome,setShowWelcome] = useState(false);
  const [showAllProducts,setAllShowProducts] = useState(false);

  const showLoginHandler = ()=>{
    setShowLogin(true);
    setShowRegister(false);
    setShowFirm(false);
    setShowProduct(false);
    setShowWelcome(false);
    setAllShowProducts(false);
  }

  const showRegisterHandler = ()=>{
    setShowRegister(true);
    setShowLogin(false);
    setShowFirm(false);
    setShowProduct(false);
    setShowWelcome(false);
    setAllShowProducts(false);
  }

  const showFirmHandler = ()=>{
    setShowRegister(false);
    setShowLogin(false);
    setShowFirm(true);
    setShowProduct(false);
    setShowWelcome(false);
    setAllShowProducts(false);
  }

  const showProductHandler = ()=>{
    setShowRegister(false);
    setShowLogin(false);
    setShowFirm(false);
    setShowProduct(true);
    setShowWelcome(false);
    setAllShowProducts(false);
  }

  const showWelcomeHandler = ()=>{
    setShowRegister(false);
    setShowLogin(false);
    setShowFirm(false);
    setShowProduct(false);
    setShowWelcome(true);
    setAllShowProducts(false);
  }

  // const showAllProductsHandler = ()=>{
  //   setShowRegister(false);
  //   setShowLogin(false);
  //   setShowFirm(false);
  //   setShowProduct(false);
  //   setShowWelcome(false);
  //   setShowProducts(true);
  // }



  return (
    <>
      <section className='landingSection'></section>
      <NavBar showLoginHandler={showLoginHandler} showRegisterHandler={showRegisterHandler}/>
      <div className="collection">
        <SideBar showFirmHandler={showFirmHandler} showProductHandler={showProductHandler}/>
        {showLogin && <Login showWelcomeHandler={showWelcomeHandler}/>}
        {showRegister && <Register showLoginHandler = {showLoginHandler}/>}
        {showFirm && <AddFirms/>}
        {showProduct && <AddProducts/>}
        {showWelcome && <Welcome/>}
        <AllProducts/>
      </div>
    </>
  )
}

export default LandingPage
