import { Router } from "express";
import {
  handleGetAllPublishers,
  handleGetPublisherDetail,
  handleCreatePublisher,
  handleUpdatePublisher,
  handleDeletePublisher,
} from "../controllers/PublisherController.js";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js";

const publisherRoutes = Router();



// 1. PUBLIC ROUTES 


// GET /publishers -> Get a paginated list of all publishers
publisherRoutes.get("/", handleGetAllPublishers);

// GET /publishers/:id -> Get details for a single publisher
publisherRoutes.get("/:id", handleGetPublisherDetail);


// 2. PROTECTED MANAGEMENT ROUTES 


// POST /publishers -> Create a new publisher
publisherRoutes.post(
  "/", // The path is just '/', no userId is needed
  isAuthenticated,
  isAuthorized(["admin", "vendor"]),
  handleCreatePublisher
);


publisherRoutes.put(
  "/:id", 
  isAuthenticated,
  isAuthorized(["admin", "vendor"]),
  handleUpdatePublisher
);


publisherRoutes.delete(
  "/", 
  isAuthenticated,
  isAuthorized(["admin"]), 
  handleDeletePublisher
);


export default publisherRoutes;