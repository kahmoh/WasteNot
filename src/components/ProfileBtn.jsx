"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "../../styles/ProfileBtn.module.css";

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
      <Image src={menuImage} alt="Hamburger Menu" width={30} height={30} />
      <Image src={profileImage} alt="Profile Circle" width={30} height={30} />
    </div>
  );
};

export default ProfileBtn;
