import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { validatePassword } from "../utils/validators";

function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const newErrors = {};
    if (!form.currentPassword) newErrors.currentPassword = "Current password is required.";
    const passError = validatePassword(form.newPassword);
    if (passError) newErrors.newPassword = passError;
    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    setSuccess("");
    if (!validate()) return;

    setLoading(true);
    try {
      await api.put("/auth/update-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess("Password updated successfully!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });

      setTimeout(() => {
        if (user.role === "admin") navigate("/admin/dashboard");
        else if (user.role === "store_owner") navigate("/owner/dashboard");
        else navigate("/stores");
      }, 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  }

  function goBack() {
    if (user.role === "admin") navigate("/admin/dashboard");
    else if (user.role === "store_owner") navigate("/owner/dashboard");
    else navigate("/stores");
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>Change Password</h1>
          <button className="btn btn-outline" onClick={goBack}>← Go Back</button>
        </div>

        <div style={{ maxWidth: "460px" }}>
          <div className="card">
            {serverError && <div className="alert alert-error">{serverError}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  placeholder="Enter current password"
                  value={form.currentPassword}
                  onChange={handleChange}
                  className={errors.currentPassword ? "error" : ""}
                />
                {errors.currentPassword && <p className="field-error">{errors.currentPassword}</p>}
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="8-16 chars, 1 uppercase, 1 special"
                  value={form.newPassword}
                  onChange={handleChange}
                  className={errors.newPassword ? "error" : ""}
                />
                {errors.newPassword && <p className="field-error">{errors.newPassword}</p>}
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "error" : ""}
                />
                {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
