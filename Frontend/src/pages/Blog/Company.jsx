import React from "react";
import Blog from "./Blog";
import { useLocation } from "react-router-dom";
import BlogImageComponent from "./BlogImageComponent";
import styles from "./BlogImageComponent.module.css";
import Footer from "../../components/Footer/Footer";

const Company = () => {
  const location = useLocation();
  const companyData = location.state?.company;
  return (
    <div>
      <Blog />

      {companyData && (
        <div className={styles.allCategoriesContainer}>
          {companyData.map((data, idx) => (
            <div key={idx} className={styles.eachBox}>
              <BlogImageComponent data={data} />
            </div>
          ))}
        </div>
      )}
      {/* <Footer /> */}
    </div>
  );
};

export default Company;
