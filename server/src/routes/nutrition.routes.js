import express from "express";
import {
  GetFilteredContacts,
  GetLocationFilters,
//   GetLocationLevels,
} from "../controllers/contact.controller.js";

const router = express.Router();

router.get("/filters", GetLocationFilters);
router.get("/filteredContacts", GetFilteredContacts);
// router.get("/filters/levels", GetLocationLevels);

export default router;
