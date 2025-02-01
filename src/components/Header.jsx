
import Button from "./ui/Button";
import styles from "./Header.module.css";
import ProfileBtn from "./ProfileBtn";

const Header = () => {
  return (
    <div className={styles["header-container"]}>
      {/* Logo on the top left */}
      <div className={styles["logo"]}>WasteNot</div>
      {/* Container for the "Map" and "Messages" buttons on the top center */}
      <div className={styles["navigation-btn-container"]}>
        <Button text="Map" />
        <Button text="Messages" />
      </div>
      {/* Profile button on the top right */}
      <ProfileBtn />
    </div>
  );
};

export default Header;
