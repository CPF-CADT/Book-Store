// server/controllers/authController.js
import bcrypt from 'bcrypt';
import { Users } from '../module/usersDb.js';

export const registerUser = async (req, res) => {
  const { first_name, last_name, email, password, phone } = req.body;

  if (!first_name || !last_name || !email || !password || !phone) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Users.create({
      first_name,
      last_name,
      email,
      password_hash: hashedPassword,
      phone,
    });

    res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

export async function handleGetAuthorDetail(req, res) {
  try {
    const authorId = req.params.id; 
    const author = await authorRepositories.getAuthorDetail(authorId);
    res.status(200).json(author);

  } catch (error) {
    if (error.message === "Author not found.") {
      res.status(404).json({ message: error.message });
    } else if (error.message === "Author ID is required.") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected server error occurred." });
    }
  }
}
export async function handleCreateAuthor(req,res) {
  try {
    const authorData= req.body;
    const result= await authorRepositories.createAuthor(authorData);
    res.status(200).json(result);
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};
export async function handleDeleteAuthor(req,res) {
  try {
    const userId = req.params.userId;
    const idsQuery = req.query.ids;
    if (!idsQuery) {
      return res.status(400).json({ error: "Missing Author IDs in query" });
    }
     const authorIds = idsQuery
          .split(",")
          .map((id) => parseInt(id))
          .filter((id) => !isNaN(id));
        if (authorIds.length === 0) {
          return res.status(400).json({ error: "No valid Author IDs provided" });
        }
        const result = await authorRepositories.deleteAuthor(userId, authorIds);
    
        res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting Author:", error.message);
    res.status(500).json({ error: error.message });
  }
  
}
export async function handleDeleteAuthor(req,res) {
  try {
    const userId = req.params.userId;
    const idsQuery = req.query.ids;
    if (!idsQuery) {
      return res.status(400).json({ error: "Missing Author IDs in query" });
    }
     const authorIds = idsQuery
          .split(",")
          .map((id) => parseInt(id))
          .filter((id) => !isNaN(id));
        if (authorIds.length === 0) {
          return res.status(400).json({ error: "No valid Author IDs provided" });
        }
        const result = await authorRepositories.deleteAuthor(userId, authorIds);
    
        res.status(200).json(result);
  } catch (error) {
     console.error("Error deleting Author:", error.message);
    res.status(500).json({ error: error.message });
  }
  
}
export async function handleDeleteAuthor(req,res) {
  try {
    const userId = req.params.userId;
    const idsQuery = req.query.ids;
    if (!idsQuery) {
      return res.status(400).json({ error: "Missing Author IDs in query" });
    }
     const authorIds = idsQuery
          .split(",")
          .map((id) => parseInt(id))
          .filter((id) => !isNaN(id));
        if (authorIds.length === 0) {
          return res.status(400).json({ error: "No valid Author IDs provided" });
        }
        const result = await authorRepositories.deleteAuthor(userId, authorIds);
    
        res.status(200).json(result);
  } catch (error) {
     console.error("Error deleting Author:", error.message);
    res.status(500).json({ error: error.message });
  }
  
}