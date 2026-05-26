import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import { validateName, validateEmail, validateAddress } from "../utils/validators";

function AddStore() {
  const [form, setForm] = useState({ name: "", email: "", address: "", owner_id: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [owners, setOwners] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/admin/users", { params: { role: "store_owner" } })
      .then((res) => setOwners(res.data))
      .catch(() => {});
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const newErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
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
      await api.post("/admin/stores", form);
      setSuccess("Store added successfully!");
      setForm({ name: "", email: "", address: "", owner_id: "" });
      setTimeout(() => navigate("/admin/stores"), 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || "Failed to add store.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="page-header">
          <h1>Add New Store</h1>
          <Link to="/admin/stores" className="btn btn-outline">← Back to Stores</Link>
        </div>

        <div style={{ maxWidth: "520px" }}>
          <div className="card">
            {serverError && <div className="alert alert-error">{serverError}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Store Name</label>
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
                <label>Store Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="store@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  placeholder="Full store address"
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  className={errors.address ? "error" : ""}
                  style={{ resize: "vertical" }}
                />
                {errors.address && <p className="field-error">{errors.address}</p>}
              </div>

              <div className="form-group">
                <label>Store Owner (optional)</label>
                <select name="owner_id" value={form.owner_id} onChange={handleChange}>
                  <option value="">No owner assigned</option>
                  {owners.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} — {o.email}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? "Adding..." : "Add Store"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddStore;
