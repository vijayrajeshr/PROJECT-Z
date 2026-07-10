// import { useState } from 'react';
// import { createPortal } from 'react-dom'
// import SelectCoverModal from '../SelectCoverModal/SelectCoverModal'

// import { Formik, Field, Form, ErrorMessage } from 'formik';
// import * as Yup from 'yup';

// import css from './EditProfileModal.module.css'

// import closeBtn from '/images/closeBtn.jpg';
// import cameraIcon from '/icons/photo-camera.png';
// import bgImg from '/images/profilebanner.jpg'
// import profilePic from '/images/profilepic.jpg'

// import RedBtnHov from '../../utils/Buttons/RedBtnHov/RedBtnHov' 
// import WhiteBtnHov from '../../utils/Buttons/WhiteBtnHov/WhiteBtnHov' 
// import TextUtil from '../../utils/FormUtils/TextUtil/TextUtil'
// import TextUtilWithCancel from '../../utils/FormUtils/TextUtilWithCancel/TextUtilWithCancel'
// import EnterOTP from '../../components/Auth/EnterOTP/EnterOTP'

// const EditProfileModal = ({setModal, setProfilePhoto, setUserName, currentPhoto, currentName, setCoverPhoto, currentCover}) => {
//     let [dropdown, setDropDown] = useState(false);
//     const [showCoverModal, setShowCoverModal] = useState(false);
//     const [coverImage, setCoverImage] = useState(currentCover || bgImg);
//     let [changeMailModal, setChangeMailModal] = useState(false);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [profileImage, setProfileImage] = useState(currentPhoto || profilePic);
    
//     let [initialValues, setInitialValues] = useState({ 
//         fullName: currentName || '',
//         phone: '',
//         email: '',
//         address: '',
//         description: "",
//         handle:"",
//         website:"",
//         dateOfBirth: '',
//         anniversary: '', // Add this line
//         gender: ''
//     })

//     let validationSchema = Yup.object({
//         fullName: Yup.string().min(3, "Minimum 3 charecters required!"),
//         phone: Yup.string().min(10, "Minimum 3 charecters required!").min(10, "Enter valid phone number!").max(10, "Enter valid phone number!"),
//         email: Yup.string().email("Enter correct email address!"),
//         address: Yup.string().min(5, "Minimum 5 charecters required!"),
//         description:Yup.string().min(5, "Minimum 5 charecters required!").max(150, "Maximum 150 charecters only!"),
//         handle: Yup.string().min(5, "Minimum 5 charecters required!"),
//         website:Yup.string().url("Provide correct URL!"),
//         dateOfBirth: Yup.date().required("Date of birth is required"),
//         anniversary: Yup.date(), // Add this line - optional field
//         gender: Yup.string().required("Gender is required"),
//     })

