import { Model } from "sequelize";
import { Books } from "../module/BookDb.js";
import { categories } from "../module/categoriesDb.js";
import { authors } from "../module/authorsDb.js";
import { Tags } from "../module/tagsDb.js";
import { Op } from "sequelize";
import { BookTags } from "../module/BooktagesDb.js";
// export async function getbookdetail(Bookid) {
    
// }


/**
 * Fetches a paginated, filtered, and sorted list of books.
 * This is the main function for browsing the bookstore.
 *
 * @param {object} options - The query options.
 * @param {number} [options.page=1] - The current page number for pagination.
 * @param {number} [options.limit=12] - The number of items per page.
 * @param {string} [options.sortBy='create_at'] - The field to sort by (e.g., 'price', 'rating', 'create_at').
 * @param {string} [options.sortOrder='DESC'] - The sort order ('ASC' or 'DESC').
 * @param {number} [options.categoryId] - The ID of the category to filter by.
 * @param {number} [options.authorId] - The ID of the author to filter by.
 * @param {number} [options.tagId] - The ID of the tag to filter by.
 * @param {number} [options.minPrice] - The minimum price for a price range filter.
 * @param {number} [options.maxPrice] - The maximum price for a price range filter.
 * @param {string} [options.searchQuery] - A search term to match against book titles and descriptions.
 * @returns {Promise<object>} An object containing the list of books and pagination metadata.
 */
export async function getAllBook( option ={} ) {
    try{
    const pages= parseInt(option.page,10) ||1;
    const limit=parseInt(option.limit,10) || 12;
    const offset=(pages-1)*limit;
    const sortBy =option.sortBy || 'create_at';
    const sortOrder=option.sortOrder || 'desc';

    const queryOptions={
        where:{},
        include:[
            {model:categories,as:"category",attributes:['id','name','slug']},
            {model:authors,as:'authors',attributes:['id','name'],through:{ attributes:[]}},
            {model:Tags,as:'tags',attributes:['id','name','slug'],through:{ attributes:[]}},
        ],
        limit,
        offset,
        order: [],
        distinct:true,// Important for when filtering on many-to-many includes
    };
    if(option.categoryId){
        queryOptions.where.category_id=option.categoryId;
    };
    if(option.minPrice && option.maxPrice){
        queryOptions.where.price={
            [Op.between]:[option.minPrice,option.maxPrice]
        };
        };
if (option.searchQuery) {
  queryOptions.where[Op.or] = [
    { title: { [Op.like]: `%${option.searchQuery}%` } },
    { description: { [Op.like]: `%${option.searchQuery}%` } }
  ];

//   const authorInclude = queryOptions.include.find(i => i.as === 'authors');
//   if (authorInclude) {
//     authorInclude.where = {
//       name: { [Op.like]: `%${option.searchQuery}%` }
//     };
//     // Do NOT set authorInclude.required = true;
//   }

//   const tagInclude = queryOptions.include.find(i => i.as === 'tags');
//   if (tagInclude) {
//     tagInclude.where = {
//       name: { [Op.like]: `%${option.searchQuery}%` }
//     };
//     // Do NOT set tagInclude.required = true;
//   }
};
    //  // -- Filters on included (JOINED) tables --
if (option.sortBy) {
  if (option.sortBy.includes('.')) {
    const [association, column] = option.sortBy.split('.');
    const associationModel = queryOptions.include.find(i => i.as === association);
    if (associationModel) {
      queryOptions.order.push([associationModel.model, column, option.sortOrder.toUpperCase()]);
    } else {
      queryOptions.order.push([option.sortBy, option.sortOrder.toUpperCase()]);
    }
  } else {
    queryOptions.order.push([option.sortBy, option.sortOrder.toUpperCase()]);
  }
} else {
  queryOptions.order.push(['create_at', 'DESC']);
}


 const { count, rows } = await Books.findAndCountAll(queryOptions);
  const totalPages = Math.ceil(count / limit);
  const currentPage = pages; 

  return {
    totalItems: count,
    totalPages,
    currentPage,
    books: rows,
  };
}catch(error){
    console.error("Error fetching all books:", error);
    throw new Error("Could not retrieve books.");

}

    }
