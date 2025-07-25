import jwt from "jsonwebtoken";
import { Users } from "../module/usersDb.js"; 

export const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication failed: No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findByPk(decoded.id, {
        attributes: ['id', 'role'] 
    });

    if (!user) {
        return res.status(401).json({ message: 'Authentication failed: User not found.' });
    }

    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: "Authentication failed: Invalid token." });
    }
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Authentication failed: Token has expired." });
    }
    console.error("Authentication middleware error:", error);
    return res.status(500).json({ message: "An internal server error occurred." });
  }
};

export const isAuthorized = (allowedRoles) => {
  return (req, res, next) => {
   
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        message: "Forbidden: User role not available. Ensure you are authenticated first.",
      });
    }

    const userRole = req.user.role;

    if (allowedRoles.includes(userRole)) {
   
      next();
    } else {
      return res.status(403).json({
        message: "Forbidden: You do not have the necessary permissions to perform this action.",
      });
    }
  };
};