import React, { useState } from "react";
import css from "./UserSettingsPage.module.css";

import Navbar from "../../components/Navbars/NavigationBar2/NavigationBar2";
import GrayBtn from "../../utils/Buttons/GrayBtn/GrayBtn";
import Footer from "../../components/Footer/Footer";
import NotificationSettingsUtil from "../../utils/UserProfileUtils/NotificationSettingsUtil/NotificationSettingsUtil";

const UserSettingsPage = () => {
    // Sidebar Navigation State
    const [activeTab, setActiveTab] = useState("Notification Preferences");

    // Sidebar Menu Items
    const sidebarOptions = ["Notification Preferences", "Privacy & Security"];

    // Notification Settings State
    const [notificationSettings, setNotificationSettings] = useState([
        {
            txt: "Enable all",
            tag: "Activate all notifications",
            push: false,
            email: false,
        },
        {
            txt: "Newsletters",
            tag: "Receive newsletters to stay up-to-date with what's brewing in the food industry",
            push: false,
            email: false,
        },
        {
            txt: "Promos and offers",
            tag: "Receive updates about coupons, promotions, and money-saving offers",
            push: false,
            email: false,
        },
        {
            txt: "Social notifications",
            tag: "Get notified when someone follows your profile or when you get likes and comments on reviews and photos",
            push: false,
            email: false,
        },
        {
            txt: "Orders and purchases",
            tag: "Receive updates related to your order status, memberships, table bookings, and more",
            push: false,
            email: false,
        },
        {
            txt: "Important updates",
            tag: "Receive important updates related to your account",
            push: false,
            email: false,
        },
    ]);

    // Privacy & Security State
    const [privacySettings, setPrivacySettings] = useState({
        profilePrivate: false,
        hideReviews: false,
        twoFactorAuth: false,
    });

    // Handle Toggle for Notifications
    const handleToggle = (index, type) => {
        setNotificationSettings((prevSettings) =>
            prevSettings.map((item, i) =>
                i === index ? { ...item, [type]: !item[type] } : item
            )
        );
    };

    // Handle Privacy & Security Toggle
    const handlePrivacyToggle = (setting) => {
        setPrivacySettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
    };

    // Save Preferences
    const handleSave = () => {
        console.log("Updated Notification Preferences:", notificationSettings);
        console.log("Updated Privacy Settings:", privacySettings);
        // Add API call if needed
    };

    // Responsive Sidebar Toggle
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={css.outerDiv}>
            <Navbar />

            <div className={css.innerDiv}>
                {/* Sidebar Toggle for Mobile */}
                <button className={css.menuBtn} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    ☰ Menu
                </button>

                {/* Sidebar */}
                <div className={`${css.sidebar} ${isSidebarOpen ? css.open : ""}`}>
                    <ul>
                        {sidebarOptions.map((option) => (
                            <li
                                key={option}
                                className={activeTab === option ? css.active : ""}
                                onClick={() => {
                                    setActiveTab(option);
                                    setIsSidebarOpen(false); // Close sidebar on selection (for mobile)
                                }}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Main Content */}
                <div className={css.bdy}>
                    {/* Notification Preferences Section */}
                    {activeTab === "Notification Preferences" && (
                        <>
                            <div className={css.header}>
                                <div className={css.LHeader}>
                                    <div className={css.ttl}>Notification Preferences</div>
                                    <div className={css.tag}>
                                        Receive updates related to order status, promo codes, and more.
                                    </div>
                                </div>
                                <div className={css.RHeader}>
                                    <GrayBtn txt="Save" onClick={handleSave} />
                                </div>
                            </div>

                            <div className={css.settingsBdy}>
                                <div className={css.settingsHeader}>
                                    <div className={css.notificationType}>Notification Type</div>
                                    <div className={css.toggleHeaders}>
                                        <div className={css.toggleHeader}>Push</div>
                                        <div className={css.toggleHeader}>Email</div>
                                    </div>
                                </div>

                                {notificationSettings.map((item, index) => (
                                    <div key={index}>
                                        <NotificationSettingsUtil
                                            txt={item.txt}
                                            tag={item.tag}
                                            push={item.push}
                                            email={item.email}
                                            onToggle={(type) => handleToggle(index, type)}
                                        />
                                        {index !== notificationSettings.length - 1 && <hr className={css.hr} />}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Privacy & Security Section */}
                    {activeTab === "Privacy & Security" && (
                        <div className={css.privacySecurity}>
                            <div className={css.header}>
                                <div className={css.LHeader}>
                                    <div className={css.ttl}>Privacy & Security</div>
                                    <div className={css.tag}>Manage your privacy and security settings.</div>
                                </div>
                            </div>

                            <div className={css.settingsBdy}>
                                <div className={css.section}>
                                    <h3>Privacy Settings</h3>
                                    <label className={css.toggleOption}>
                                        <input
                                            type="checkbox"
                                            checked={privacySettings.profilePrivate}
                                            onChange={() => handlePrivacyToggle("profilePrivate")}
                                        />
                                        Make my profile private
                                    </label>
                                    <label className={css.toggleOption}>
                                        <input
                                            type="checkbox"
                                            checked={privacySettings.hideReviews}
                                            onChange={() => handlePrivacyToggle("hideReviews")}
                                        />
                                        Hide my reviews from public
                                    </label>
                                </div>

                                <div className={css.section}>
                                    <h3>Security</h3>
                                    <label className={css.toggleOption}>
                                        <input
                                            type="checkbox"
                                            checked={privacySettings.twoFactorAuth}
                                            onChange={() => handlePrivacyToggle("twoFactorAuth")}
                                        />
                                        Enable Two-Factor Authentication
                                    </label>
                                </div>

                                <div className={css.section}>
                                    <h3>Danger Zone</h3>
                                    <button className={css.deleteBtn} onClick={() => alert("Account deletion process initiated!")}>
                                        Delete My Account
                                    </button>
                                    <p className={css.warningText}>This action is irreversible!</p>
                                </div>

                                <GrayBtn txt="Save Changes" onClick={handleSave} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default UserSettingsPage;
