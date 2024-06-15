import React from "react";
import { useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import before_img from "../assets/navigate-before.png";
import default_profile_img from "../assets/profile_img.webp";

const Header = (props) => {
  // 현재 위치 "/" 인지 "/login" 인지를 알아기 위해 사용
  const location = useLocation();
  const currentPath = location.pathname;

  const showBackButton = () => {
    return currentPath === "/signup";
  };
  return (
    <div className={styles.navbar}>
      {showBackButton() && (
        <img className={styles.navbar1} src={before_img} alt="뒤로가기버튼" />
      )}
      <p className={styles.logoText}>아무 말 대잔치</p>
      <div className={styles.profileContainer}>
        {props.isLoggedIn ? (
          <img
            className={styles.profileImage}
            src={default_profile_img}
            alt="프로필 이미지"
          />
        ) : null}
        <ul className={`${styles.menu} ${styles.hidden}`}>
          <li className={styles.menuItem}>회원정보수정</li>
          <li className={styles.menuItem}>비밀번호수정</li>
          <li className={styles.menuItem}>로그아웃</li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
