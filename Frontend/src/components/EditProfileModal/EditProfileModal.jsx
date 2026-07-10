const handleProfilePhotoUpdate = async (newPhotoUrl) => {
  try {
    // Save to localStorage
    localStorage.setItem('userProfilePhoto', newPhotoUrl);
    
    // Dispatch the custom event to trigger immediate update
    window.dispatchEvent(new CustomEvent('profilePhotoUpdate'));
    
    // Update backend if needed
    // ...your API call code...
    
  } catch (error) {
    console.error('Error updating profile photo:', error);
  }
};