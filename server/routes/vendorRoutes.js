import { Router} from "express";
import { Updateprofile,getUserProfileDetail,login,VendorSignUp } from "../controllers/controllers.js";
const vendor = Router();
vendor.get ("/profile-detail/:id",getUserProfileDetail);
vendor.put("/profile-detail/:id",Updateprofile);
vendor.post("/sign-up",VendorSignUp);
vendor.post("/login",login);
export default vendor;