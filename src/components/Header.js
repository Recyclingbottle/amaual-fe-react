import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import before_img from "../assets/navigate-before.png";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../store/userSlice";

const Header = () => {
  // 리덕스 에서 저장된 user 정보 가져옴
  const user = useSelector((state) => state.user);
  // API url 이미지 불러올때 사용
  const apiUrl = process.env.REACT_APP_API_URL;
  // 현재 "/" 어디있는지 확인하기 위해 location
  const location = useLocation();
  const navigate = useNavigate();
  // 리덕스 메소드를 사용하기 위해
  const dispatch = useDispatch();
  // 메뉴 보이고 안보이고 상태로 조절
  const [menuVisible, setMenuVisible] = useState(false);

  const showBackButton = () => {
    // 뒤로가기 버튼이 보여하는 페이지만
    return currentPath === "/signup";
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogout = () => {
    // 리덕스 상태 메소드 호출, 유저 정보 삭제
    dispatch(clearUser());
    navigate("/login");
  };
  // 지금 어떤 페이지인지 알기 위해서
  const currentPath = location.pathname;

  return (
    <div className={styles.navbar}>
      {showBackButton() && (
        <img
          className={styles.beforeImage}
          src={before_img}
          alt="뒤로가기버튼"
        />
      )}
      <p className={styles.logoText}>아무 말 대잔치</p>
      <div className={styles.profileContainer}>
        {user.isLoggedIn ? (
          <>
            <img
              className={styles.profileImage}
              src={`${apiUrl}/images/profile/${user.profileImage}`}
              alt="프로필 이미지"
              onClick={toggleMenu}
            />
            <ul
              className={`${styles.menu} ${menuVisible ? "" : styles.hidden}`}
            >
              <li className={styles.menuItem}>회원정보수정</li>
              <li className={styles.menuItem}>비밀번호수정</li>
              <li className={styles.menuItem} onClick={handleLogout}>
                로그아웃
              </li>
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Header;
