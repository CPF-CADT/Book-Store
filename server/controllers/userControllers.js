import * as userRespositories from "../Repositories/sqlUserRepositories.js";
// server/controllers/userController.js
import bcrypt from 'bcrypt';
// import { Users } from '../module/associations.js'; // Use centralized associations
import * as userRepositories from '../Repositories/sqlUserRepositories.js';

// This is your new register function
export const handleRegister = async (req, res) => {
  const { first_name, last_name, email, password, phone } = req.body;
  if (!first_name || !email || !password) {
    return res.status(400).json({ success: false, message: 'First name, email, and password are required.' });
  }
  try {
    const existingUser = await userRepositories.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { first_name, last_name, email, password_hash: hashedPassword, phone };
    const newUser = await userRepositories.createUser(userData);
    res.status(201).json({ success: true, message: 'User registered successfully!', user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// This is your new login function
export const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }
  try {
    const user = await userRepositories.findUserByEmail(email);
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { id: user.id, email: user.email, first_name: user.first_name }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// --- Your other existing user functions can remain below ---
export async function CustomerSignUp(req, res) {
  try {
    const newUser = await userRespositories.signUp(req.body,'customer');
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating Customer:", error);
    res.status(500).json({ message: "Server error" });
  }
}
export async function VendorSignUp(req, res) {
  try {
    const newUser = await userRespositories.signUp(req.body,'vendor');
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating Vendor:", error);
    res.status(500).json({ message: "Server error" });
  }
}
export async function login(req, res) {
  try {
    const user = await userRespositories.login(req.body);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.log("Error login:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// Corrected Controller
export async function getUserProfileDetail(req, res) {
  try {
    // Call the repository. If it succeeds, 'user' will be a valid object.
    const user = await userRespositories.getUserProfileDetail(req.params.id);

    // If the line above didn't throw an error, we know we found the user.
    res.status(200).json(user);

  } catch (err) {
    // Now, we inspect the error inside the catch block.
    console.error("Error fetching user profile:", err.message); // More accurate log

    // Check if it's the specific "not found" error from our repository.
    if (err.message === "User not found") {
      // Send a 404 Not Found response.
      res.status(404).json({ message: err.message });
    } else {
      // For all other unexpected errors, send a 500 Server Error.
      res.status(500).json({ message: "An unexpected error occurred on the server." });
    }
  }
}
export async function Updateprofile(req,res) {
  try{
    
    const user = await userRespositories.Updateprofile(req.params.id,req.body);
    res.status(201).json(user);

  }catch(err){
    console.log("error",err);
    res.status(500).json({message :"Server error"});
  }
  
}
