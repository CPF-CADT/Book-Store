// import { Router } from "express";
// import {handleGetAllbooks,getbookdetail,createBook} from '../controllers/bookControllers.js';
// const route= Router();
// route.get('/',handleGetAllbooks);
// route.get('/:bookId',getbookdetail);


// export default route;


// const express = require('express');
import express from 'express';
const router = express.Router();
const { getAllBooks } = require('../controllers/BookController');

router.get('/', getAllBooks);

module.exports = router;
