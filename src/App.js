import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";

import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CreatePostPage from "./pages/CreatePostPage";
import PostDetailPage from "./pages/PostDetailPage";
import EditPostPage from "./pages/EditPostPage";
import EditProfilePage from "./pages/EditProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import withAuth from "./hocs/withAuth";

const AuthenticatedCreatePostPage = withAuth(CreatePostPage);
const AuthenticatedPostDetailPage = withAuth(PostDetailPage);
const AuthenticatedEditPostPage = withAuth(EditPostPage);
const AuthenticatedEditProfilePage = withAuth(EditProfilePage);
const AuthenticatedChangePasswordPage = withAuth(ChangePasswordPage);

const App = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return (
    <Router>
      <div>
        <Header isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/create-post"
            element={<AuthenticatedCreatePostPage />}
          />
          <Route
            path="/posts/:postId"
            element={<AuthenticatedPostDetailPage />}
          />
          <Route
            path="/edit-post/:postId"
            element={<AuthenticatedEditPostPage />}
          />
          <Route
            path="/edit-profile"
            element={<AuthenticatedEditProfilePage />}
          />
          <Route
            path="/change-password"
            element={<AuthenticatedChangePasswordPage />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
