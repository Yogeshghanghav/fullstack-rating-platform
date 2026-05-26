const db = require("../config/db");

async function getStores(req, res) {
  const { name, address, sortBy = "name", order = "ASC" } = req.query;
  const userId = req.user.id;

  const allowedSortFields = ["name", "address", "avg_rating"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "name";
  const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  let query = `
    SELECT s.id, s.name, s.address,
      ROUND(AVG(r.rating), 1) AS avg_rating,
      MAX(CASE WHEN r.user_id = ? THEN r.rating END) AS my_rating
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    WHERE 1=1
  `;
  const params = [userId];

  if (name) { query += " AND s.name LIKE ?"; params.push(`%${name}%`); }
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

async function submitRating(req, res) {
  const { store_id, rating } = req.body;
  const userId = req.user.id;

  if (!store_id || !rating) {
    return res.status(400).json({ message: "Store ID and rating are required." });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  try {
    const [existing] = await db.query(
      "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
      [userId, store_id]
    );

    if (existing.length > 0) {
      await db.query(
        "UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?",
        [rating, userId, store_id]
      );
      return res.json({ message: "Rating updated successfully." });
    }

    await db.query(
      "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
      [userId, store_id, rating]
    );

    res.status(201).json({ message: "Rating submitted successfully." });
  } catch (err) {
    console.error("Submit rating error:", err);
    res.status(500).json({ message: "Failed to submit rating." });
  }
}

module.exports = { getStores, submitRating };
