import React, { useEffect, useState } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import StarRating from "../components/StarRating";

function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/owner/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>My Store Dashboard</h1>
        </div>

        {loading && <p style={{ color: "var(--text-secondary)" }}>Loading...</p>}
        {error && <div className="alert alert-error">{error}</div>}

        {data && (
          <>
            <div className="stat-grid" style={{ marginBottom: "32px" }}>
              <div className="stat-card">
                <div style={{ fontSize: "28px", marginBottom: "8px" }}></div>
                <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: "4px" }}>
                  {data.store.name}
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  {data.store.address}
                </div>
              </div>

              <div className="stat-card">
                <div style={{ fontSize: "28px", marginBottom: "8px" }}></div>
                <div className="stat-number">
                  {data.avg_rating > 0 ? data.avg_rating : "—"}
                </div>
                <div className="stat-label">Average Rating</div>
                {data.avg_rating > 0 && (
                  <div style={{ marginTop: "8px" }}>
                    <StarRating value={Math.round(data.avg_rating)} readOnly />
                  </div>
                )}
              </div>

              <div className="stat-card">
                <div style={{ fontSize: "28px", marginBottom: "8px" }}></div>
                <div className="stat-number">{data.raters.length}</div>
                <div className="stat-label">Total Reviews</div>
              </div>
            </div>

            <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
              Customer Ratings
            </h2>

            {data.raters.length === 0 ? (
              <div className="empty-state">No ratings received yet.</div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Email</th>
                      <th>Rating</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.raters.map((r, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: "500" }}>{r.name}</td>
                        <td style={{ color: "var(--text-secondary)" }}>{r.email}</td>
                        <td>
                          <StarRating value={r.rating} readOnly />
                        </td>
                        <td style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                          {new Date(r.updated_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default OwnerDashboard;
