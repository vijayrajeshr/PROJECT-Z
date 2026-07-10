import React from "react";
import { Link } from "react-router-dom";
import footerCss from "./Footer.module.css";

import Gstore from "/icons/playstore.png";
import Appstore from "/icons/appstore.png";

import Facebook from "/images/facebook.png";
import Twitter from "/images/x_logo.png";
import Instagram from "/images/instagram.png";
import Linkedin from "/images/linkedin.png";
import Youtube from "/images/youtube.png";

import CountryDropdown from "../../utils/FooterUtils/CountryDropdown/CountryDropdown";
import LanguageDropdown1 from "../../utils/FooterUtils/LanguageDropdown/LanguageDropdown1/LanguageDropdown1";

const Filters = () => {
  return (
    <div className={footerCss.filters}>
      <CountryDropdown />
      <LanguageDropdown1 />
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="w-full bg-[white] border-t border-gray-200 px-4 sm:px-8 md:px-16 py-8 md:py-12 mt-15">
      <div className="flex flex-col gap-8">

        {/* Section 1: Logo */}
        <div className="flex justify-center -mt-39">
          <a href="/" className="text-2xl font-semibold text-gray-800">
            Zomato
          </a>
          {/* <Filters /> */}
        </div>
        <div className={footerCss.sec2}>
          <div className={[footerCss.box1, footerCss.box].join(" ")}>
            <div className={footerCss.boxTtl}>ABOUT US</div>
            <Link to="/whoweare" className={footerCss.boxOpt}>
              Who We Are
            </Link>

            <Link to="https://www.olcademy.in/contact.html" className={footerCss.boxOpt}>
              Work With Us
            </Link>
            <Link to="/investors-relations" className={footerCss.boxOpt}>
              Investor Relations
            </Link>
            <a href="/reportfraud" className={footerCss.boxOpt}>
              Report Fraud
            </a>
          </div>

          {/* <div className={[footerCss.box2, footerCss.box].join(' ')}>
                        <div className={footerCss.boxTtl}>ZOMAVERSE</div>
                        <a href="#" className={footerCss.boxOpt}>Zomato</a>
                        <a href="#" className={footerCss.boxOpt}>Feeding India</a>
                        <a href="#" className={footerCss.boxOpt}>Hyperpure</a>
                        <a href="#" className={footerCss.boxOpt}>Zomaland</a>
                    </div> */}

          <div className={[footerCss.box3, footerCss.box].join(" ")}>
            <div className={footerCss.boxTtl}>FOR RESTAURANTS</div>

            <Link to="/PartnerWithUs" className={footerCss.boxOpt}>
              Partner With Us
            </Link>
            {/*  */}
            <a href="#" className={footerCss.boxOpt}>
              Apps For You
            </a>

            <div className={footerCss.boxTtl}>FOR ENTERPRISES</div>

          </div>
          <div className={[footerCss.box4, footerCss.box].join(" ")}>
            <div className={footerCss.boxTtl}>LEARN MORE</div>
            <a href="/:Privacy Policy" className={footerCss.boxOpt}>
              Privacy
            </a>
            <a href="/:Security" className={footerCss.boxOpt}>
              Security
            </a>
            <a href="/:Terms-of-Service" className={footerCss.boxOpt}>
              Terms
            </a>
            {/* <a href="#" className={footerCss.boxOpt}>Sitemap</a> */}
          </div>
          <div className={`${footerCss.box5} ${footerCss.box}`}>
            <div className={footerCss.boxTtl}>SOCIAL LINKS</div>
            <div className={footerCss.socialImgs}>
              <a
                href="https://facebook.com"
                className={footerCss.socialImgAnchore}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className={footerCss.socialImg}
                  src={Facebook}
                  alt="Facebook"
                />
              </a>
              <a
                href="https://linkedin.com"
                className={footerCss.socialImgAnchore}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className={footerCss.socialImg}
                  src={Linkedin}
                  alt="LinkedIn"
                />
              </a>
              <a
                href="https://instagram.com"
                className={footerCss.socialImgAnchore}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className={footerCss.socialImg}
                  src={Instagram}
                  alt="Instagram"
                />
              </a>
              <a
                href="https://twitter.com"
                className={footerCss.socialImgAnchore}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className={footerCss.socialImg}
                  src={Twitter}
                  alt="Twitter"
                />
              </a>
              <a
                href="https://youtube.com"
                className={footerCss.socialImgAnchore}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className={footerCss.socialImg}
                  src={Youtube}
                  alt="YouTube"
                />
              </a>
            </div>
            <div className={footerCss.appContainer}>
              <a
                href="https://play.google.com/store"
                className={footerCss.app}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className={footerCss.appImg}
                  src={Gstore}
                  alt="Google Play Store"
                />
              </a>
              <a
                href="https://www.apple.com/app-store/"
                className={footerCss.app}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className={footerCss.appImg}
                  src={Appstore}
                  alt="Apple App Store"
                />
              </a>
            </div>
          </div>
        </div>
        <hr className={footerCss.breakLine} />
        <div className={footerCss.sec3}>
          By continuing past this page, you agree to our Terms of Service,
          Cookie Policy, Privacy Policy, and Content Policies. All trademarks
          are properties of their respective owners. 2008-2022 © Zomato™ Ltd.
          All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
