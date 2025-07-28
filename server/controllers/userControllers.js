import * as userRespositories from "../Repositories/sqlUserRepositories.js";
import bcrypt from "bcrypt";
import { Users } from "../module/usersDb.js";
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


export async function getUserProfileDetail(req, res) {
  try {

    const user = await userRespositories.getUserProfileDetail(req.params.id);


    res.status(200).json(user);

  } catch (err) {

    console.error("Error fetching user profile:", err.message); 


    if (err.message === "User not found") {

      res.status(404).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred on the server." });
    }
  }
}
export async function Updateprofile(req,res) {
  try{
    
    const user = await userRespositories.updateProfile(req.params.id,req.body);
    res.status(201).json(user);

  }catch(err){
    console.log("error",err);
    res.status(500).json({message :"Server error"});
  }
  
}
export async function handleGetAllUsers(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const { searchQuery, role } = req.query;

    const where = {};
    if (searchQuery) {
      where[Op.or] = [
        { first_name: { [Op.like]: `%${searchQuery}%` } },
        { last_name: { [Op.like]: `%${searchQuery}%` } },
        { email: { [Op.like]: `%${searchQuery}%` } },
      ];
    }
    if (role) {
      where.role = role;
    }

    const { count, rows } = await Users.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['password_hash'] }, 
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      users: rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users." });
  }
}
export async function handleAdminCreateUser(req, res) {
  const { first_name, last_name, email, password, role ,phone} = req.body;
  try {
    // Check if user already exists
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }
    
    const password_hash = await bcrypt.hash(password, 10);
    const newUser = await Users.create({ first_name, last_name, email, password_hash, role,phone });
    
    // Don't send back the password hash
    const userJson = newUser.toJSON();
    delete userJson.password_hash;
    
    res.status(201).json(userJson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user." });
  }
}

export async function countAllUsers(req, res) {
  try {
    const count = await Users.count();
    res.status(200).json({ totalUsers: count });
  } catch (error) {
    console.error("Error counting users:", error);
    res.status(500).json({ message: "Error counting users." });
  }
}