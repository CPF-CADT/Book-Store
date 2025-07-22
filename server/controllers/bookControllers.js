import * as bookRepositories from "../Repositories/sqlBookRepositories.js";
export async function handleGetAllbooks(req,res) {
    try{
        const option =req.query;
        const result = await bookRepositories.getAllBook(option);
        res.status(200).json(result);
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'error',error:error.message});
    }
    
}
export async function getbookdetail(req,res) {
    try {
        const result = await bookRepositories.getbookdetail(req.params.bookId);
        res.status(200).json(result);

        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:error.message});
    }
    
}
export async function createBook(req,res) {
    try{
        const Book= req.body
        const userId = req.params.userId
        const result = await bookRepositories.createBooks(userId, Book);
        res.status(200).json(result);
    }catch(error){
        console.log(error);
        res.status(500).json({error:error.message});
    }
    
}
export async function updateBook(req,res) {
    try{
        const userId=req.params.userId;
        const bookId=req.params.bookId;
        const newBookdata=req.body;
        const result= await bookRepositories.updatebooks(userId,bookId,newBookdata);
        res.status(200).json(result);
    }catch(error){
        console.log(error);
        res.status(500).json({error:error.message});
    }
    
}
export async function deleteBooks(req, res) {
  try {
    const userId = req.params.userId;
    const idsQuery = req.query.ids;
    if (!idsQuery) {
      return res.status(400).json({ error: "Missing book IDs in query" });
    }
    const bookIds = idsQuery
      .split(",")
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id));
    if (bookIds.length === 0) {
      return res.status(400).json({ error: "No valid book IDs provided" });
    }
    const result = await bookRepositories.deleteBooks(userId, bookIds);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting books:", error.message);
    res.status(500).json({ error: error.message });
  }
}
