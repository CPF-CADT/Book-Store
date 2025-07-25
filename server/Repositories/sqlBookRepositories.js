// file sqlbookrepo
import { Model } from "sequelize";
import { Books } from "../module/BookDb.js";
import { categories } from "../module/categoriesDb.js";
import { authors } from "../module/authorsDb.js";
import { Tags } from "../module/tagsDb.js";
import { Op } from "sequelize";
import { BookTags } from "../module/BooktagesDb.js";
import { publishers } from "../module/PublishersDb.js";
import { Users } from "../module/usersDb.js";
import sequelize from "sequelize";
import { sequelizes } from "../utils/database.js";
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

 
};
if (option.authorName) {
  const authorInclude = queryOptions.include.find(i => i.as === 'authors');
  if (authorInclude) {
    authorInclude.where = {
      name: {
        [Op.like]: `%${option.authorName}%`  // Matches anywhere in the name
      }
    };
    authorInclude.required = true; // Ensures INNER JOIN
  }
};
    if (option.tagName) {
      const tagInclude = queryOptions.include.find(i => i.as === 'tags');
      if (tagInclude) {
        tagInclude.where = {
          name: { [Op.like]: `%${option.tagName}%` }
        };
        // This is crucial: it ensures that only books with a matching tag are returned.
        tagInclude.required = true;
      }
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
    
export async function getbookdetail(bookid) {
  try {
  if(!bookid) throw new Error('error bookid catch');
  const book = await Books.findByPk(bookid,{
    attributes:{ exclude:["stock"]},
    include:[
      {
        model: categories,
        as: 'category',
        attributes:['name']
      },
      {
        model: publishers,
        as:'publisher',
        attributes:['name']
      }
    ]
  });
   if(!book) throw new Error('Book no found');
  return book;
 

    
  } catch (error) {
    console.log(error);
  }

};

export async function createBooks(UserId, Book) {
  const t = await sequelizes.transaction();
  try {
    // Correct usage of findOne
    const user = await Users.findOne({ where: { id: UserId, role: 'vendor'},transaction:t });
    if (!user) {
      throw new Error('Wrong User');
    }

    // Destructure Book object
    const {
      title,
      description,
      price,
      original_price,
      image_url,
      isbn,
      stock,
      category_id,
      publisher_id,
      pages_count,
      language,
      format,
      status,
      tag = [] // default to empty array if undefined
    } = Book;

    // Create book
    const newBook = await Books.create({
      title,
      description,
      price,
      original_price,
      image_url,
      isbn,
      stock,
      category_id,
      publisher_id,
      pages_count,
      language,
      format,
      status,
    }, {transaction:t});
    
    
    // Create tag entries if tags exist
    let bookTags = [];
    if (Array.isArray(tag) &&  tag.length>0) {
     const BookTagsCreate= await tag.map(tagId=>({
      book_id: newBook.id,
      tag_id: tagId
     }))
     bookTags= await BookTags.bulkCreate(BookTagsCreate,{transaction:t});

    }
   await t.commit();

    return {
      newBook,
      bookTags
    };

  } catch (error) {
    await t.rollback();
    console.error('Error creating book:', error.message);
    throw error;
  }
}
export async function updatebooks(userId, bookId, newBookData) {
  const t = await sequelizes.transaction();
  try {
    const user = await Users.findOne({ where: { id: userId, role: 'vendor' }, transaction: t });
    const book = await Books.findByPk(bookId, { transaction: t });

    if (!user) {
      throw new Error("Authorization failed: User does not have permission.");
    }
    if (!book) {
      throw new Error("Book not found.");
    }

    // Update book details
    await book.update(newBookData, { transaction: t });

    if (newBookData.tag && Array.isArray(newBookData.tag)) {
      await BookTags.destroy({ where: { book_id: book.id }, transaction: t });

      if (newBookData.tag.length > 0) {
        const bookTagsToCreate = newBookData.tag.map(tagId => ({
          book_id: book.id,
          tag_id: tagId
        }));
        await BookTags.bulkCreate(bookTagsToCreate, { transaction: t });
      }
    }

    await t.commit();
    const updatedBookWithAssociations = await Books.findByPk(book.id, {
        include: ['authors', 'tags', 'category']
    });
    return updatedBookWithAssociations;

  } catch (error) {
    await t.rollback();
    console.error('Error updating book:', error.message);
    throw error;
  }
}

export async function deleteBooks(userId, bookIds) {
  const t = await sequelizes.transaction();

  try {
    const user = await Users.findOne({
      where: { id: userId, role: 'vendor' },
      transaction: t
    });

    if (!user || !Array.isArray(bookIds) || bookIds.length === 0) {
      await t.rollback();
      return null;
    }
    const deleted = await Books.destroy({
      where: { id: bookIds },
      transaction: t
    });

    await t.commit();
    return { message: `${deleted} book deleted.` };

  } catch (error) {
    await t.rollback();
    console.error('Error deleting books:', error.message);
    throw error;
  }
}
