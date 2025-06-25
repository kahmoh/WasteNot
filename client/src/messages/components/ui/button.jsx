"use client";
import React from "react";
import styles from "../../styles/Button.module.css";

// Takes in props:
// text: displayed in button
// isActive: boolean indicating whether user is on current page indicated by the button
// onClick: navigates user to desired page when clicked
const Button = ({ text, isActive, onClick }) => {
  return (
    <div
      className={`${styles["header-btn"]} ${isActive ? styles["active"] : ""}`}
      onClick={onClick}
    >
      <span>{text}</span>
    </div>
  );
};

export default Button;
