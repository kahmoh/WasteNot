import { useNavigate, useLocation } from "react-router-dom";
import Button from "../messages/components/ui/button.jsx";
import styles from "../messages/styles/Header.module.css";
import ProfileBtn from "./ProfileBtn.jsx";

const Header = () => {
  // Used for navigating pages
  const navigate = useNavigate();
  // Tracks the current page that the user is on
  const location = useLocation();

  return (
    <div className={styles["header-container"]}>
      {/* Logo on the top left */}
      <div className={styles["logo"]}>WasteNot</div>
      {/* Container for the "Map" and "Messages" buttons on the top center */}
      <div className={styles["navigation-btn-container"]}>
        {/* Button is highlighted based on user's current page */}
        <Button
          text="Map"
          isActive={location.pathname === "/"}
          onClick={() => navigate("/")}
        />
        <Button
          text="Messages"
          isActive={location.pathname == "/messages"}
          onClick={() => navigate("/messages")}
        />
      </div>
      {/* Profile button on the top right */}
      <ProfileBtn />
    </div>
  );
};

export default Header;
