import * as authorRepositories from '../Repositories/sqlAuthorsRepositiories.js';

export async function handleGetAllAuthors(req, res) {
  try {
    const options = req.query; 
    const result = await authorRepositories.getAllAuthors(options);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export async function handleGetAuthorDetail(req, res) {
  try {
    const authorId = req.params.id; 
    const author = await authorRepositories.getAuthorDetail(authorId);
    res.status(200).json(author);

  } catch (error) {
    if (error.message === "Author not found.") {
      res.status(404).json({ message: error.message });
    } else if (error.message === "Author ID is required.") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected server error occurred." });
    }
  }
}
export async function handleCreateAuthor(req,res) {
  try {
    const authorData= req.body;
    const result= await authorRepositories.createAuthor(authorData);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
  
}
export async function handleUpdateAuthor(req,res) {
  try {
    const UserId= req.params.userId;
    const AuthorId=req.params.authorId;
    const AuthorData= req.body;
    const result= await authorRepositories.updateAuthor(UserId,AuthorId,AuthorData);
    res.status(200).json(result);

  } catch (error) {
    console.log(error);
  }
  
}