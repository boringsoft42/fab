import express from "express";
import {
  searchYouthUsers,
  sendContactRequest,
  getReceivedRequests,
  acceptContactRequest,
  rejectContactRequest,
  getContacts,
  deleteContact,
  getContactStats
} from "../controllers/ContactsController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Search youth users
router.get("/search", searchYouthUsers);

// Send contact request
router.post("/request", sendContactRequest);

// Get received requests
router.get("/requests/received", getReceivedRequests);

// Accept contact request
router.put("/requests/:id/accept", acceptContactRequest);

// Reject contact request
router.put("/requests/:id/reject", rejectContactRequest);

// Get contacts list
router.get("/", getContacts);

// Delete contact
router.delete("/:id", deleteContact);

// Get contact statistics
router.get("/stats", getContactStats);

export default router;
