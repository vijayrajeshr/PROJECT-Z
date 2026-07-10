import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to fetch and calculate taxes and other charges based on cart items and subtotal.
 * @param {object} axiosApi - An Axios instance for making API calls.
 * @param {Array} cartItems - An array of items in the cart.
 * @param {number} subtotal - The subtotal of the cart items.
 * @returns {object} An object containing applied taxes, total taxes, other charges, and total other charges.
 */
const useTaxCalculator = (axiosApi, cartItems, subtotal) => {
  const [totalTaxes, setTotalTaxes] = useState(0);
  const [allAvailableTaxes, setAllAvailableTaxes] = useState([]);
  const [appliedItemizedTaxes, setAppliedItemizedTaxes] = useState([]);
  const [otherCharges, setOtherCharges] = useState([]);
  const [totalOtherCharges, setTotalOtherCharges] = useState(0);

  // Memoized fetchAllTaxes
  const fetchAllTaxes = useCallback(async () => {
    try {
      const response = await axiosApi.get(
        `${import.meta.env.VITE_SERVER_URL}/api/taxes`
      );
      const taxesData = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.taxes)
        ? response.data.taxes
        : [];

      const formattedTaxes = taxesData.map((tax) => ({
        id: tax._id,
        country: tax.countryName,
        type: tax.taxType,
        rate: parseFloat(tax.rate || 0),
        description: tax.description,
      }));
      setAllAvailableTaxes(formattedTaxes);
      return formattedTaxes;
    } catch (err) {
      console.error("Error fetching tax types:", err);
      return [];
    }
  }, [axiosApi]);

  // Memoized fetchOtherCharges
  const fetchOtherCharges = useCallback(
    async (currentSubtotal) => {
      try {
        const response = await axiosApi.get(
          `${import.meta.env.VITE_SERVER_URL}/api/charges/get-Charges`
        );
        const applicableCharges = response.data.filter(
          (charge) => charge.isApplicable
        );
        setOtherCharges(applicableCharges);

        let total = 0;
        applicableCharges.forEach((charge) => {
          if (charge.type === "flat") {
            total += parseFloat(charge.value);
          } else if (charge.type === "percentage") {
            total += (parseFloat(charge.value) / 100) * currentSubtotal;
          }
        });
        setTotalOtherCharges(total);
      } catch (err) {
        console.error("Error fetching other charges:", err);
      }
    },
    [axiosApi]
  );

  // Memoized calculateItemTaxes
  const calculateItemTaxes = useCallback((cartItemsArr, taxesArr) => {
    if (!cartItemsArr?.length || !taxesArr?.length) return [];

    const calculatedTaxes = [];
    const countryTaxMap = {};

    taxesArr.forEach((tax) => {
      if (!countryTaxMap[tax.country]) {
        countryTaxMap[tax.country] = [];
      }
      countryTaxMap[tax.country].push(tax);
    });

    cartItemsArr.forEach((item) => {
      let country = "Canada"; // Default fallback (consider removing in production)

      // Robustly find country from item/product data
      if (item.restaurantName?.restaurantInfo?.country) {
        country = item.restaurantName.restaurantInfo.country;
      } else if (item.restaurantName?.country) {
        country = item.restaurantName.country;
      } else if (item.country) {
        country = item.country;
      } else if (item.productId?.country) {
        country = item.productId.country;
      }

      const applicableTaxes = countryTaxMap[country] || [];

      if (applicableTaxes.length) {
        applicableTaxes.forEach((tax) => {
          const rawPrice =
            typeof item.price === "string"
              ? parseFloat(item.price.replace(/[^0-9.-]+/g, ""))
              : parseFloat(item.price || 0);

          const itemPriceTotal = rawPrice * item.quantity;
          const taxAmount = (tax.rate / 100) * itemPriceTotal;

          const existingTaxIndex = calculatedTaxes.findIndex(
            (t) => t.country === country && t.type === tax.type
          );

          if (existingTaxIndex > -1) {
            calculatedTaxes[existingTaxIndex].amount += taxAmount;
            calculatedTaxes[existingTaxIndex].items.push({
              itemId: item.productId?._id,
              itemName: item.name,
              price: itemPriceTotal,
              taxAmount: taxAmount,
            });
          } else {
            calculatedTaxes.push({
              country: country,
              type: tax.type,
              rate: tax.rate,
              amount: taxAmount,
              description: tax.description,
              items: [
                {
                  itemId: item.productId?._id,
                  itemName: item.name,
                  price: itemPriceTotal,
                  taxAmount: taxAmount,
                },
              ],
            });
          }
        });
      }
    });
    return calculatedTaxes;
  }, []);

  // Effect to perform calculations whenever cart items or subtotal changes
  useEffect(() => {
    const performCalculations = async () => {
      const taxes = await fetchAllTaxes();
      const calculatedTaxes = calculateItemTaxes(cartItems, taxes);
      setAppliedItemizedTaxes(calculatedTaxes);

      const sumOfAllTaxes = calculatedTaxes.reduce(
        (sum, tax) => sum + tax.amount,
        0
      );
      setTotalTaxes(sumOfAllTaxes);

      fetchOtherCharges(subtotal);
    };

    performCalculations();
  }, [
    axiosApi, // Add axiosApi as a dependency for the initial fetch and subsequent calls
    cartItems,
    subtotal,
    fetchAllTaxes,
    calculateItemTaxes,
    fetchOtherCharges,
  ]);

  return { appliedItemizedTaxes, totalTaxes, otherCharges, totalOtherCharges };
};

export default useTaxCalculator;