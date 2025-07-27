import { cartItems } from "../module/CartItemDb.js";
import { Users } from "../module/usersDb.js";
import { Books } from "../module/BookDb.js";

class CartRepository {
  static async getCarts(u_id) {
    // const cart = await Users.findByPk(u_id, { include: [{ model: cartItems, as: 'cartItems', include: [{ model: Books, as: 'book' }] }] });
    const cart = await cartItems.findAll({
      where: { user_id: u_id },
      include: [{ model: Books, as: 'book', attributes: ['title', 'price'] }]
    });
    if (!cart) {
      throw new Error("User not found");
    }
  
    return { 
      user_id: u_id,
      cart: cart.map((item) => item.toJSON())
    };
  }
  
  static async addToCart(u_id, b_id, qty) {
    const [cart, created] = await cartItems.findOrCreate({
      where: { user_id: u_id, book_id: b_id },
      defaults: { quantity: qty }
    });
  
    if (!created) {
      cart.quantity += qty;
      cart.save();
    }
    return cart.toJSON();
  }
  
  static async updateCart(u_id, b_id, qty) {
    const cart = await cartItems.findAll({ where: { user_id: u_id, book_id: b_id } });
  
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.quantity = qty;
    cart.save();
    
    return cart.toJSON();
  }
  
  static async deleteCart(u_id, b_id) {
    const cart = await cartItems.findAll({ where: { user_id: u_id, book_id: b_id } });

    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.destroy();

    return cart.toJSON();
  }
}

export default CartRepository;