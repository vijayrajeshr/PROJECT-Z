import React, { useState } from 'react';
import styles from './Security.module.css';

const Security = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginActivity, setLoginActivity] = useState([
    { id: 1, device: 'iPhone 12', location: 'New York, USA', date: '2023-10-01 14:30' },
    { id: 2, device: 'MacBook Pro', location: 'San Francisco, USA', date: '2023-10-02 09:15' },
  ]);

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    // Add logic to change password
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const toggleTwoFactorAuth = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    // Add logic to enable/disable 2FA
    alert(`Two-factor authentication ${twoFactorEnabled ? 'disabled' : 'enabled'}.`);
  };

  return (
    <div className={styles.securityContainer}>
      <h1 className={styles.title}>Security Settings</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Change Password</h2>
        <form onSubmit={handlePasswordChange} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>Change Password</button>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Two-Factor Authentication</h2>
        <div className={styles.toggleContainer}>
          <span>Enable Two-Factor Authentication</span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={toggleTwoFactorAuth}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Login Activity</h2>
        <div className={styles.loginActivity}>
          {loginActivity.map((activity) => (
            <div key={activity.id} className={styles.activityItem}>
              <span>{activity.device}</span>
              <span>{activity.location}</span>
              <span>{activity.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Security;