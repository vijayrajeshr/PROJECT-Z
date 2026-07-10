import React from "react";
import Blog from "./Blog";
import { useLocation } from "react-router-dom";
import BlogImageComponent from "./BlogImageComponent";
import styles from "./BlogImageComponent.module.css";
import Footer from "../../components/Footer/Footer";

const Technology = () => {
  const location = useLocation();
  const teachnologyData = location.state?.technology;
  return (
    <div>
      <Blog />

      {teachnologyData && (
        <div className={styles.allCategoriesContainer}>
          {teachnologyData.map((data, idx) => (
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

export default Technology;
