import { useState } from "react";


import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import TextUtil from "../../FormUtils/TextUtil/TextUtil";
import TelUtil from "../../FormUtils/TelUtil/TelUtil";
import TextAreaUtil from "../../FormUtils/TextAreaUtil/TextAreaUtil";

import css from "./AddRestaurantFormCard.module.css";

let AddRestaurantFormCard = ({ onOpenRegistration }) => {
  let [initialValues, setInitialValues] = useState({
    restName: "",
    location: "",
    phone: "",
    message: "",
  });
  let validationSchema = Yup.object({
    restName: Yup.string()
      .min(5, "Minimum 5 characters required")
      .max(15, "Must be less than 15 characters")
      .required("Required"),
    location: Yup.string().required("Required"),
    phone: Yup.string(),
    message: Yup.string(),
  });

  let submitForm = (values, { setSubmitting, resetForm }) => {
    console.log(values, "submited");
    alert("Thank you! Your request has been submitted.");
    setSubmitting(false);
    resetForm();
  };

  return (
    <div className={css.outerDiv}>
      <div className={css.innerDiv}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submitForm}
          className={css.formikForm}
        >
          <Form className={css.form}>
            <TextUtil name="restName" placeholder="Restaurant name*" />
            <TextUtil name="location" placeholder="Restaurant location*" />
            <TelUtil name="phone" placeholder="Restaurant contact number" />
            <TextAreaUtil
              name="message"
              placeholder="What do you like about the Restaurant?"
            />
            <button
              type="submit"
              className={css.btn}
            >
              Submit
            </button>
          </Form>
        </Formik>
        <div className={css.tag}>
          Restaurant owners can{" "}
          <span
            className={css.link}
            onClick={onOpenRegistration}
            style={{ cursor: "pointer" }}
          >
            add restaurant from here
          </span>
        </div>
      </div>
    </div>
  );
};

export default AddRestaurantFormCard;
