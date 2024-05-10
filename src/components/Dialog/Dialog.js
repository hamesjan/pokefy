import React, { useState } from "react";

const DialogBox = (isActive) => {
  const divStyle = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1000,
    width: "300px",
    height: "300px",
    backgroundColor: "lightblue",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div style={divStyle}>
      <p>Hello</p>
    </div>
  );
};

export default DialogBox;
