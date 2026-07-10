import { withDefaultColorScheme } from "@chakra-ui/react";
import { createContext, useContext, useState,useEffect } from "react";
import axios from "axios"
// Create Context
const CheckoutContext = createContext();

// Context Provider Component
export const CheckoutProvider = ({ children }) => {
  const [selectedPlan, setselectedPlan] = useState(null);
  const [selecetedMealType, setselecetedMealType] = useState(null);
  const [mealType, setMealType] = useState([]);
  const [planType, setPlanType] = useState("normal");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedDates, setSelectedDates] = useState([]);
  const [Taxes, setTaxes] = useState([]);
  const [Charges, setCharges] = useState([]);
  const [Offers, setOffers] = useState([]);
  const [plan, setPlan] = useState([]);
  const [TiffinName, setTiffinName] = useState(null);
  const [Address, setAddress] = useState(null);
 const [selectedDeliverySlot, setSelectedDeliverySlot] = useState("");
  const resetCheckoutData = () => {
    setselectedPlan(null);
    setselecetedMealType(null);
    setMealType([]);
    setPlanType("normal");
    setStartDate(new Date());
    setEndDate(null);
    setQuantity(1);
    setTotalPrice(0);
    setSelectedDates([]);
    setTaxes([]);
    setCharges([]);
    setOffers([]);
    setPlan([]);
    setTiffinName(null);
    setAddress(null);
  };

  const value = {
    setAddress,
    Address,
    TiffinName,
    setTiffinName,
    plan,
    setPlan,
    Offers,
    setOffers,
    Taxes,
    setTaxes,
    Charges,
    setCharges,
    selectedPlan,
    setselectedPlan,
    selecetedMealType,
    setselecetedMealType,
    mealType,
    setMealType,
    planType,
    setPlanType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    quantity,
    setQuantity,
    totalPrice,
    setTotalPrice,
    selectedDates,
    setSelectedDates,
    resetCheckoutData,
    selectedDeliverySlot,
    setSelectedDeliverySlot,
  };

  useEffect(() => {
      const getOffers = async () => {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/jayanthragavanmylsamy@gmail.com/offers`,{withCredentials:true}
        );
        setOffers(response.data);
        console.log(response.data)
      };
      const fetchTaxes = async () => {
            try {
              
              const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/get-taxes/${"jayanthragavanmylsamy@gmail.com"}`,
                {
                  withCredentials: true,
                }
              );
              setTaxes(response.data);
              console.log(response.data)
            } catch (err) {
              //setError("Failed to fetch taxes");
              console.error("Error fetching taxes:", err);
            } 
          };
          fetchTaxes();
      getOffers();
    }, []);
  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

// Custom Hook for consuming context
export const useCheckout = () => {
  return useContext(CheckoutContext);
};
