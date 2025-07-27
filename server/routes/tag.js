import { Router } from "express";
import {
  handleGetAllTags,
  handleGetTagDetail,
  handleCreateTag,
  handleUpdateTag,
  handleDeleteTags,
} from "../controllers/tagController.js";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js";

const tagRoutes = Router();

tagRoutes.get("/", handleGetAllTags);

tagRoutes.get("/:id", handleGetTagDetail);

tagRoutes.post(
  "/",
  isAuthenticated,
  isAuthorized(["admin", "vendor"]),
  handleCreateTag
);

tagRoutes.patch(
  "/:id",
  isAuthenticated,
  isAuthorized(["admin", "vendor"]),
  handleUpdateTag
);

tagRoutes.delete(
  "/",
  isAuthenticated,
  isAuthorized(["admin"]),
  handleDeleteTags
);

export default tagRoutes;