import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import { validateName, validateEmail, validatePassword, validateAddress } from "../utils/validators";

function AddUser() {
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "", role: "user" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const newErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      address: validateAddress(form.address),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((e) => e === "");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    setSuccess("");
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/admin/users", form);
      setSuccess("User added successfully!");
      setForm({ name: "", email: "", password: "", address: "", role: "user" });
      setTimeout(() => navigate("/admin/users"), 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to add user.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>Add New User</h1>
          <Link to="/admin/users" className="btn btn-outline">← Back to Users</Link>
        </div>

        <div style={{ maxWidth: "520px" }}>
          <div className="card">
            {serverError && <div className="alert alert-error">{serverError}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Min 20 characters"
                  value={form.name}
                  onChange={handleChange}
                  className={errors.name ? "error" : ""}
                />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="user@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="8-16 chars, 1 uppercase, 1 special"
                  value={form.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                />
                {errors.password && <p className="field-error">{errors.password}</p>}
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  placeholder="Full address"
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  className={errors.address ? "error" : ""}
                  style={{ resize: "vertical" }}
                />
                {errors.address && <p className="field-error">{errors.address}</p>}
              </div>

              <div className="form-group">
                <label>Role</label>
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="user">Normal User</option>
                  <option value="store_owner">Store Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? "Adding..." : "Add User"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUser;
