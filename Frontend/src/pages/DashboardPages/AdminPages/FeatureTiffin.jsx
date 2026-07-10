import React from "react";

const FeaturesPage = () => {
    const featuresData = {
        views: {
          total: "671,120",
          lastMonth: "3,780",
        },
        comments: {
          total: "6,120",
          lastMonth: "180",
        },
        cashFlow: {
          total: "$671,120",
          lastMonth: "$23,780",
        },
        servicesOffered: ["Dine-Out", "Delivery"],
        categories: ["Non-Veg", "Halal", "Gluten-Free"],
        cuisines: ["Seafood", "Mediterranean"],
        features: ["Sea View", "Live Music", "Pet-Friendly"],
        paymentMethods: ["Credit Card", "Debit Card", "Cash"],
        deliveryAreas: ["Coastal Region", "Harbor Area"],
        currentOffers: [
          {
            code: "START20",
            discount: "20%",
            description: "Applied to category: Starters",
            expiresOn: "2024-12-31",
          },
          {
            code: "VEGSTART15",
            discount: "15%",
            description: "Applied to subcategory: Veg Starters",
            expiresOn: "2024-12-31",
          },
          {
            code: "BOGOPANEER",
            discount: "BOGO",
            description: "Applied to items: Paneer Tikka",
            expiresOn: "2024-12-31",
          },
          {
            code: "NONVEG10",
            discount: "10%",
            description: "Applied to subcategory: Non-Veg Starters",
            expiresOn: "2024-12-31",
          },
          {
            code: "MAINCOURSE30",
            discount: "30%",
            description: "Applied to category: Main Course",
            expiresOn: "2024-12-31",
          },
          {
            code: "FREEBCDRINK",
            discount: "Combo",
            description: "Applied to items: Butter Chicken",
            expiresOn: "2024-12-31",
          },
          {
            code: "VEGMAIN5",
            discount: "5%",
            description: "Applied to subcategory: Veg Main Course",
            expiresOn: "2024-12-31",
          },
          {
            code: "BOGOWINGS",
            discount: "BOGO",
            description: "Applied to items: Tandoori Wings",
            expiresOn: "2024-12-31",
          },
        ],
      };
      
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Features</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Statistics</h2>
        <p>Views: {featuresData.views.total} ({featuresData.views.lastMonth} last month)</p>
        <p>Comments: {featuresData.comments.total} ({featuresData.comments.lastMonth} last month)</p>
        <p>Cash Flow: {featuresData.cashFlow.total} ({featuresData.cashFlow.lastMonth} last month)</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Services Offered</h2>
        <ul className="list-disc ml-5">
          {featuresData.servicesOffered.map((service, index) => (
            <li key={index}>{service}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Categories</h2>
        <ul className="list-disc ml-5">
          {featuresData.categories.map((category, index) => (
            <li key={index}>{category}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Cuisines</h2>
        <ul className="list-disc ml-5">
          {featuresData.cuisines.map((cuisine, index) => (
            <li key={index}>{cuisine}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Additional Features</h2>
        <ul className="list-disc ml-5">
          {featuresData.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Payment Methods</h2>
        <ul className="list-disc ml-5">
          {featuresData.paymentMethods.map((method, index) => (
            <li key={index}>{method}</li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Delivery Areas</h2>
        <ul className="list-disc ml-5">
          {featuresData.deliveryAreas.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Current Offers</h2>
        {featuresData.currentOffers.map((offer, index) => (
          <div key={index} className="mb-3 p-3 border rounded-lg shadow-md">
            <p><strong>Code:</strong> {offer.code}</p>
            <p><strong>Discount:</strong> {offer.discount}</p>
            <p><strong>Description:</strong> {offer.description}</p>
            <p><strong>Expires On:</strong> {offer.expiresOn}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default FeaturesPage;
