import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";

import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import CreatePostPage from "./pages/CreatePostPage";
import PostDetailPage from "./pages/PostDetailPage";
import EditPostPage from "./pages/EditPostPage";
import EditProfilePage from "./pages/EditProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

const App = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  return (
    <Router>
      <div>
        <Header isLoggedIn={isLoggedIn}></Header>
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />}
          />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/create-post"
            element={isLoggedIn ? <CreatePostPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/posts/:postId"
            element={isLoggedIn ? <PostDetailPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/edit-post/:postId"
            element={isLoggedIn ? <EditPostPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/edit-profile"
            element={
              isLoggedIn ? <EditProfilePage /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/change-password"
            element={
              isLoggedIn ? <ChangePasswordPage /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
