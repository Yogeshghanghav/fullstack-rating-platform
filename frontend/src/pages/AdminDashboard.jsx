import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Users", value: stats.totalUsers,  link: "/admin/users" },
    { label: "Total Stores", value: stats.totalStores,  link: "/admin/stores" },
    { label: "Total Ratings", value: stats.totalRatings,  link: null },
  ];

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
        ) : (
          <>
            <div className="stat-grid">
              {cards.map((card) => (
                <div key={card.label} className="stat-card">
                  <div style={{ fontSize: "32px", marginBottom: "8px" }}>{card.icon}</div>
                  <div className="stat-number">{card.value}</div>
                  <div className="stat-label">{card.label}</div>
                  {card.link && (
                    <Link
                      to={card.link}
                      style={{
                        display: "inline-block",
                        marginTop: "12px",
                        fontSize: "13px",
                        color: "var(--primary)",
                        textDecoration: "none",
                      }}
                    >
                      View all →
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Link to="/admin/users" className="btn btn-primary">
                Manage Users
              </Link>
              <Link to="/admin/stores" className="btn btn-outline">
                Manage Stores
              </Link>
              <Link to="/admin/add-user" className="btn btn-outline">
                + Add User
              </Link>
              <Link to="/admin/add-store" className="btn btn-outline">
                + Add Store
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
