import * as userRespositories from "../Repositories/sqlUserRepositories.js";
import jwt from "jsonwebtoken";
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
