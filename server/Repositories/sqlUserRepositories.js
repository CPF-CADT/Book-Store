import { Users } from "../module/usersDb.js";// Updated to use Users model
import { reviews } from "../module/reviewsDb.js"; // Updated import path
import { cartItems } from "../module/CartItemDb.js"; // Updated import path
import { Books } from "../module/BookDb.js";// Adjust path to your Book model
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Customer Sign-up function
export async function handleAdminDeleteUser(req, res) {
  const { id } = req.params;
  try {
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    // Prevent admin from deleting themselves
    // if (user.id === req.user.id) {
    //    return res.status(403).json({ message: "Cannot delete your own account." });
    // }
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user." });
  }
};
export async function signUp(userData,role) {
  const { email, password, first_name, last_name, phone } = userData;

  // Validate required fields
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    // Check if email already exists
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    // Hash the password
    const password_hash = await bcrypt.hash(password, 10);

    // Create new user with default role "customer"
    const newUser = await Users.create({
      email,
      password_hash,
      first_name,
      last_name,
      phone,
      role: role, // Default role
      is_active: true,
      email_verified: false,
    });

    // Return user data (excluding password_hash)
    return {
      id: newUser.id,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      phone: newUser.phone,
      role: newUser.role,
      is_active: newUser.is_active,
      email_verified: newUser.email_verified,
      created_at: newUser.created_at,
    };
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  }
}
// Vendor Sign up


// Login function
export async function login({ email, password }) {
  // Validate required fields
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    // Find user by email
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      throw new Error("Invalid email ");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error("Invalid  password");
    }

    // Check if user is active
    if (!user.is_active) {
      throw new Error("Account is deactivated");
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" });

    // Return user data (excluding password_hash)
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      role: user.role,
      is_active: user.is_active,
      email_verified: user.email_verified,
      created_at: user.created_at,
      token: token,
    };
  } catch (error) {
    console.error("Error during login:", error.message);
    throw error;
  }
}

// Get user profile details
export async function getUserProfileDetail(id) {
  const user = await Users.findByPk(id, {
    attributes: { exclude: ["password_hash"] },
    include: [
      {
        model: reviews,
        as: "reviews",
        include: [{ model: Books, as: "book" }],
      },
      {
        model: cartItems,
        as: "cartItems",
        include: [{ model: Books, as: "book" }],
      },
    ],
  });

  if (!user) {
    // This error will be caught by the controller's try...catch block
    throw new Error("User not found");
  }

  return user.toJSON();
}

// Update user profile
export async function updateProfile(id, userData={}) {
  const { password, first_name, last_name, phone } = userData;

  try {
    // Find user
    const user = await Users.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }

    // Prepare update data
    const updateData = {};

    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (phone !== undefined) updateData.phone = phone;

    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      return user.toJSON();
    }

    // Perform the update
    const [affectedRows] = await Users.update(updateData, {
      where: { id },
    });

    if (affectedRows === 0) {
      throw new Error("No changes made or user not found");
    }

    // Return updated user without password
    const updatedUser = await Users.findByPk(id, {
      attributes: { exclude: ["password_hash"] },
    });
    console.log(userData);

    return updatedUser.toJSON();
  } catch (error) {
    console.error("Error updating profile:", error.message);
    throw error;
  }
}
