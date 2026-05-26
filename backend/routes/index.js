const express = require("express");
const router = express.Router();

const { register, login, updatePassword } = require("../controllers/authController");
const { getDashboardStats, getAllUsers, addUser, getAllStores, addStore } = require("../controllers/adminController");
const { getStores, submitRating } = require("../controllers/storeController");
const { getMyStoreDashboard } = require("../controllers/ownerController");
const { verifyToken, allowRoles } = require("../middleware/auth");
router.post("/auth/register", register);
router.post("/auth/login", login);
router.put("/auth/update-password", verifyToken, updatePassword);
router.get("/admin/dashboard", verifyToken, allowRoles("admin"), getDashboardStats);
router.get("/admin/users", verifyToken, allowRoles("admin"), getAllUsers);
router.post("/admin/users", verifyToken, allowRoles("admin"), addUser);
router.get("/admin/stores", verifyToken, allowRoles("admin"), getAllStores);
router.post("/admin/stores", verifyToken, allowRoles("admin"), addStore);
router.get("/stores", verifyToken, allowRoles("user"), getStores);
router.post("/ratings", verifyToken, allowRoles("user"), submitRating);
router.get("/owner/dashboard", verifyToken, allowRoles("store_owner"), getMyStoreDashboard);

module.exports = router;
