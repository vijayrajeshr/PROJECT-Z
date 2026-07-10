import React from "react";
import Blog from "./Blog";
import { useLocation } from "react-router-dom";
import BlogImageComponent from "./BlogImageComponent";
import styles from "./BlogImageComponent.module.css";
import Footer from "../../components/Footer/Footer";

const Community = () => {
  const location = useLocation();
  const communityData = location.state?.community;
  return (
    <div>
      <Blog />

      {communityData && (
        <div className={styles.allCategoriesContainer}>
          {communityData.map((data, idx) => (
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

export default Community;
