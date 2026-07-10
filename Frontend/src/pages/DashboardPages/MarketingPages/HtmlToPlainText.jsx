import React from "react";

const HtmlToPlainText = ({ htmlContent }) => {
  const convertHtmlToPlainText = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.innerText || tempDiv.textContent;
  };

  return (
    <div>
      <p>{convertHtmlToPlainText(htmlContent)}</p>
    </div>
  );
};

export default HtmlToPlainText;