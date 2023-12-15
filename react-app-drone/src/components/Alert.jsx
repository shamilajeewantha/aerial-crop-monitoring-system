import React from "react";

const Alert = ({ children, onClose }) => {
  return (
    <div className="alert alert-primary alert-dismissible fade show" role="alert">
      {children}
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={onClose}
      ></button>
    </div>
  );
};

export default Alert;
