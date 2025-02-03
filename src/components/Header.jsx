"use client";
import Button from "./ui/button";
import styles from "../../styles/Header.module.css";
import ProfileBtn from "./ProfileBtn";
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
  // Used for navigating pages
  const router = useRouter();
  // Tracks the current page that the user is on
  const pathname = usePathname();

  return (
    <div className={styles["header-container"]}>
      {/* Logo on the top left */}
      <div className={styles["logo"]}>WasteNot</div>
      {/* Container for the "Map" and "Messages" buttons on the top center */}
      <div className={styles["navigation-btn-container"]}>
        {/* Button is highlighted based on user's current page */}
        <Button
          text="Map"
          isActive={pathname == "/"}
          onClick={() => router.push("/")}
        />
        <Button
          text="Messages"
          isActive={pathname == "/messages"}
          onClick={() => router.push("/messages")}
        />
      </div>
      {/* Profile button on the top right */}
      <ProfileBtn />
    </div>
  );
};

export default Header;
