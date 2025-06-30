import { Router} from "express";
import { CustomerSignUp ,login,Updateprofile,getUserProfileDetail} from "../controllers/controllers.js";
const user = Router();
user.post("/sign-up",CustomerSignUp);
user.post ("/login",login);
user.get("/Profile-Detail/:id",getUserProfileDetail);
user.put("/Profile-Detail/:id",Updateprofile);

export default user;