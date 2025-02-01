import React from "react";
import styles from "./Button.module.css"

const Button = ({text}) => {
    return (
        <div className={styles["header-btn"]}>
            <span>{text}</span>
        </div>
    )
}

export default Button;