// src/hocs/withAuth.js
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);

    useEffect(() => {
      if (!user.isLoggedIn) {
        navigate("/login");
      }
    }, [user, navigate]);

    if (!user.isLoggedIn) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
