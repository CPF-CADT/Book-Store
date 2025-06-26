import * as userRespositories from "../config/sqlUserRepositories.js";
export async function sign_up(req, res) {
  try {
    const newUser = await userRespositories.sign_up(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating User:", error);
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
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: "Invalid id" });
    }
  } catch (err) {
    console.log("Error login:", err);
    res.status(500).json({ message: "Server error" });
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
