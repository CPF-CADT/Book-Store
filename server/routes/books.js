import { Router } from "express";
import {handleGetAllbooks} from '../controllers/bookControllers.js';
const route= Router();
route.get('/',handleGetAllbooks);
export default route;