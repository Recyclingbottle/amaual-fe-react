import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import styles from "./ChangePasswordPage.module.css";
import FormGroup from "../components/FormGroup";
import Button from "../components/Button";
import withAuth from "../hocs/withAuth";
import { clearUser } from "../store/userSlice";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId); // userId 가져오기
  const apiUrl = process.env.REACT_APP_API_URL;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [helperText, setHelperText] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setHelperText("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.patch(
        `${apiUrl}/users/${userId}/password`,
        {
          new_password: newPassword,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        dispatch(clearUser());
        navigate("/login");
      } else {
        setHelperText("비밀번호 변경에 실패했습니다.");
      }
    } catch (error) {
      setHelperText("비밀번호 변경 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.changePasswordContainer}>
        <h2>비밀번호 변경</h2>
        <form className={styles.changePasswordForm} onSubmit={handleSubmit}>
          <FormGroup label="새 비밀번호" helperText="">
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup label="비밀번호 확인" helperText={helperText}>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </FormGroup>
          <Button type="submit">변경</Button>
        </form>
      </div>
    </div>
  );
};

export default withAuth(ChangePasswordPage);
