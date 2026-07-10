import React from "react";
import css from "./NotificationSettingsUtil.module.css";

const NotificationSettingsUtil = ({ txt, tag, push, email, onToggle }) => {
    return (
        <div className={css.settingRow}>
            <div className={css.settingInfo}>
                <div className={css.settingTitle}>{txt}</div>
                <div className={css.settingDescription}>{tag}</div>
            </div>
            <div className={css.settingControls}>
                {/* Push Notification Toggle */}
                <label className={css.switchLabel}>
                    <input type="checkbox" checked={push} onChange={() => onToggle("push")} className={css.toggleInput} />
                    <span className={css.toggleSlider}></span>
                </label>

                {/* Email Notification Toggle */}
                {email !== undefined && (
                    <label className={css.switchLabel}>
                        <input type="checkbox" checked={email} onChange={() => onToggle("email")} className={css.toggleInput} />
                        <span className={css.toggleSlider}></span>
                    </label>
                )}
            </div>
        </div>
    );
};

export default NotificationSettingsUtil;
