import React, { createContext, useState, useEffect } from 'react';

export const AdminContext = createContext();

const BASE_URL = import.meta.env.VITE_API_URL;  // only base URL here

export const AdminProvider = ({ children }) => {
  const [adminName, setAdminName] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('adminName');
    const token = localStorage.getItem('adminToken');
    if (name && token) {
      setAdminName(name);
      setAdminToken(token);
      setIsLoggedIn(true);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    setAdminName('');
    setAdminToken('');
    setIsLoggedIn(false);
  };



  return (
    <AdminContext.Provider
      value={{
        adminName,
        setAdminName,
        adminToken,
        setAdminToken,
        isLoggedIn,
        setIsLoggedIn,
        logout,
        BASE_URL,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
