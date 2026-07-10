import css from "./Footer2.module.css";
import zomatoLogo from "/images/zomato_logo.svg";
import Facebook from "/images/facebook.png";
import Twitter from "/images/twitter.png";
import Instagram from "/images/instagram.png";

const Footer2 = () => {
  return (
    <div className={css.main}>
      {/* -----box 1--- */}
      <div className={css.box1}>
        <div>
          <img src={zomatoLogo} alt="" width={"60px"} />
        </div>
        <div>
          <select className={css.langBox} name="" id="">
            <option value="">English</option>
            <option value="">Hindi</option>
            <option value="">Italian</option>
          </select>
        </div>
      </div>

      <div className={css.hrLine}></div>

      {/* ----box 2--- */}
      <div className={css.gridBox}>
        <div>
          <h3>About Zomato</h3>
          <ul className={css.list}>
            <li>About Us</li>
            <li>Culture</li>
            <li>Blog</li>
            <li>Careers</li>
            <li>Report Fraud</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h3>For Foodies</h3>
          <ul className={css.list}>
            <li>Code of Conduct</li>
            <li>Community</li>
            <li>Verified Users</li>
            <li>Blogger Help</li>
            <li>Mobile Apps</li>
          </ul>
        </div>

        <div>
          <h3>For Restaurants</h3>
          <ul className={css.list}>
            <li>Add a Restaurant</li>
            <li>Advertise</li>
            <li>Order</li>
            <li>Book</li>
            <li>Trace</li>
            <li>Hyperpure</li>
          </ul>
        </div>
      </div>

      <div className={css.hrLine}></div>

      {/* ------box 3------ */}

      <div>
        <h3 style={{ marginBottom: "0" }}>Countries</h3>
        <div className={css.gridBox2}>
          <ul className={css.list}>
            <li>Australia</li>
            <li>Brasil</li>
            <li>Canada</li>
            <li>Chile</li>
            <li>Czech Republic</li>
          </ul>

          <ul className={css.list}>
            <li>India</li>
            <li>Indonesia</li>
            <li>Ireland</li>
            <li>Italy</li>
            <li>Lebanon</li>
          </ul>

          <ul className={css.list}>
            <li>Malaysia</li>
            <li>New Zealand</li>
            <li>Philippines</li>
            <li>Poland</li>
            <li>Portugal</li>
          </ul>

          <ul className={css.list}>
            <li>Qatar</li>
            <li>Singapore</li>
            <li>Slovakia</li>
            <li>South Africa</li>
            <li>Sri Lanka</li>
          </ul>

          <ul className={css.list}>
            <li>Turkey</li>
            <li>UAE</li>
            <li>United Kingdom</li>
            <li>United States</li>
          </ul>
        </div>
      </div>

      <div className={css.hrLine}></div>

      {/* -----box 4 links----- */}

      <div className={css.moreLinks}>
        <div className={css.moreLinksInner}>
          <a href="">Privacy</a>
          <a href="">Terms</a>
          <a href="">API Policy</a>
          <a href="">CSR</a>
          <a href="">Security</a>
          <a href="">Sitemap</a>
        </div>

        <div className={css.socialMediaIconsBox}>
          <img className={css.socialMediaIcons} src={Facebook} alt="fb logo" />
          <img className={css.socialMediaIcons} src={Twitter} alt="ig logo" />
          <img className={css.socialMediaIcons} src={Instagram} alt="x logo" />
        </div>
      </div>

      <div className={css.hrLine}></div>

      {/* ---last words----- */}
      <div>
        <span className={css.lastWords}>
          By continuing past this page, you agree to our Terms of Service,
          Cookie Policy, Privacy Policy and Content Policies. All trademarks are
          properties of their respective owners. © 2008-2024 - Zomato™ Media Pvt
          Ltd. All rights reserved.
        </span>
      </div>
    </div>
  );
};

export default Footer2;
