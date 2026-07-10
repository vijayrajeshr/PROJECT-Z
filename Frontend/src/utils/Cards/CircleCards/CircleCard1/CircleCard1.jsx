import css from "./CircleCard1.module.css";
import { Link } from "react-router-dom";
let CircleCard1 = ({ imgSrc, name, link, refto }) => {
  return (
    <Link to={link} onClick={refto} className={css.linkclass}>
      <div className={css.outerDiv}>
        <div className={css.innerDiv}>
          <div className={css.imgDiv}>
            <img className={css.img} src={imgSrc} alt="food image" />
          </div>
          <div className={css.title}>{name}</div>
        </div>
      </div>
    </Link>
  );
};

export default CircleCard1;
