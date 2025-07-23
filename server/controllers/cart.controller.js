import CartRepository from "../Repositories/cart.repository.js";

class CartController {
  static async getCarts(req, res) {
    const userId = req.user.id;

    try {
      const cart = await CartRepository.getCarts(userId);

      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user cart" });
    }
  }

  static async addToCart(req, res) {
    const userId = req.user.id;
    const { bookId, quantity } = req.query;

    try {
      const cart = await CartRepository.addToCart(userId, bookId, quantity);

      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ error: "Failed to add cart" });
    }
  }
};

export default CartController;