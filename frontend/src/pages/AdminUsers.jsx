import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: "", email: "", address: "", role: "" });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("ASC");

  const fetchUsers = useCallback(() => {
    const params = { ...filters, sortBy, order };
    setLoading(true);
    api.get("/admin/users", { params })
      .then((res) => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filters, sortBy, order]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
          <h1>Users</h1>
          <Link to="/admin/add-user" className="btn btn-primary">
            + Add User
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
          <select name="role" value={filters.role} onChange={handleFilterChange}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>

        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading users...</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort("name")}>Name{getSortIcon("name")}</th>
                  <th onClick={() => handleSort("email")}>Email{getSortIcon("email")}</th>
                  <th onClick={() => handleSort("address")}>Address{getSortIcon("address")}</th>
                  <th onClick={() => handleSort("role")}>Role{getSortIcon("role")}</th>
                  <th>Avg Rating</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state">No users found.</div>
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.address}</td>
                      <td>
                        <span className={`badge badge-${u.role}`}>
                          {u.role.replace("_", " ")}
                        </span>
                      </td>
                      <td>
                        {u.role === "store_owner" && u.avg_rating
                          ? ` ${u.avg_rating}`
                          : "—"}
                      </td>
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

export default AdminUsers;
