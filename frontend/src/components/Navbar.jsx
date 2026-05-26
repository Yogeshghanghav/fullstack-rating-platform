import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <span className="navbar-brand">StoreRating</span>
        <div className="navbar-right">
          <Link
            to="/change-password"
            style={{ fontSize: "14px", color: "var(--text-secondary)", textDecoration: "none" }}
          >
            {user?.name?.split(" ")[0]}
          </Link>
          <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            {user?.role?.replace("_", " ")}
          </span>
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
