import { Router} from "express";
import { Updateprofile,getUserProfileDetail } from "../controllers/userControllers.js";
import * as bookControllers from '../controllers/bookControllers.js';
import * as authorControllers from '../controllers/authorController.js';

const customer = Router();
customer.get ("/profile-detail/:id",getUserProfileDetail);
customer.put("/profile-detail/:id",Updateprofile);
// book
customer.get("/:userId/book/:bookId",bookControllers.getbookdetail);
customer.get('/:userId/book',bookControllers.handleGetAllbooks);

// author
customer.get('/:userId/author',authorControllers.handleGetAllAuthors);
customer.get('/:userId/author/:id',authorControllers.handleGetAuthorDetail);
export default customer;