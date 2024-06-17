// src/components/Button.js
import React from "react";
import styles from "./Button.module.css";

const Button = ({ onClick, children, disabled, type }) => (
  <button
    className={styles.button}
    onClick={onClick}
    disabled={disabled}
    type={type}
  >
    {children}
  </button>
);

export default Button;
