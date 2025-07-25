import { authors } from "../module/authorsDb.js";
import { Books } from "../module/BookDb.js";
import { Users } from "../module/usersDb.js";
import { sequelizes } from "../utils/database.js";
import { literal, Op } from "sequelize";
export async function getAllAuthors(options = {}) {
  try {
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 15;
    const offset = (page - 1) * limit;
    const sortBy = options.sortBy || "name";
    const sortOrder =
      options.sortOrder?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const queryOptions = {
      attributes: [
        "id",
        "name",
        "photo_url",
        "nationality",
        [
          literal(`(
        SELECT COUNT(*)
        FROM \`bookAuthors\`
        WHERE \`bookAuthors\`.\`author_id\` = \`authors\`.\`id\`
      )`),
          "book_count",
        ],
      ],
      where: {},
      limit,
      offset,
      order: [],
    };
    if (options.searchQuery) {
      queryOptions.where.name = {
        [Op.iLike]: `%${options.searchQuery}%`,
      };
    }
    if (options.nationality) {
      queryOptions.where.nationality = {
        [Op.iLike]: `%${options.nationality}%`,
      };
    }
    if (sortBy === "book_count") {
      queryOptions.order.push([literal("book_count"), sortOrder]);
    } else {
      queryOptions.order.push([sortBy, sortOrder]);
    }

    const { count, rows } = await authors.findAndCountAll(queryOptions);

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      authors: rows,
    };
  } catch (error) {
    console.error("Error fetching all authors:", error);
    throw new Error("Could not retrieve authors.");
  }
};
export async function getAuthorDetail(authorId) {
  try {
    if (!authorId) {
      throw new Error("Author ID is required.");
    }
    const author = await authors.findByPk(authorId, {
      include: [
        {
          model: Books,
          as: "books",
          attributes: ["id", "title", "price", "image_url", "rating"],

          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!author) {
      throw new Error("Author not found.");
    }

    return author;
  } catch (error) {
    console.error("Error fetching author detail:", error.message);

    throw error;
  }
}

export async function createAuthor(authorData) {
  const t = await sequelizes.transaction();

  try {
    if (!authorData.name) {
      throw new Error("Author name is required.");
    }
    const { bookId, role } = authorData;
    const newAuthor = await authors.create(authorData, { transaction: t });

    await t.commit();
    return {newAuthor};

  } catch (error) {
    await t.rollback();
    console.error("Error creating author:", error.message);
    throw error;
  }
}
export async function updateAuthor(UserId,authorId,authorData) {
  const t = await sequelizes.transaction();
  try {
    const user= await Users.findOne({where:{id:UserId,role:"vendor"},transaction:t});
    const author= await authors.findOne({where:{id:authorId},transaction:t});
    if(!user || !author ) return  await t.rollback();
    const authorUpdate= await  author.set(authorData,{transaction:t});
    await author.save({transaction:t});
    await t.commit
    return author
  } catch (error) {
    t.rollback();
    console.log(error);
  }
  
}
export async function deleteAuthor(UserId,authorIds) {
  const t= await sequelizes.transaction();

  try {
        const user= await Users.findOne({where:{id:UserId,role:"vendor"},transaction:t});
if(!user || !Array.isArray(authorIds) || authorIds.length === 0)  { await t.rollback() ;return null ;}
    const deletedAuthor = await authors.destroy({
      where:{id:authorIds},
      transaction:t
    })
       await t.commit();
    return { message: `${deletedAuthor} Author deleted.` };
  } catch (error) {
  await t.rollback();
  console.error('Error deleting Author:', error.message);
  throw error;
  }
  
}
