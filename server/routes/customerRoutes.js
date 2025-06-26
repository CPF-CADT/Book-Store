import { Router} from "express";
import { Updateprofile,getUserProfileDetail } from "../controllers/controllers.js";
const customer = Router();
customer.get ("/profile-detail/:id",getUserProfileDetail);
customer.put("/profile-detail/:id",Updateprofile);
export default customer;