import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  return (
    <>
      <nav className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
          onClick={onClose}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/add-photo"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
          onClick={onClose}
        >
          Add Photos
        </NavLink>
        <NavLink
          to="/photos"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
          onClick={onClose}
        >
          Photos
        </NavLink>
      </nav>
      {/* Show overlay ONLY on mobile */}
      {isMobile && isOpen && <div className="overlay" onClick={onClose}></div>}
    </>
  );
};

export default Sidebar;
