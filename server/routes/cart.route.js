import { Router } from "express";
import CartController from "../controllers/cart.controller.js";
import { isAuthorized } from "../middleware/authMiddleware.js";
const cartRouter = Router();

cartRouter.get("/all", CartController.getCarts);
cartRouter.post("/add", isAuthorized, CartController.addToCart);

export default cartRouter;