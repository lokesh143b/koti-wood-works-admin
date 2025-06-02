import React, { useState, useContext } from 'react';
import './Navbar.css';
import logo from '/assets/koti-wood-works-logo.png';
import { AdminContext } from '../../context/AdminContext';

const Navbar = ({ onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { adminName, logout, BASE_URL } = useContext(AdminContext);
  const adminToken = localStorage.getItem('adminToken');

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const firstLetter = adminName ? adminName.charAt(0).toUpperCase() : '';

  // Handle Change Password API call
  const handleChangePassword = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch(`${BASE_URL}/api/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ oldPassword: currentPassword, newPassword }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to change password');
      }
  
      alert('Password changed successfully!');
      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setDropdownOpen(false);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };
  
  return (
    <header className="navbar">
      <button className="hamburger" onClick={onToggleSidebar} aria-label="Toggle Sidebar">
        &#9776;
      </button>

      <div className="navbar-title">
        <img src={logo} alt="Logo" className="navbar-logo" />
        Koti Wood Works
      </div>

      <div className="navbar-right">
        {adminName && (
          <div className="admin-avatar-wrapper" onClick={toggleDropdown}>
            <div className="admin-avatar">{firstLetter}</div>
            {dropdownOpen && (
              <div className="admin-dropdown">
                <button onClick={logout}>Logout</button>
                <button onClick={() => setShowChangePassword(true)}>Change Password</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Change Password Popup */}
      {showChangePassword && (
        <div className="change-password-popup">
          <form className="change-password-form" onSubmit={handleChangePassword}>
            <h3>Change Password</h3>
            <label>
              Current Password:
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </label>
            <label>
              New Password:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </label>
            <div className="buttons">
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setShowChangePassword(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
};

export default Navbar;
