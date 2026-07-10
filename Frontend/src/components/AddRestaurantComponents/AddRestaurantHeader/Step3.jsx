import React, { useState, useEffect } from "react";
import { FcAddImage } from "react-icons/fc";

const Step3 = ({
  formData,
  handleChange,
  setFormData,
  handleDocumentUpload,
  serviceType,
}) => {
  const [validationErrors, setValidationErrors] = useState({
    mandatoryDocs: false,
    kycDocs: false,
  });

  const formGroupStyle = { marginBottom: "16px" };
  const labelStyle = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: "8px",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  };
  const fileUploadWrapperStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
  };
  const fileInstructionsStyle = {
    fontSize: "12px",
    color: "#95A5A6",
    marginTop: "5px",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  };
  const textareaInputStyle = {
    width: "100%",
    height: "120px",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #BDC3C7",
    borderRadius: "5px",
    resize: "vertical",
    marginBottom: "16px",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
  };
  const successStyle = {
    color: "#27AE60",
    fontSize: "14px",
    marginTop: "5px",
  };
  const errorStyle = {
    color: "#E74C3C",
    fontSize: "14px",
    marginTop: "5px",
  };
  const requiredLabelStyle = {
    color: "#E74C3C",
    marginLeft: "4px",
  };
  const sectionTitleStyle = {
    fontSize: "18px",
    fontWeight: "700",
    color: "#2C3E50",
    marginTop: "24px",
    marginBottom: "16px",
    borderBottom: "1px solid #ECF0F1",
    paddingBottom: "8px",
  };

  const mandatoryDocs = [
    {
      label: "Business Registration Certificate",
      field: "businessRegistrationCertificate",
      required: true,
    },
    {
      label: "Hygiene Certificate",
      field: "hygieneCertificate",
      required: true,
    },
  ];

  const kycDocs = [
    { label: "Driver's License", field: "driverLicense" },
    { label: "Passport", field: "passport" },
    { label: "State ID", field: "stateId" },
    { label: "Military ID", field: "militaryId" },
    { label: "Government ID", field: "governmentId" },
    { label: "Permanent Resident Card", field: "permanentResidentCard" },
    {
      label: "Certificate of Citizenship or Naturalization",
      field: "citizenshipCertificate",
    },
    {
      label: "Employment Authorization Document (EAD)",
      field: "employmentAuthDocument",
    },
    { label: "Trusted Traveller ID", field: "trustedTravellerID" },
    { label: "Tribal ID", field: "tribalID" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    validateDocuments();
  }, [formData.uploadStatus]);

  const validateDocuments = () => {
    const uploadStatus = formData.uploadStatus || {};
    const hasMandatoryDocs = mandatoryDocs.every(
      (doc) =>
        uploadStatus[doc.field] &&
        (uploadStatus[doc.field].status === "pending" ||
          uploadStatus[doc.field].status === "success")
    );

    const hasKycDoc = kycDocs.some(
      (doc) =>
        uploadStatus[doc.field] &&
        (uploadStatus[doc.field].status === "pending" ||
          uploadStatus[doc.field].status === "success")
    );

    setValidationErrors({
      mandatoryDocs: !hasMandatoryDocs,
      kycDocs: !hasKycDoc,
    });

    setFormData((prev) => ({
      ...prev,
      documentValidation: {
        hasMandatoryDocs,
        hasKycDoc,
        isValid: hasMandatoryDocs && hasKycDoc,
      },
    }));
  };

  const handleFileUpload = (documentField, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      uploadStatus: {
        ...prev.uploadStatus,
        [documentField]: {
          status: "pending",
          message: "File selected, ready for submission",
        },
      },
      uploadedDocs: {
        ...prev.uploadedDocs,
        [documentField]: { file, documentType: documentField, serviceType },
      },
    }));
  };

  const renderDocumentInput = (doc) => (
    <div key={doc.field} style={formGroupStyle}>
      <label style={labelStyle}>
        {doc.label}
        {doc.required && <span style={requiredLabelStyle}>*</span>}
      </label>
      <div style={fileUploadWrapperStyle}>
        <input
          type="file"
          onChange={(e) => handleFileUpload(doc.field, e)}
          accept="image/jpeg, image/png, application/pdf"
          id={`file-${doc.field}`}
          style={{ display: "none" }}
        />
        <FcAddImage
          className="h-20 w-20 text-blue-500"
          onClick={() => document.getElementById(`file-${doc.field}`).click()}
          style={{ cursor: "pointer" }}
        />
        <p style={fileInstructionsStyle}>Supported format: JPG, PNG, PDF.</p>

        {formData.uploadStatus?.[doc.field] && (
          <p
            style={
              formData.uploadStatus[doc.field].status === "success"
                ? successStyle
                : errorStyle
            }
          >
            {formData.uploadStatus[doc.field].message}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div style={sectionTitleStyle}>Mandatory Documents</div>
      {validationErrors.mandatoryDocs && (
        <p style={errorStyle}>
          Both Business Registration Certificate and Hygiene Certificate are
          required.
        </p>
      )}
      {mandatoryDocs.map(renderDocumentInput)}

      <div style={sectionTitleStyle}>
        Identification Documents (Upload at least one)
      </div>
      {validationErrors.kycDocs && (
        <p style={errorStyle}>
          Please upload at least one identification document.
        </p>
      )}
      {kycDocs.map(renderDocumentInput)}

      <div style={formGroupStyle}>
        <label style={labelStyle} htmlFor="productDescription">
          Please tell us more about your business, products{" "}
          <span style={requiredLabelStyle}>*</span>
        </label>
        <textarea
          id="productDescription"
          name="productDescription"
          value={formData.productDescription || ""}
          onChange={handleChange}
          placeholder="Briefly describe your business goals, products, and offerings."
          required
          style={textareaInputStyle}
        />
      </div>
    </div>
  );
};

export default Step3;
