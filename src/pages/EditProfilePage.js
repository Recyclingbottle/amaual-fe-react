import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./EditProfilePage.module.css";
import FormGroup from "../components/FormGroup";
import Button from "../components/Button";
import Modal from "../components/Modal";
import withAuth from "../hocs/withAuth";
import { setUser } from "../store/userSlice";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
          setHelperText("이미지 업로드에 실패했습니다.");
          return;
        }
      } catch (error) {
        setHelperText("이미지 업로드 중 오류가 발생했습니다.");
        return;
      }
    }

    const userPayload = {
      nickname,
      profile_image: uploadedImageName,
    };

    try {
      const response = await axios.patch(
        `${apiUrl}/users/${user.userId}`,
        userPayload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        dispatch(
          setUser({
            email: user.email,
            nickname,
            userId: user.userId,
            profileImage: uploadedImageName,
          })
        );
        navigate("/");
      } else {
        setHelperText("프로필 수정에 실패했습니다.");
      }
    } catch (error) {
      setHelperText("프로필 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = () => {
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const handleConfirm = async () => {
    try {
      const response = await axios.delete(`${apiUrl}/users/${user.userId}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        // 로그아웃 처리 등 추가 작업 필요
        navigate("/signup");
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.editProfileContainer}>
        <h2>프로필 수정</h2>
        <form className={styles.editProfileForm}>
          <FormGroup label="프로필 사진" helperText="">
            <div
              className={styles.profileImageContainer}
              onClick={handleProfileImageClick}
            >
              <img
                src={profileImage}
                alt="프로필 이미지"
                className={styles.profileImage}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className={styles.fileInput}
                style={{ display: "none" }}
              />
            </div>
          </FormGroup>
          <FormGroup label="닉네임" helperText={helperText}>
            <input
              className={styles.formGroupInput}
              type="text"
              id="nickname"
              name="nickname"
              value={nickname}
              onChange={handleNicknameChange}
              required
            />
          </FormGroup>
        </form>
        <div className={styles.btnContainer}>
          <Button
            className={styles.EditButton}
            type="button"
            style={{ marginTop: 5 }}
            onClick={handleSubmit}
          >
            수정하기
          </Button>
          <p className={styles.goToLogin} onClick={handleDelete}>
            회원탈퇴
          </p>
        </div>
        <div className={styles.backBtnBox}>
          <Button className={styles.backBtn} onClick={() => navigate("/")}>
            수정완료
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        title="회원탈퇴 하시겠습니까?"
        content="작성된 게시글과 댓글은 삭제됩니다."
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default withAuth(EditProfilePage);
