import { Link } from "react-router-dom";
import css from "./PlacesCard.module.css";
import rightArrow from "/icons/right-arrow.png";

let PlacesCard = ({ place, count, link, hideArrow }) => {
  return (
    <Link to={link} className={css.card}>
      <div className={css.innerBox}>
        <div className={css.place}>{place}</div>
        {count && <div className={css.count}>{count} Places</div>}
      </div>
      {!hideArrow && ( // Hide arrow if hideArrow prop is true
        <div className={css.arrowBox}>
          <img className={css.arrow} src={rightArrow} alt="right arrow" />
        </div>
      )}
    </Link>
  );
};

export default PlacesCard;
