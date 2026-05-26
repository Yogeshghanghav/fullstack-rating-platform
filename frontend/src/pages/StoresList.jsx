import React, { useEffect, useState, useCallback } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import StarRating from "../components/StarRating";

function StoresList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ name: "", address: "" });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("ASC");
  const [ratingModal, setRatingModal] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const fetchStores = useCallback(() => {
    const params = { ...search, sortBy, order };
    setLoading(true);
    api.get("/stores", { params })
      .then((res) => setStores(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, sortBy, order]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  function handleSort(field) {
    if (sortBy === field) {
      setOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(field);
      setOrder("ASC");
    }
  }

  function getSortIcon(field) {
    if (sortBy !== field) return " ↕";
    return order === "ASC" ? " ↑" : " ↓";
  }

  function openRatingModal(store) {
    setRatingModal(store);
    setSelectedRating(store.my_rating || 0);
    setMessage("");
  }

  function closeModal() {
    setRatingModal(null);
    setSelectedRating(0);
  }

  async function submitRating() {
    if (!selectedRating) return;
    setSubmitting(true);
    try {
      await api.post("/ratings", { store_id: ratingModal.id, rating: selectedRating });
      setMessage("Rating submitted!");
      fetchStores();
      setTimeout(() => closeModal(), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to submit rating.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>All Stores</h1>
        </div>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by name"
            value={search.name}
            onChange={(e) => setSearch((p) => ({ ...p, name: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Search by address"
            value={search.address}
            onChange={(e) => setSearch((p) => ({ ...p, address: e.target.value }))}
          />
        </div>

        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading stores...</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort("name")}>Store Name{getSortIcon("name")}</th>
                  <th onClick={() => handleSort("address")}>Address{getSortIcon("address")}</th>
                  <th onClick={() => handleSort("avg_rating")}>Overall Rating{getSortIcon("avg_rating")}</th>
                  <th>Your Rating</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stores.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state">No stores found.</div>
                    </td>
                  </tr>
                ) : (
                  stores.map((store) => (
                    <tr key={store.id}>
                      <td style={{ fontWeight: "500" }}>{store.name}</td>
                      <td style={{ color: "var(--text-secondary)" }}>{store.address}</td>
                      <td>
                        {store.avg_rating ? (
                          <span>⭐ {store.avg_rating} / 5</span>
                        ) : (
                          <span style={{ color: "var(--text-secondary)" }}>No ratings yet</span>
                        )}
                      </td>
                      <td>
                        {store.my_rating ? (
                          <StarRating value={store.my_rating} readOnly />
                        ) : (
                          <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Not rated</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-outline"
                          style={{ fontSize: "13px", padding: "6px 14px" }}
                          onClick={() => openRatingModal(store)}
                        >
                          {store.my_rating ? "Update Rating" : "Rate Store"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {ratingModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Rate — {ratingModal.name}</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginBottom: "20px" }}>
              {ratingModal.address}
            </p>

            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "14px", marginBottom: "10px", fontWeight: "500" }}>
                Select your rating:
              </p>
              <StarRating value={selectedRating} onChange={setSelectedRating} />
              {selectedRating > 0 && (
                <p style={{ marginTop: "8px", fontSize: "14px", color: "var(--text-secondary)" }}>
                  You selected: {selectedRating} / 5
                </p>
              )}
            </div>

            {message && (
              <div className={`alert ${message.includes("Failed") ? "alert-error" : "alert-success"}`}>
                {message}
              </div>
            )}

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={submitRating}
                disabled={!selectedRating || submitting}
              >
                {submitting ? "Submitting..." : "Submit Rating"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StoresList;
