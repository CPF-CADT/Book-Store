import { Router} from "express";
import { CustomerSignUp ,login,Updateprofile,getUserProfileDetail,handleGetAllUsers} from "../controllers/userControllers.js";
const user = Router();
user.post("/sign-up",CustomerSignUp);
user.post ("/login",login);
user.get("/profile-detail/:id",getUserProfileDetail);
user.put("/profile-detail/:id",Updateprofile);
// user.get ("/",handleGetAllUsers);
// book

export default user;