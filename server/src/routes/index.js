import express from "express";
const router = express.Router();

// import adminRoutes from "./admin.routes.js";
import contactRoutes from "./contact.routes.js";
router.use("/contacts", contactRoutes);
// router.use("/admin", adminRoutes);

export default router;
