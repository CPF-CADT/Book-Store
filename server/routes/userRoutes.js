import { Router} from "express";
import { CustomerSignUp ,login,Updateprofile,getUserProfileDetail} from "../controllers/userControllers.js";
const user = Router();
user.post("/sign-up",CustomerSignUp);
user.post ("/login",login);
user.get("/Profile-Detail/:id",getUserProfileDetail);
user.put("/Profile-Detail/:id",Updateprofile);
// book

export default user;