import { Router} from "express";
import { Updateprofile,getUserProfileDetail } from "../controllers/controllers.js";
const vendor = Router();
vendor.get ("/profile-detail/:id",getUserProfileDetail);
vendor.put("/profile-detail/:id",Updateprofile);
export default vendor;