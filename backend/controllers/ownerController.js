const db = require("../config/db");

async function getMyStoreDashboard(req, res) {
  const ownerId = req.user.id;

  try {
    const [storeRows] = await db.query(
      "SELECT id, name, address FROM stores WHERE owner_id = ?",
      [ownerId]
    );

    if (storeRows.length === 0) {
      return res.status(404).json({ message: "No store found for this owner." });
    }

    const store = storeRows[0];

    const [[{ avg_rating }]] = await db.query(
      "SELECT ROUND(AVG(rating), 1) AS avg_rating FROM ratings WHERE store_id = ?",
      [store.id]
    );

    const [raters] = await db.query(
      `SELECT u.name, u.email, r.rating, r.updated_at
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?
       ORDER BY r.updated_at DESC`,
      [store.id]
    );

    res.json({ store, avg_rating: avg_rating || 0, raters });
  } catch (err) {
    console.error("Owner dashboard error:", err);
    res.status(500).json({ message: "Failed to load dashboard." });
  }
}

module.exports = { getMyStoreDashboard };
