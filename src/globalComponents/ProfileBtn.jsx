
import React, { useState } from "react";
import styles from "../messages/styles/ProfileBtn.module.css";

const ProfileBtn = () => {  
  const [menuImage, setMenuImage] = useState("/hamburger_menu.png");
  const [profileImage, setProfileImage] = useState("/profile_circle.png");

  return (
    <div
      className={styles["profile-btn"]}
      // Switches to the hovered versions of the icons when hovered
      onMouseEnter={() => {
        setMenuImage("/hamburger_hover.png");
        setProfileImage("/profile_circle_hover.png");
      }}
      // Switches back to the default versions of the icons when mouse is moved away
      onMouseLeave={() => {
        setMenuImage("/hamburger_menu.png");
        setProfileImage("/profile_circle.png");
      }}
    >
      <img src={menuImage} alt="Hamburger Menu" width={20} height={20} />
      <img src={profileImage} alt="Profile Circle" width={20} height={20} />
    </div>
  );
};

export default ProfileBtn;
