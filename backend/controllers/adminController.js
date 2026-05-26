const bcrypt = require("bcryptjs");
const db = require("../config/db");

async function getDashboardStats(req, res) {
  try {
    const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) AS totalUsers FROM users WHERE role != 'admin'");
    const [[{ totalStores }]] = await db.query("SELECT COUNT(*) AS totalStores FROM stores");
    const [[{ totalRatings }]] = await db.query("SELECT COUNT(*) AS totalRatings FROM ratings");

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ message: "Failed to load dashboard stats." });
  }
}

async function getAllUsers(req, res) {
  const { name, email, address, role, sortBy = "name", order = "ASC" } = req.query;

  const allowedSortFields = ["name", "email", "address", "role"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "name";
  const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  let query = `
    SELECT u.id, u.name, u.email, u.address, u.role,
      ROUND(AVG(r.rating), 1) AS avg_rating
    FROM users u
    LEFT JOIN stores s ON s.owner_id = u.id
    LEFT JOIN ratings r ON r.store_id = s.id
    WHERE u.role IN ('user', 'store_owner', 'admin')
  `;
  const params = [];

  if (name) { query += " AND u.name LIKE ?"; params.push(`%${name}%`); }
  if (email) { query += " AND u.email LIKE ?"; params.push(`%${email}%`); }
  if (address) { query += " AND u.address LIKE ?"; params.push(`%${address}%`); }
  if (role) { query += " AND u.role = ?"; params.push(role); }

  query += ` GROUP BY u.id ORDER BY u.${sortField} ${sortOrder}`;

  try {
    const [users] = await db.query(query, params);
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Failed to fetch users." });
  }
}

async function addUser(req, res) {
  const { name, email, password, address, role } = req.body;

  if (!name || !email || !password || !address || !role) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (name.length < 20 || name.length > 60) {
    return res.status(400).json({ message: "Name must be between 20 and 60 characters." });
  }

  if (!["admin", "user", "store_owner"].includes(role)) {
    return res.status(400).json({ message: "Invalid role." });
  }

  try {
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({ message: "User added successfully." });
  } catch (err) {
    console.error("Add user error:", err);
    res.status(500).json({ message: "Failed to add user." });
  }
}

async function getAllStores(req, res) {
  const { name, email, address, sortBy = "name", order = "ASC" } = req.query;

  const allowedSortFields = ["name", "email", "address", "avg_rating"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "name";
  const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  let query = `
    SELECT s.id, s.name, s.email, s.address,
      ROUND(AVG(r.rating), 1) AS avg_rating
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    WHERE 1=1
  `;
  const params = [];

  if (name) { query += " AND s.name LIKE ?"; params.push(`%${name}%`); }
  if (email) { query += " AND s.email LIKE ?"; params.push(`%${email}%`); }
  if (address) { query += " AND s.address LIKE ?"; params.push(`%${address}%`); }

  query += ` GROUP BY s.id ORDER BY ${sortField} ${sortOrder}`;

  try {
    const [stores] = await db.query(query, params);
    res.json(stores);
  } catch (err) {
    console.error("Get stores error:", err);
    res.status(500).json({ message: "Failed to fetch stores." });
  }
}

async function addStore(req, res) {
  const { name, email, address, owner_id } = req.body;

  if (!name || !email || !address) {
    return res.status(400).json({ message: "Name, email, and address are required." });
  }

  if (name.length < 20 || name.length > 60) {
    return res.status(400).json({ message: "Store name must be between 20 and 60 characters." });
  }

  try {
    const [existing] = await db.query("SELECT id FROM stores WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Store email already exists." });
    }

    await db.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
      [name, email, address, owner_id || null]
    );

    res.status(201).json({ message: "Store added successfully." });
  } catch (err) {
    console.error("Add store error:", err);
    res.status(500).json({ message: "Failed to add store." });
  }
}

module.exports = { getDashboardStats, getAllUsers, addUser, getAllStores, addStore };
