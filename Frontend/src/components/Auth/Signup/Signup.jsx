import { useState, useEffect, useRef } from "react";
// import { createPortal } from "react-dom"; // Removed
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Removed old image imports
import { Eye, EyeOff, Loader2, X as CloseIcon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import styles from "./Signup.module.css"; // Changed variable name
import "./otp.css";

const Signup = ({ setAuth }) => {
  // --- State Variables ---
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    accept: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpArray, setOtpArray] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(300);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false); // For signup submit & resend
  const [otpLoading, setOtpLoading] = useState(false); // For OTP verification
  // Removed buttonGreen state

  const otpRefs = useRef([]);
  const navigate = useNavigate();

  // --- Helper Functions ---
  const closeModal = () => {
    setAuth({ closed: true, login: false, signup: false });
    // Reset state fully
    setFormData({ username: "", email: "", password: "", accept: false });
    setShowPassword(false);
    setError("");
    setShowOtp(false);
    setOtpArray(Array(6).fill(""));
    setOtpError("");
    setTimer(300);
    setResendDisabled(true);
    setLoading(false);
    setOtpLoading(false);
  };

  const openLoginModal = () => {
    setAuth({ closed: false, login: true, signup: false });
  };

  const clearError = () => {
    if (error) setError("");
    if (otpError) setOtpError("");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // --- Logic Handlers ---
  useEffect(() => {
    let intervalId;
    if (showOtp && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(intervalId);
  }, [showOtp, timer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    clearError(); // Clear errors on change
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value) || value.length > 1) return;
    const newOtpArray = [...otpArray];
    newOtpArray[index] = value;
    setOtpArray(newOtpArray);
    if (otpError) setOtpError("");

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtpArray = [...otpArray];
      pastedData.split("").forEach((digit, idx) => {
        if (idx < 6) newOtpArray[idx] = digit;
      });
      setOtpArray(newOtpArray);
      const focusIndex = Math.min(pastedData.length, 5);
      otpRefs.current[focusIndex]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle Initial Signup (Send OTP)
  const handleSignup = async (e) => {
    e.preventDefault();
    clearError();
    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill in username, email, and password.");
      return;
    }
    if (!formData.accept) {
      setError("Please accept the terms and conditions.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/signup`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );
    } catch (err) {
      // Don't stall the flow on network/backend errors — still allow user to proceed to OTP screen.
      const msg =
        err.response?.data?.error ||
        err.message ||
        "We couldn't send the OTP right now.";
      setError(msg);
      setOtpError(
        "We couldn't send the OTP. You can still try entering it, or resend."
      );
      setTimer(0);
      setResendDisabled(false);
    } finally {
      // Always move to OTP screen once the form is valid.
      setShowOtp(true);
      // If not already enabled (e.g. success path), start timer.
      setTimer((prev) => (prev > 0 ? prev : 300));
      setResendDisabled((prev) => (prev === false ? false : true));
      setLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    const enteredOtp = otpArray.join("");
    if (enteredOtp.length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP.");
      return;
    }
    setOtpLoading(true); // Use OTP loading state
    setOtpError("");

    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/verify`,
        {
          identifier: formData.email.trim(),
          otp: Number(enteredOtp),
          password: formData.password,
          username: formData.username,
        },
        { withCredentials: true }
      );
      alert("Signup Successful! Please log in.");
      openLoginModal(); // Switch to login modal
    } catch (err) {
      setOtpError(
        err.response?.data?.error || "Invalid OTP. Please try again."
      );
      // Removed setButtonGreen(false)
    } finally {
      setOtpLoading(false); // Use OTP loading state
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (resendDisabled) return;
    setLoading(true); // Use general loading state
    setOtpError("");
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/send-email-otp`,
        { email: formData.email },
        { withCredentials: true }
      );
      setTimer(300); // Reset timer
      setResendDisabled(true);
      setOtpArray(Array(6).fill(""));
      otpRefs.current[0]?.focus();
    } catch (err) {
      setOtpError(
        err.response?.data?.error || "Failed to resend OTP. Try again later."
      );
    } finally {
      setLoading(false); // Use general loading state
    }
  };

  // Social Media Signup Handlers
  const signupWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/api/google`;
  };
  const signupWithFacebook = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/api/facebook`;
  };
  const signupWithTwitter = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL}/api/twitter`;
  };

  // --- Render Logic ---
  // Removed loginDiv variable and createPortal wrapper
  return (
    <div className={styles.overlay}>
      {" "}
      {/* Use styles */}
      <div className={styles.modal}>
        {" "}
        {/* Use styles */}
        <div className={styles.header}>
          {" "}
          {/* Use styles */}
          <h2 className={styles.title}>
            {" "}
            {/* Use styles */}
            {showOtp ? "Verify Email" : "Sign Up"}
          </h2>
          <button
            className={styles.closeButton} // Use styles
            onClick={closeModal} // Use correct helper
            aria-label="Close modal"
            disabled={loading || otpLoading}
          >
            <CloseIcon size={20} />
          </button>
        </div>
        {/* --- Signup Form View --- */}
        {!showOtp ? (
          <form
            className={styles.formContainer}
            onSubmit={handleSignup}
            noValidate
          >
            {" "}
            {/* Use styles */}
            {error && <p className={styles.errorText}>{error}</p>}{" "}
            {/* Use styles */}
            <input
              className={styles.inputField} // Use styles
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <input
              className={styles.inputField} // Use styles
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className={styles.passwordInputContainer}>
              {" "}
              {/* Use styles */}
              <input
                className={styles.inputField} // Use styles
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={styles.eyeButton} // Use styles
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "0.9rem",
                color: "#555",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="accept"
                checked={formData.accept}
                onChange={handleChange}
                required
                style={{
                  width: "16px",
                  height: "16px",
                  accentColor: "#4f46e5",
                }}
              />
              I agree to the Terms and Privacy Policies
            </label>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {" "}
              {/* Use styles */}
              {loading ? (
                <Loader2 size={18} className={styles.spinner} />
              ) : (
                "Create Account"
              )}
            </button>
            <div className={styles.divider}>
              {" "}
              {/* Use styles */}
              <span className={styles.dividerText}>or</span> {/* Use styles */}
            </div>
            <button
              type="button"
              className={styles.socialButton}
              onClick={signupWithGoogle}
              disabled={loading}
            >
              {" "}
              {/* Use styles */}
              <FcGoogle className={styles.socialIcon} /> Continue with Google{" "}
              {/* Use styles */}
            </button>
            <button
              type="button"
              className={styles.socialButton}
              onClick={signupWithTwitter}
              disabled={loading}
            >
              {" "}
              {/* Use styles */}
              <FaTwitter
                className={styles.socialIcon}
                style={{ color: "#1DA1F2" }}
              />{" "}
              Continue with Twitter {/* Use styles */}
            </button>
            <button
              type="button"
              className={styles.socialButton}
              onClick={signupWithFacebook}
              disabled={loading}
            >
              {" "}
              {/* Use styles */}
              <FaFacebook
                className={styles.socialIcon}
                style={{ color: "#1877F2" }}
              />{" "}
              Continue with Facebook {/* Use styles */}
            </button>
            <hr className={styles.horizontalDivider} /> {/* Use styles */}
            <div className={styles.loginPrompt}>
              {" "}
              {/* Use styles */}
              Already have an account?
              <button
                type="button"
                className={styles.loginLink} // Use styles
                onClick={openLoginModal} // Use correct helper
                disabled={loading}
              >
                Log In
              </button>
            </div>
          </form>
        ) : (
          /* --- OTP View --- */
          <div className={styles.otpSection}>
            {" "}
            {/* Use styles */}
            <p className={styles.subtext}>
              {" "}
              {/* Use styles */}
              Enter the 6-digit code sent to <strong>{formData.email}</strong>.
            </p>
            {otpError && (
              <p
                className={styles.errorText}
                style={{ textAlign: "center", marginTop: "0" }}
              >
                {otpError}
              </p>
            )}{" "}
            {/* Use styles */}
            <div className={styles.otpInputContainer} onPaste={handleOtpPaste}>
              {" "}
              {/* Use styles */}
              {otpArray.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  id={`otp-${index}`}
                  className={styles.otpInput} // Use styles
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  autoFocus={index === 0}
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>
            <button
              className={styles.submitButton} // Use styles
              onClick={verifyOtp}
              disabled={otpLoading || otpArray.join("").length !== 6} // Corrected: Use otpLoading
            >
              {/* Corrected: Use otpLoading for spinner */}
              {otpLoading ? (
                <Loader2 size={18} className={styles.spinner} />
              ) : (
                "Verify Account"
              )}
            </button>
            <div className={styles.resendContainer}>
              {" "}
              {/* Use styles */}
              Didn't receive code?
              <button
                onClick={resendOtp}
                className={styles.resendLink} // Use styles
                disabled={resendDisabled || loading} // Corrected: Use general loading for resend
              >
                {/* Corrected: Use general loading for spinner */}
                {loading && !resendDisabled ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : resendDisabled ? (
                  `Resend in ${formatTime(timer)}`
                ) : (
                  "Resend Code"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
