import React, { useEffect } from 'react'
import {useNavigate, useSearchParams} from "react-router-dom"
export const Type = () => {
  const naviagte=useNavigate();
    const [searchParams]=useSearchParams();
    const type=searchParams.get("");
    useEffect(()=>{
      switch(type){
        case "admin-dashboard":
          naviagte("/admin-Dashboard");
          break;
        case "hospital-dashboard":
          naviagte("/hospital-dashboard");
          break;
        case "restaurant-dashboard":
          naviagte("/restaurant-dashboard")
          break;
        case "fashion-dashboard":
          naviagte("/fashion-dashboard")
          break;
        case "school-dashboard":
          naviagte("/school-Dashboard")
      }
    },[])
  return (
    <div></div>
  )
}
