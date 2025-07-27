import { Router } from "express";
import {
  handleGetAllAuthors,
  handleGetAuthorDetail,
  handleCreateAuthor,
  handleUpdateAuthor,
  handleDeleteAuthor,
} from "../controllers/authorController.js";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js";

const authorRoutes = Router();

// For anyone
authorRoutes.get("/", handleGetAllAuthors);
authorRoutes.get("/:id", handleGetAuthorDetail);

// For vendors and admins
authorRoutes.post(
  "/:userId",
  isAuthenticated,
  isAuthorized(["admin", "vendor"]),
  handleCreateAuthor
);
authorRoutes.patch(
  "/:userId/:authorId",
  isAuthenticated,
  isAuthorized(["admin", "vendor"]),
  handleUpdateAuthor
);
authorRoutes.delete(
  "/:userId/:ids",
  isAuthenticated,
  isAuthorized(["admin", "vendor"]),
  handleDeleteAuthor
);

export default authorRoutes;