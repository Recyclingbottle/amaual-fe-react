import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./EditProfilePage.module.css";
import axios from "axios";

const EditProfilePage = () => {
  const navigate = useNavigate();

  // Redux 상태에서 사용자 정보 가져오기
  const user = useSelector((state) => state.user);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [helperText, setHelperText] = useState("");
  const [nickname, setNickname] = useState(user.nickname);
  const [isNicknameValid, setIsNicknameValid] = useState(true);
  const [profileImage, setProfileImage] = useState(
    `${apiUrl}/images/profile/${user.profileImage}`
  );
  const [newProfileImageFile, setNewProfileImageFile] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const fileInputRef = useRef(null);

  const handleNicknameChange = async (e) => {
    const newNickname = e.target.value;
    setNickname(newNickname);

    try {
      const response = await axios.get(`${apiUrl}/users/check-nickname`, {
        params: { nickname: newNickname },
      });

      if (response.data.message === "사용 가능한 닉네임입니다.") {
        setIsNicknameValid(true);
        setHelperText(response.data.message);
      } else {
        setIsNicknameValid(false);
        setHelperText(response.data.message);
      }
    } catch (error) {
      setIsNicknameValid(false);
      setHelperText("닉네임 중복 체크 중 오류가 발생했습니다.");
    }
  };

  const handleProfileImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfileImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!isNicknameValid) {
      setHelperText("유효한 닉네임을 입력해주세요.");
      return;
    }

    let uploadedImageName = user.profileImage;

    if (newProfileImageFile) {
      const formData = new FormData();
      formData.append("image", newProfileImageFile);

      try {
        const uploadResponse = await axios.post(
          `${apiUrl}/upload/profile`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (uploadResponse.status === 200) {
          uploadedImageName = uploadResponse.data.filename;
        } else {
          setHelperText("프로필 사진 업로드에 실패했습니다.");
          return;
        }
      } catch (error) {
        setHelperText("프로필 사진 업로드 중 오류가 발생했습니다.");
        return;
      }
    }

    const updatePayload = {
      nickname,
      profile_image: uploadedImageName,
    };

    try {
      const response = await axios.patch(
        `${apiUrl}/users/${user.userId}`,
        updatePayload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        navigate("/");
      } else {
        setHelperText("사용자 정보 수정에 실패했습니다.");
      }
    } catch (error) {
      setHelperText("사용자 정보 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = () => {
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const handleConfirm = async () => {
    console.log("회원탈퇴 확인 누름");

    try {
      const response = await axios.delete(`${apiUrl}/users/${user.userId}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        // 성공적으로 삭제되었을 때 처리
        setModalOpen(false);
        navigate("/login");
      } else {
        // 삭제 실패 시 처리
        setHelperText("회원탈퇴에 실패했습니다.");
      }
    } catch (error) {
      // 오류 처리
      setHelperText("회원탈퇴 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.profileEditContainer}>
        <p className={styles.pageHeader}>회원 정보 수정</p>
        <div className={styles.uploadContainer}>
          <label className={styles.profileLabel}>프로필 사진</label>
          <div className={styles.profileAddBox}>
            <img
              src={profileImage}
              alt="Profile"
              onClick={handleProfileImageClick}
              style={{
                width: "149px",
                height: "149px",
                borderRadius: "100%",
                cursor: "pointer",
              }}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              className={styles.profileImageInput}
            />
          </div>
        </div>
        <form>
          <div className={styles.formGroup}>
            <label className={styles.formGroupLabel} htmlFor="email">
              이메일
            </label>
            <p id="email">{user.email}</p>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formGroupLabel} htmlFor="nickname">
              닉네임
            </label>
            <input
              className={styles.formGroupInput}
              type="text"
              id="nickname"
              name="nickname"
              value={nickname}
              onChange={handleNicknameChange}
              required
            />
          </div>
          <p className={styles.helperText}>{helperText}</p>
        </form>
        <div className={styles.btnContainer}>
          <button
            className={styles.EditButton}
            type="button"
            style={{ marginTop: 5 }}
            onClick={handleSubmit}
          >
            수정하기
          </button>
          <p className={styles.goToLogin} onClick={handleDelete}>
            회원탈퇴
          </p>
        </div>
        <div className={styles.backBtnBox}>
          <button className={styles.backBtn} onClick={() => navigate("/")}>
            수정완료
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modal} style={{ display: "block" }}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>회원탈퇴 하시겠습니까?</h2>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.modalText}>
                작성된 게시글과 댓글은 삭제됩니다.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button
                className={`${styles.btn} ${styles.cancel}`}
                onClick={handleCancel}
              >
                취소
              </button>
              <button
                className={`${styles.btn} ${styles.confirm}`}
                onClick={handleConfirm}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfilePage;
