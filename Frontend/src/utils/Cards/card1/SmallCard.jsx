// import { Link } from "react-router-dom";
// import css from "./SmallCard.module.css";

// let SmallCard = ({ imgSrc, text, link }) => {
//   const isExternalLink = link.startsWith("http");

//   return isExternalLink ? (
//     <a
//       href={link}
//       className={`${css.card} max-md:max-w-[250px] max-lg:max-w-[300px] max-xl:max-w-[400px]  max-sm:max-w-[350px] max-sm:max-h-[220px]`}
//       target="_blank"
//       rel="noopener noreferrer"
//     >
//       <div className={css.imgBox}>
//         <img src={imgSrc} alt="card image" className={css.img} />
//       </div>
//       <div className={css.txtBx}>
//         <div className={css.txt}>{text}</div>
//       </div>
//     </a>
//   ) : (
//     <Link
//       to={link}
//       className={`${css.card} max-md:max-w-[250px] max-lg:max-w-[300px] max-xl:max-w-[400px]  max-sm:max-w-[350px] max-sm:max-h-[220px] `}
//     >
//       <div className={css.imgBox}>
//         <img src={imgSrc} alt="card image" className={css.img} />
//       </div>
//       <div className={css.txtBx}>
//         <div className={css.txt}>{text}</div>
//       </div>
//     </Link>
//   );
// };

// export default SmallCard;

import { Link } from "react-router-dom";
// REMOVE THIS LINE: import css from "./SmallCard.module.css"; // No longer needed

const SmallCard = ({ imgSrc, text, link }) => {
  const isExternalLink = link.startsWith("http");

  // Tailwind CSS classes for the card container
  const cardClasses = `
    block
    bg-[#02757A]
    rounded-xl
    shadow-sm
    overflow-hidden
    transition-all duration-300 ease-in-out
    hover:shadow-lg
    hover:-translate-y-2
    h-full // Ensure cards take full height of their grid cell for consistent rows
    transform // Necessary for hover:translate-y to work
  `;

  // Tailwind CSS classes for the image container
  const imgBoxClasses = `
    relative
    h-36
    sm:h-40
    md:h-48
    lg:h-52
    w-full
  `;

  const imgClasses = `
    w-full
    h-full
    object-cover
  `;
  const textBoxClasses = `
    p-4 // Padding inside the text box
    sm:p-5 // Larger padding for small screens
    text-center // Center the text
  `;

  const textClasses = `
    text-lg
    sm:text-xl
    font-semibold
    text-white
  `;

  const combinedCardClasses = cardClasses.replace(/\s+/g, " ").trim();
  const combinedImgBoxClasses = imgBoxClasses.replace(/\s+/g, " ").trim();
  const combinedImgClasses = imgClasses.replace(/\s+/g, " ").trim();
  const combinedTextBoxClasses = textBoxClasses.replace(/\s+/g, " ").trim();
  const combinedTextClasses = textClasses.replace(/\s+/g, " ").trim();

  return isExternalLink ? (
    <a
      href={link}
      className={combinedCardClasses}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={combinedImgBoxClasses}>
        <img src={imgSrc} alt={text} className={combinedImgClasses} />
      </div>
      <div className={combinedTextBoxClasses}>
        <div className={combinedTextClasses}>{text}</div>
      </div>
    </a>
  ) : (
    <Link to={link} className={combinedCardClasses}>
      <div className={combinedImgBoxClasses}>
        <img src={imgSrc} alt={text} className={combinedImgClasses} />
      </div>
      <div className={combinedTextBoxClasses}>
        <div className={combinedTextClasses}>{text}</div>
      </div>
    </Link>
  );
};

export default SmallCard;