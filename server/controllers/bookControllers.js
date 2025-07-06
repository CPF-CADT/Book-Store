import * as bookRepositories from "../config/sqlBookRepositories.js";
export async function handleGetAllbooks(req,res) {
    try{
        const option =req.query;
        const result = await bookRepositories.getAllBook(option);
        res.status(200).json(result);
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'error',error:error});
    }
    
}