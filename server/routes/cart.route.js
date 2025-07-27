import { Router } from "express";
import CartController from "../controllers/cart.controller.js";
import CartMiddleware from "../middleware/cartMiddleware.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const cartRouter = Router();

cartRouter.get("/all", isAuthenticated, CartController.getCarts);
cartRouter.post("/add", [isAuthenticated, CartMiddleware.validateCart], CartController.addToCart);
cartRouter.put("/update", [isAuthenticated, CartMiddleware.validateCart], CartController.updateCart);
cartRouter.delete("/:id", isAuthenticated, CartController.deleteCart);

export default cartRouter;
