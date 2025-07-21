import { Router} from "express";
import { Updateprofile,getUserProfileDetail,login,VendorSignUp } from "../controllers/controllers.js";
import * as bookrepo from '../controllers/bookControllers.js';
const vendor = Router();
vendor.get ("/profile-detail/:id",getUserProfileDetail);
vendor.put("/profile-detail/:id",Updateprofile);
vendor.post("/sign-up",VendorSignUp);
vendor.post("/login",login);
// book
vendor.get("/:userId/book/:bookId",bookrepo.getbookdetail);
vendor.get('/:userId/book',bookrepo.handleGetAllbooks);
vendor.post('/:userId/book',bookrepo.createBook);
vendor.patch('/:userId/book/:bookId',bookrepo.updateBook);
vendor.delete('/:userId/book',bookrepo.deleteBooks);
export default vendor;