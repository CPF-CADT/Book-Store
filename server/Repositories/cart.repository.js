import { cartItems } from "../module/CartItemDb.js";
import { Users } from "../module/usersDb.js";
import { Books } from "../module/BookDb.js";


async function getCarts(u_id) {
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

async function addToCart(u_id, b_id, qty) {
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

export { getCarts, addToCart };