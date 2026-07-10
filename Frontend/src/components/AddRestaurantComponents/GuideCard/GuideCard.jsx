import css from "./GuideCard.module.css";
import { Link } from "react-router-dom";
import { FaCircleCheck } from "react-icons/fa6";

const GuideCard = () => {
  const obj = {
    heading: "Get Started - It only takes 10 minutes",
    subHeading: "Please be ready with the following for a smooth registration",
    requirement: [
      "PAN card",
      "Menu details and one dish image",
      "GST number, if applicable",
      "FSSAI license",
      "Bank account details",
    ],
  };

  return (
    <div className={css.cardBg}>
      <div className={css.guideCard}>
        <div className={css.textContainer}>
          <div className={css.header}>
            <div className={css.heading}>{obj.heading}</div>
            <div className={css.subHeading}>{obj.subHeading}</div>
          </div>

          <div className={css.requirement}>
            {obj.requirement.map((el, idx) => (
              <div key={idx} className={css.pointToConsider}>
                <FaCircleCheck className={css.checkIcon} />
                <div className={css.point}>
                  {el}
                  <br />
                  {idx === 2 && (
                    <span>
                      Require a GST?
                      <Link className={css.applyLink}>Apply here</Link>
                    </span>
                  )}
                  {idx === 3 && (
                    <span>
                      Dont have a FSSAI license?
                      <Link className={css.applyLink}>Apply here</Link>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={css.videoContainer}>
          <video
            src="/videos/registerationGuide.mp4"
            controls
            autoPlay
            muted
          ></video>
        </div>
      </div>
    </div>
  );
};

export default GuideCard;
