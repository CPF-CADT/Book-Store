import { Router } from "express";
import CartController from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.get("/all", CartController.getCarts);
cartRouter.post("/add", CartController.addToCart);

export default cartRouter;