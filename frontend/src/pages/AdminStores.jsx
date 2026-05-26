import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";

function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("ASC");

  const fetchStores = useCallback(() => {
    const params = { ...filters, sortBy, order };
    setLoading(true);
    api.get("/admin/stores", { params })
      .then((res) => setStores(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters, sortBy, order]);

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

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>Stores</h1>
          <Link to="/admin/add-store" className="btn btn-primary">
            + Add Store
          </Link>
        </div>

        <div className="filter-bar">
          <input
            type="text"
            name="name"
            placeholder="Filter by name"
            value={filters.name}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="email"
            placeholder="Filter by email"
            value={filters.email}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Filter by address"
            value={filters.address}
            onChange={handleFilterChange}
          />
        </div>

        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading stores...</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort("name")}>Name{getSortIcon("name")}</th>
                  <th onClick={() => handleSort("email")}>Email{getSortIcon("email")}</th>
                  <th onClick={() => handleSort("address")}>Address{getSortIcon("address")}</th>
                  <th onClick={() => handleSort("avg_rating")}>Rating{getSortIcon("avg_rating")}</th>
                </tr>
              </thead>
              <tbody>
                {stores.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className="empty-state">No stores found.</div>
                    </td>
                  </tr>
                ) : (
                  stores.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.email}</td>
                      <td>{s.address}</td>
                      <td>{s.avg_rating ? `${s.avg_rating}` : "No ratings yet"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminStores;
