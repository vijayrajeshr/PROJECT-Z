// import { useEffect, useState } from "react";
// import { createPortal } from "react-dom";

// import closeBtn from "/images/closeBtn.jpg";

// import css from "./EnterOTP.module.css";

// let EnterOTP = ({ setModal, setLoggedIn = () => {}, setAuth = () => {} }) => {
//   let [count, setCount] = useState(60);

//   const loginHandler = () => {
//     setModal(false);
//     setLoggedIn(true);
//     setAuth(false);
//     localStorage.setItem("auth", true);
//   };

//   useEffect(() => {
//     if (!count) return;

//     let interval = setInterval(() => {
//       if (count > 0) {
//         setCount((val) => val - 1);
//       }
//     }, [1000]);

//     return () => clearInterval(interval);
//   }, [count]);

//   const domObj = (
//     <div className={css.outerDiv}>
//       <div className={css.innerDiv}>
//         <div className={css.header}>
//           <div className={css.title}>Enter OTP</div>
//           <span className={css.closeBtn} onClick={() => setModal(false)}>
//             <img
//               className={css.closeBtnImg}
//               src={closeBtn}
//               alt="close button"
//             />
//           </span>
//         </div>
//         <div className={css.body}>
//           <div className={css.txt1}>OTP send successfully</div>
//           <div className={css.OTPBox}>
//             <div className={css.otpNumBox}>
//               <input
//                 className={css.inpBox}
//                 type="text"
//                 name=""
//                 id=""
//                 maxLength="1"
//                 defaultValue="2"
//               />
//             </div>
//             <div className={css.otpNumBox}>
//               <input
//                 className={css.inpBox}
//                 type="text"
//                 name=""
//                 id=""
//                 maxLength="1"
//                 defaultValue="2"
//               />
//             </div>
//             <div className={css.otpNumBox}>
//               <input
//                 className={css.inpBox}
//                 type="text"
//                 name=""
//                 id=""
//                 maxLength="1"
//                 defaultValue="2"
//               />
//             </div>
//             <div className={css.otpNumBox}>
//               <input
//                 className={css.inpBox}
//                 type="text"
//                 name=""
//                 id=""
//                 maxLength="1"
//                 defaultValue="2"
//               />
//             </div>
//             <div className={css.otpNumBox}>
//               <input
//                 className={css.inpBox}
//                 type="text"
//                 name=""
//                 id=""
//                 maxLength="1"
//                 defaultValue="2"
//               />
//             </div>
//             <div className={css.otpNumBox}>
//               <input
//                 className={css.inpBox}
//                 type="text"
//                 name=""
//                 id=""
//                 maxLength="1"
//                 defaultValue="2"
//               />
//             </div>
//           </div>
//           <div onClick={loginHandler} className={css.okBtn}>
//             OK
//           </div>
//           <div className={css.footerBox}>
//             <div className={css.time}>Time: {count}</div>
//             <div className={css.footerTxt}>
//               Didn't receive OTP?{" "}
//               <span className={css.resendTxt} onClick={() => setCount(60)}>
//                 Resend Now
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return createPortal(domObj, document.getElementById("modal"));
// };

// export default EnterOTP;


import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import axios from 'axios'; // Import Axios

import closeBtn from "/images/closeBtn.jpg";

import css from "./EnterOTP.module.css";

let EnterOTP = ({ setModal, emailToChange, onEmailChangeSuccess = () => {} }) => {
    const [count, setCount] = useState(60);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const inputRefs = useRef([]);
    const sendOtp = async () => {
        try {
            setMessage('Sending OTP...');
            setError('');
            const url = `${import.meta.env.VITE_SERVER_URL}/api/send-otp`;
            const response = await axios.post(url, { email: emailToChange }, { withCredentials: true });
            setMessage(response.data.message || 'OTP sent successfully!');
            setCount(60); // Reset timer on resend
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
            setMessage('');
            console.error("Error sending OTP:", err);
        }
    };
    const verifyOtp = async () => {
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6) {
            setError('Please enter a 6-digit OTP.');
            return;
        }

        try {
            setMessage('Verifying OTP...');
            setError('');
            const url = `${import.meta.env.VITE_SERVER_URL}/user/verify-otp`;
            const response = await axios.post(url, { email: emailToChange, otp: enteredOtp }, { withCredentials: true });

            if (response.status === 200) {
                setMessage(response.data.message || 'Email updated successfully!');
                onEmailChangeSuccess(emailToChange); 
                setTimeout(() => setModal(false), 1500);
            } else {
                setError(response.data.message || 'OTP verification failed.');
                setMessage('');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'OTP verification failed. Please try again.');
            setMessage('');
            console.error("Error verifying OTP:", err);
        }
    };

    useEffect(() => {
        if (count === 0) return;

        const interval = setInterval(() => {
            setCount((prevCount) => prevCount - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [count]);


    useEffect(() => {
        sendOtp();
    }, []);


    const handleOtpChange = (element, index) => {
        const value = element.value;
        if (/[^0-9]/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if a digit is entered and not the last field
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace to move focus to previous input
    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const domObj = (
        <div className={css.outerDiv}>
            <div className={css.innerDiv}>
                <div className={css.header}>
                    <div className={css.title}>Enter OTP</div>
                    <span className={css.closeBtn} onClick={() => setModal(false)}>
                        <img
                            className={css.closeBtnImg}
                            src={closeBtn}
                            alt="close button"
                        />
                    </span>
                </div>
                <div className={css.body}>
                    {message && <div className={css.message}>{message}</div>}
                    {error && <div className={css.error}>{error}</div>}
                    <div className={css.txt1}>OTP sent to {emailToChange}</div>
                    <div className={css.OTPBox}>
                        {otp.map((digit, index) => (
                            <div key={index} className={css.otpNumBox}>
                                <input
                                    className={css.inpBox}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                />
                            </div>
                        ))}
                    </div>
                    <div onClick={verifyOtp} className={css.okBtn}>
                        Verify
                    </div>
                    <div className={css.footerBox}>
                        <div className={css.time}>Time: {count}s</div>
                        <div className={css.footerTxt}>
                            Didn't receive OTP?{" "}
                            <span
                                className={css.resendTxt}
                                onClick={count === 0 ? sendOtp : null} // Only allow resend when count is 0
                                style={{ cursor: count === 0 ? 'pointer' : 'not-allowed', opacity: count === 0 ? 1 : 0.5 }}
                            >
                                Resend Now
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(domObj, document.getElementById("modal"));
};

export default EnterOTP;