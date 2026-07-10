import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { Eye, EyeOff, Loader2, X as CloseIcon } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaTwitter } from "react-icons/fa";

const Login = ({ setAuth }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpArray, setOtpArray] = useState(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const otpLength = 6;
  const otpRefs = useRef([]);
  const navigate = useNavigate();

  const closeModal = () => {
    setAuth({ closed: true, login: false, signup: false });
    setFormData({ email: "", password: "" });
    setShowPassword(false);
    setError("");
    setRememberMe(false);
    setShowOtp(false);
    setOtpArray(Array(6).fill(""));
    setOtpError("");
    setTimer(60);
    setResendDisabled(true);
    setIsOtpVerified(false);
    setNewPassword("");
    setConfirmPassword("");
    setLoading(false);
    setOtpLoading(false);
    setResetLoading(false);
  };

  const openSignupModal = () => {
    setAuth({ closed: false, login: false, signup: true });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    clearError();
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/login`,
        { ...formData, rememberMe },
        { withCredentials: true }
      );
      alert("Login Successful!");
      closeModal();
      window.location.reload();
    } catch (err) {
      setError(
        err.response?.data?.error || "Login failed. Invalid credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    clearError();
    if (!formData.email) {
      setError("Please enter your email to reset password.");
      return;
    }
    setOtpLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/send-email-otp`,
        { email: formData.email },
        { withCredentials: true }
      );
      setShowOtp(true);
      setTimer(300);
      setResendDisabled(true);
      setOtpArray(Array(6).fill(""));
      setIsOtpVerified(false);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to send OTP. Please try again."
      );
    } finally {
      setOtpLoading(false);
    }
  };

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

  const verifyOtp = async () => {
    const enteredOtp = otpArray.join("");
    if (enteredOtp.length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP.");
      return;
    }
    setOtpLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/verify-otp`,
        { identifier: formData.email, otp: Number(enteredOtp) },
        { withCredentials: true }
      );
      setIsOtpVerified(true);
      setShowOtp(false);
      setOtpError("");
    } catch (err) {
      setOtpError(
        err.response?.data?.error || "Invalid OTP. Please try again."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendDisabled) return;
    setOtpLoading(true);
    setOtpError("");
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/send-email-otp`,
        { email: formData.email },
        { withCredentials: true }
      );
      setTimer(300);
      setResendDisabled(true);
      setOtpArray(Array(6).fill(""));
      otpRefs.current[0]?.focus();
    } catch (err) {
      setOtpError(
        err.response?.data?.error || "Failed to resend OTP. Try again later."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    clearError();
    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setResetLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/reset-password`,
        { email: formData.email, newPassword },
        { withCredentials: true }
      );
      alert("Password reset successfully!");
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password.");
    } finally {
      setResetLoading(false);
    }
  };

  const LoginWithGoogle = () => {
    window.location.href = `${
      import.meta.env.VITE_SERVER_URL
    }/api/google?rememberMe=${rememberMe}`;
  };
  const LoginWithFacebook = () => {
    window.location.href = `${
      import.meta.env.VITE_SERVER_URL
    }/api/facebook?rememberMe=${rememberMe}`;
  };
  const LoginWithTwitter = () => {
    window.location.href = `${
      import.meta.env.VITE_SERVER_URL
    }/api/twitter?rememberMe=${rememberMe}`;
  };

  let currentView = "login";
  if (showOtp) {
    currentView = "otp";
  } else if (isOtpVerified) {
    currentView = "resetPassword";
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {currentView === "login" && "Login"}
            {currentView === "otp" && "Verify Email"}
            {currentView === "resetPassword" && "Reset Password"}
          </h2>
          <button
            className={styles.closeButton}
            onClick={closeModal}
            aria-label="Close modal"
            disabled={loading || otpLoading || resetLoading}
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {currentView === "login" && (
          <form
            className={styles.formContainer}
            onSubmit={handleLogin}
            noValidate
          >
            {error && <p className={styles.errorText}>{error}</p>}

            <input
              className={styles.inputField}
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className={styles.passwordInputContainer}>
              <input
                className={styles.inputField}
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
                className={styles.eyeButton}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className={styles.optionsRow}>
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
              <button
                type="button"
                className={styles.forgotPasswordLink}
                onClick={handleForgotPassword}
                disabled={loading || otpLoading}
              >
                {otpLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Forgot password?"
                )}
              </button>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={18} className={styles.spinner} />
              ) : (
                "Log In"
              )}
            </button>

            <div className={styles.divider}>
              <span className={styles.dividerText}>or</span>
            </div>

            <button
              type="button"
              className={styles.socialButton}
              onClick={LoginWithGoogle}
              disabled={loading}
            >
              <FcGoogle className={styles.socialIcon} /> Continue with Google
            </button>
            <button
              type="button"
              className={styles.socialButton}
              onClick={LoginWithTwitter}
              disabled={loading}
            >
              <FaTwitter
                className={styles.socialIcon}
                style={{ color: "#1DA1F2" }}
              />{" "}
              Continue with Twitter
            </button>
            <button
              type="button"
              className={styles.socialButton}
              onClick={LoginWithFacebook}
              disabled={loading}
            >
              <FaFacebook
                className={styles.socialIcon}
                style={{ color: "#1877F2" }}
              />{" "}
              Continue with Facebook
            </button>

            <hr className={styles.horizontalDivider} />

            <div className={styles.signupPrompt}>
              New here?
              <button
                type="button"
                className={styles.signupLink}
                onClick={openSignupModal}
                disabled={loading}
              >
                Create Account
              </button>
            </div>
          </form>
        )}

        {currentView === "otp" && (
          <div className={styles.otpSection}>
            <p className={styles.subtext}>
              Enter the 6-digit code sent to <strong>{formData.email}</strong>.
            </p>

            {otpError && (
              <p
                className={styles.errorText}
                style={{ textAlign: "center", marginTop: "0" }}
              >
                {otpError}
              </p>
            )}

            <div className={styles.otpInputContainer} onPaste={handleOtpPaste}>
              {otpArray.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  id={`otp-${index}`}
                  className={styles.otpInput}
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
              className={styles.submitButton}
              onClick={verifyOtp}
              disabled={otpLoading || otpArray.join("").length !== 6}
            >
              {otpLoading ? (
                <Loader2 size={18} className={styles.spinner} />
              ) : (
                "Verify Code"
              )}
            </button>

            <div className={styles.resendContainer}>
              Didn't receive code?
              <button
                onClick={resendOtp}
                className={styles.resendLink}
                disabled={resendDisabled || otpLoading}
              >
                {otpLoading && !resendDisabled ? (
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

        {currentView === "resetPassword" && (
          <form
            className={styles.resetPasswordSection}
            onSubmit={resetPassword}
            noValidate
          >
            <p className={styles.subtext}>Create a new secure password.</p>

            {error && <p className={styles.errorText}>{error}</p>}

            <div className={styles.passwordInputContainer}>
              <input
                className={styles.inputField}
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  clearError();
                }}
                required
              />
            </div>

            <div className={styles.passwordInputContainer}>
              <input
                className={styles.inputField}
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError();
                }}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={resetLoading}
            >
              {resetLoading ? (
                <Loader2 size={18} className={styles.spinner} />
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