//     const handleFileSelect = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             setSelectedFile(file);
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setProfileImage(reader.result);
//                 setDropDown(false); // Hide dropdown after photo selection
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleDeletePhoto = () => {
//         setProfileImage(profilePic); // Reset to default profile pic
//         setSelectedFile(null);
//         setDropDown(false);
//     };

//     const handleCoverSelect = (selectedCoverImage) => {
//         setCoverImage(selectedCoverImage);
//         if (setCoverPhoto) {
//             setCoverPhoto(selectedCoverImage);
//             // Store the selected cover image in localStorage
//             localStorage.setItem('userCoverImage', selectedCoverImage);
//         }
//     };

//     const handleProfilePhotoUpdate = (newPhotoUrl) => {
//         localStorage.setItem('userProfilePhoto', newPhotoUrl);
//         // Dispatch the custom event to notify NavigationBar
//         window.dispatchEvent(profilePhotoUpdateEvent);
//     };

//     let submitForm = (values, { setSubmitting }) => {
//         const formData = {
//             ...values,
//             profileImage: profileImage
//         };
        
//         // Update parent component
//         setProfilePhoto(profileImage);
//         setUserName(values.fullName);
        
//         // Close modal
//         setModal(false);
//         setSubmitting(false);
//     }

//     const updateUser = (formik) => {
//         if (formik.isValid) {
//             submitForm(formik.values, { setSubmitting: () => {} });
//         } else {
//             formik.submitForm(); // This will trigger validation
//         }
//     }

//     const mailCahngeHandler = () => {
//         setChangeMailModal(val => !val);
//     }

//   const domObj = <><div className={css.outerDiv}>
//         <div className={css.innerDiv}>
//             <div className={css.header}>
//                 <div className={css.headerLeft}>
//                     <div className={css.title}>Edit Profile</div>
//                 </div>
//                 <span className={css.closeBtn} onClick={() => setModal(val => !val)}>
//                     <img className={css.closeBtnImg} src={closeBtn} alt="close button" />
//                 </span>
//             </div>
//             <div className={css.banner}>
//                 <div className={css.BGImgBox}>
//                     <img src={coverImage} className={css.bgImg} />
//                     <div className={css.coverCameraBox} onClick={() => setShowCoverModal(true)}>
//                         <div className={css.bgCssImg}>
//                             <img src={cameraIcon} className={css.cameraIcon} />
//                         </div>
//                     </div>
//                 </div>
//                 <div className={css.overlayImg}>
//                     <div className={css.profilePicBox}>
//                         <img src={profileImage || profilePic} className={css.profilePic} alt="Profile" />
//                     </div>
//                     <div className={css.cameraIconBox}>
//                         <div className={css.bgCssImg} onClick={() => !selectedFile && setDropDown(val => !val)}>
//                             <img src={cameraIcon} className={css.cameraIcon} />
//                         </div>
//                         {dropdown && !selectedFile ? <div className={css.dropdownCam}>
//                             <label className={css.opt} htmlFor="photoInput">Change Photo</label>
//                             <input
//                                 type="file"
//                                 id="photoInput"
//                                 accept="image/*"
//                                 onChange={handleFileSelect}
//                                 style={{ display: 'none' }}
//                             />
//                             <div className={css.opt} onClick={handleDeletePhoto}>Delete Photo</div>
//                         </div> : "" }
//                     </div>

//                 </div>
//             </div>
//             <div className={css.bdy}>
//                 <Formik
//                     initialValues={initialValues}
//                     validationSchema={validationSchema}
//                     onSubmit={submitForm}
//                     className={css.formikForm}
//                 >{(formik) => {
//                     return <Form className={css.form}>
//                         <TextUtil name="fullName" placeholder="Enter name"/>
//                         <TextUtil name="phone" placeholder="Enter phone number" disabled/>
//                         <span className={css.formTxt}>You can update your phone number using the Zomato app</span>
                        
//                         <TextUtil 
//                             name="dateOfBirth" 
//                             type="date" 
//                             placeholder="Date of Birth"
//                         />
                        
//                         <TextUtil 
//                             name="gender" 
//                             as="select" 
//                             placeholder="Select Gender"
//                         >
//                             <option value="">Select Gender</option>
//                             <option value="male">Male</option>
//                             <option value="female">Female</option>
//                             <option value="other">Other</option>
//                         </TextUtil>
//                         <TextUtil 
//                             name="anniversary" 
//                             type="date" 
//                             placeholder="Anniversary"
//                         />
//                         <TextUtilWithCancel txt="Change" name="email" placeholder="sample@sample.com" formik="" changeHandler={mailCahngeHandler} disabled/>
//                         <TextUtil name="address" placeholder="Enter address"/>
//                         <TextUtil name="description" placeholder="Description"/>
//                         <span className={css.formTxt}>Tell us something about yourself ({150 -formik.values.description.length} characters remaining)</span>
//                         <TextUtil name="handle" placeholder="Handle"/>
//                         <span className={css.formTxt}>You can only change your handle once</span>
//                         <TextUtil name="website" placeholder="Website"/>
//                         <div className={css.btnContainer}>
//                             <div className={css.btnBox}>
//                                 <WhiteBtnHov txt="Cancel" onClick={() => setModal(val => !val)} />
//                                 <RedBtnHov txt="Update" onClick={() => updateUser(formik)} />
//                             </div>
//                         </div>
//                     </Form>
//                 }}
//                 </Formik>
//             </div>
//         </div>
//     </div>
//     {changeMailModal ? <EnterOTP setModal={setChangeMailModal} /> : "" }
//     {showCoverModal && <SelectCoverModal setModal={setShowCoverModal} onSelectCover={handleCoverSelect} />}
//     </>

//   return createPortal(domObj, document.getElementById('modal'));
// }

// export default EditProfileModal

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import SelectCoverModal from '../SelectCoverModal/SelectCoverModal';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'; // Import Axios

import css from './EditProfileModal.module.css';

import closeBtn from '/images/closeBtn.jpg';
import cameraIcon from '/icons/photo-camera.png';
import bgImg from '/images/profilebanner.jpg';
import profilePic from '/images/profilepic.jpg';

import RedBtnHov from '../../utils/Buttons/RedBtnHov/RedBtnHov';
import WhiteBtnHov from '../../utils/Buttons/WhiteBtnHov/WhiteBtnHov';
import TextUtil from '../../utils/FormUtils/TextUtil/TextUtil';
import TextUtilWithCancel from '../../utils/FormUtils/TextUtilWithCancel/TextUtilWithCancel';
import EnterOTP from '../../components/Auth/EnterOTP/EnterOTP';

const EditProfileModal = ({ setModal, setProfilePhoto, setUserName, currentPhoto, currentName, setCoverPhoto, currentCover }) => {
    const [dropdown, setDropDown] = useState(false);
    const [showCoverModal, setShowCoverModal] = useState(false);
    const [coverImage, setCoverImage] = useState(currentCover || bgImg);
    const [changeMailModal, setChangeMailModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [profileImage, setProfileImage] = useState(currentPhoto || profilePic);

    const [initialValues, setInitialValues] = useState({
        fullName: currentName || '',
        phone: '',
        email: '',
        address: '',
        description: '',
        handle: '',
        website: '',
        dateOfBirth: '',
        anniversary: '',
        gender: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const url = `${import.meta.env.VITE_SERVER_URL}/user/profileData`;
                const response = await axios.get(url, { withCredentials: true }); // Use axios.get
                const userData = response.data.user; // Axios puts data in .data

                setInitialValues({
                    fullName: userData?.username || '',
                    phone: userData?.phone || '',
                    email: userData?.email || '',
                    address: userData?.address || '',
                    description: userData?.description || '',
                    handle: userData?.handle || '',
                    website: userData?.website || '',
                    dateOfBirth: userData?.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
                    anniversary: userData?.anniversary ? new Date(userData.anniversary).toISOString().split('T')[0] : '',
                    gender: userData?.gender || ''
                });
            } catch (error) {
                console.error('Failed to fetch user data:', error.response?.data?.message || error.message);
            }
        };

        fetchUserData();
    }, []);

    const validationSchema = Yup.object({
        fullName: Yup.string().min(3, "Minimum 3 characters required!"),
        phone: Yup.string().matches(/^\d{10}$/, "Enter a valid 10-digit phone number!").nullable(),
        email: Yup.string().email("Enter a correct email address!").nullable(),
        address: Yup.string().min(5, "Minimum 5 characters required!").nullable(),
        description: Yup.string().min(5, "Minimum 5 characters required!").max(150, "Maximum 150 characters only!").nullable(),
        handle: Yup.string().min(5, "Minimum 5 characters required!").nullable(),
        website: Yup.string().url("Provide a correct URL!").nullable(),
        dateOfBirth: Yup.date().nullable(),
        anniversary: Yup.date().nullable(),
        gender: Yup.string().nullable(),
    });

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                setDropDown(false);
                setProfilePhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeletePhoto = () => {
        setProfileImage(profilePic);
        setSelectedFile(null);
        setDropDown(false);
        setProfilePhoto(profilePic);
    };

    const handleCoverSelect = (selectedCoverImage) => {
        setCoverImage(selectedCoverImage);
        if (setCoverPhoto) {
            setCoverPhoto(selectedCoverImage);
        }
    };

    const submitForm = async (values, { setSubmitting }) => {
        try {
            const dateOfBirth = values.dateOfBirth ? new Date(values.dateOfBirth).toISOString() : null;
            const anniversary = values.anniversary ? new Date(values.anniversary).toISOString() : null;

            const payload = {
                username: values.fullName,
                dateOfBirth,
                gender: values.gender,
                anniversary,
                address: values.address,
                description: values.description,
                handle: values.handle,
                website: values.website,
            };
            const url = `${import.meta.env.VITE_SERVER_URL}/user/profileEdit`;
            const response = await axios.post(url, payload, { // Use axios.put
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            console.log('Profile updated successfully:', response.data.message);
            setUserName(values.fullName);
            setModal(false);
        } catch (error) {
            console.error('Failed to update profile:', error.response?.data?.message || error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const updateUser = (formik) => {
        formik.submitForm();
    };

    const mailCahngeHandler = () => {
        setChangeMailModal(val => !val);
    };
     const handleEmailChangeSuccess = (newEmail) => {
        setInitialValues(prev => ({ ...prev, email: newEmail }));
        setChangeMailModal(false);
    };
    const domObj = (
        <>
            <div className={css.outerDiv}>
                <div className={css.innerDiv}>
                    <div className={css.header}>
                        <div className={css.headerLeft}>
                            <div className={css.title}>Edit Profile</div>
                        </div>
                        <span className={css.closeBtn} onClick={() => setModal((val) => !val)}>
                            <img className={css.closeBtnImg} src={closeBtn} alt="close button" />
                        </span>
                    </div>
                    <div className={css.banner}>
                        <div className={css.BGImgBox}>
                            <img src={coverImage} className={css.bgImg} alt="Cover" />
                            <div className={css.coverCameraBox} onClick={() => setShowCoverModal(true)}>
                                <div className={css.bgCssImg}>
                                    <img src={cameraIcon} className={css.cameraIcon} alt="Camera Icon" />
                                </div>
                            </div>
                        </div>
                        <div className={css.overlayImg}>
                            <div className={css.profilePicBox}>
                                <img src={profileImage || profilePic} className={css.profilePic} alt="Profile" />
                            </div>
                            <div className={css.cameraIconBox}>
                                <div className={css.bgCssImg} onClick={() => !selectedFile && setDropDown((val) => !val)}>
                                    <img src={cameraIcon} className={css.cameraIcon} alt="Camera Icon" />
                                </div>
                                {dropdown && !selectedFile ? (
                                    <div className={css.dropdownCam}>
                                        <label className={css.opt} htmlFor="photoInput">
                                            Change Photo
                                        </label>
                                        <input
                                            type="file"
                                            id="photoInput"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            style={{ display: 'none' }}
                                        />
                                        <div className={css.opt} onClick={handleDeletePhoto}>
                                            Delete Photo
                                        </div>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={css.bdy}>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={submitForm}
                            enableReinitialize={true}
                            className={css.formikForm}
                        >
                            {(formik) => {
                                const descriptionLength = formik.values.description ? formik.values.description.length : 0;
                                return (
                                    <Form className={css.form}>
                                        <TextUtil name="fullName" placeholder="Enter name" />
                                        <TextUtil name="phone" placeholder="Enter phone number" disabled />
                                        <span className={css.formTxt}>You can update your phone number using the Zomato app</span>
                                        <TextUtil name="dateOfBirth" type="date" placeholder="Date of Birth" />
                                        <TextUtil name="gender" as="select" placeholder="Select Gender">
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </TextUtil>
                                        <TextUtil name="anniversary" type="date" placeholder="Anniversary" />
                                        <TextUtilWithCancel
                                            txt="Change"
                                            name="email"
                                            placeholder="sample@sample.com"
                                            formik={formik} // Pass formik prop for better control if needed in TextUtilWithCancel
                                            value={formik.values.email} // Ensure this is tied to Formik's state
                                            changeHandler={mailCahngeHandler}
                                            disabled
                                        />
                                        <TextUtil name="address" placeholder="Enter address" />
                                        <TextUtil name="description" placeholder="Description" />
                                        <span className={css.formTxt}>
                                            Tell us something about yourself ({150 - descriptionLength} characters remaining)
                                        </span>
                                        <TextUtil name="handle" placeholder="Handle" />
                                        <span className={css.formTxt}>You can only change your handle once</span>
                                        <TextUtil name="website" placeholder="Website" />
                                        <div className={css.btnContainer}>
                                            <div className={css.btnBox}>
                                                <WhiteBtnHov txt="Cancel" onClick={() => setModal((val) => !val)} />
                                                <RedBtnHov txt="Update" onClick={() => updateUser(formik)} />
                                            </div>
                                        </div>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                </div>
            </div>
            {changeMailModal && (
                <EnterOTP
                    setModal={setChangeMailModal}
                    emailToChange={initialValues.email} // Pass the current email from Formik state
                    onEmailChangeSuccess={handleEmailChangeSuccess}
                />
            )}
            {showCoverModal && <SelectCoverModal setModal={setShowCoverModal} onSelectCover={handleCoverSelect} />}
        </>
    );

    return createPortal(domObj, document.getElementById('modal'));
};

export default EditProfileModal;