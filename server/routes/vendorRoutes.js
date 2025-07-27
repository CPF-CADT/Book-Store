import { Router } from "express";
import {
  Updateprofile,
  getUserProfileDetail,
  login,
  VendorSignUp,
  handleGetAllUsers,
  handleAdminCreateUser,
  
} from "../controllers/userControllers.js";
import { handleAdminDeleteUser } from "../Repositories/sqlUserRepositories.js";
import * as bookControllers from "../controllers/bookControllers.js";
import * as authorControllers from "../controllers/authorController.js";
import { isAuthenticated, isAuthorized } from "../middleware/authMiddleware.js";

const vendor = Router();
vendor.get(
  "/profile-detail/:id",
  isAuthenticated,
  isAuthorized(["vendor", "admin"]),
  getUserProfileDetail
);
vendor.put("/profile-detail/:id", Updateprofile);
vendor.post("/sign-up", VendorSignUp);
vendor.post("/login", login);

vendor.get('/users', handleGetAllUsers);
vendor.post('/users', handleAdminCreateUser);
vendor.put('/users/:id', getUserProfileDetail);
vendor.delete('/users/:id', handleAdminDeleteUser);
// book
// vendor.get("/:userId/book/:bookId", bookControllers.getbookdetail);
// vendor.get("/:userId/book", bookControllers.handleGetAllbooks);
// vendor.post("/:userId/book", bookControllers.createBook);
// vendor.patch("/:userId/book/:bookId", bookControllers.updateBook);
// vendor.delete("/:userId/book", bookControllers.deleteBooks);

// author
// vendor.get("/:userId/author", authorControllers.handleGetAllAuthors);
// vendor.get("/:userId/author/:id", authorControllers.handleGetAuthorDetail);
// vendor.post("/:userId/author", authorControllers.handleCreateAuthor);
// vendor.patch("/:userId/author/:authorId", authorControllers.handleUpdateAuthor);
// vendor.delete("/:userId/author", authorControllers.handleDeleteAuthor);

export default vendor;
