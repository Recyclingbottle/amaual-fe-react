// src/components/FormGroup.js
import React from "react";
import styles from "./FormGroup.module.css";

const FormGroup = ({ label, children, helperText }) => (
  <div className={styles.formGroup}>
    <label className={styles.formGroupLabel}>{label}</label>
    {children}
    {helperText && <p className={styles.helperText}>{helperText}</p>}
  </div>
);

export default FormGroup;
