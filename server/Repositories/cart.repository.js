import { cartItems } from "../module/CartItemDb.js";
import { Users } from "../module/usersDb.js";
import { Books } from "../module/BookDb.js";


async function getCart(u_id) {
  const usr = await Users.findByPk(u_id, { include: [{ model: cartItems, include: [{ model: Books }] }] });
  if (!usr) {
    throw new Error("User not found");
  }

  return usr.toJSON();
}

async function addToCart(u_id, b_id, qty) {
  
}
try {
  await getCart(1);
  
} catch (error) {
  
}
console.log("Hello");

export { getCart, addToCart };