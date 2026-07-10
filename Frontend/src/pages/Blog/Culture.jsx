import React from "react";
import Blog from "./Blog";
import { useLocation } from "react-router-dom";
import BlogImageComponent from "./BlogImageComponent";
import styles from "./BlogImageComponent.module.css";
import Footer from "../../components/Footer/Footer";

const Culture = () => {
  const location = useLocation();
  const cultureData = location.state?.culture;
  return (
    <div>
      <Blog />

      {cultureData && (
        <div className={styles.allCategoriesContainer}>
          {cultureData.map((data, idx) => (
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

export default Culture;
