import React, { useEffect, useState, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import "./Dashboard.css";
import logo from "/assets/koti-wood-works-logo.png";

const Dashboard = () => {
  const { BASE_URL } = useContext(AdminContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const adminToken = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to fetch dashboard data");
        }

        const dashboardData = await res.json();
        setData(dashboardData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [adminToken]);

  if (loading)
    return (
      <div className="dashboard-container">
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      </div>
    );
  if (error) return <div className="dashboard-container error">{error}</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <img src={logo} alt="Welcome" className="dashboard-image" />
        <h1>Welcome, {data.adminName}!</h1>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Photos</h3>
          <p>{data.totalPhotos}</p>
        </div>

        <div className="dashboard-card">
          <h3>Photos Uploaded Last 7 Days</h3>
          <p>{data.recentUploads}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
