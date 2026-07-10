import React from 'react';

const CustomModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-10 flex items-center justify-center animate-fade-in-overlay">
      <div className="bg-white rounded-xl shadow-2xl p-0 max-w-lg w-11/12 max-h-[90vh] overflow-y-auto animate-fade-in-content relative">
        {children}
      </div>
    </div>
  );
};

export default CustomModal;
