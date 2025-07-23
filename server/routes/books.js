import { Router } from "express";
import {handleGetAllbooks,getbookdetail,createBook} from '../controllers/bookControllers.js';
const route= Router();
route.get('/',handleGetAllbooks);
route.get('/:bookId',getbookdetail);


export default route;