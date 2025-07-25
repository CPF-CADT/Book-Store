import { Tags } from "../module/tagsDb.js";
import { Books } from "../module/BookDb.js";
import { Users } from "../module/usersDb.js";
import { sequelizes } from "../utils/database.js";
import { literal, Op } from "sequelize";

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export async function getAllTags(options = {}) {
  try {
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 15;
    const offset = (page - 1) * limit;
    const sortBy = options.sortBy || "name";
    const sortOrder = options.sortOrder?.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const queryOptions = {
      attributes: [
        "id",
        "name",
        "slug",
        [
          literal(`(
            SELECT COUNT(*)
            FROM \`bookTags\`
            WHERE \`bookTags\`.\`tag_id\` = \`Tags\`.\`id\`
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
        [Op.like]: `%${options.searchQuery}%`,
      };
    }

    if (sortBy === "book_count") {
      queryOptions.order.push([literal("book_count"), sortOrder]);
    } else {
      queryOptions.order.push([sortBy, sortOrder]);
    }

    const { count, rows } = await Tags.findAndCountAll(queryOptions);

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      tags: rows,
    };
  } catch (error) {
    console.error("Error fetching all tags:", error);
    throw new Error("Could not retrieve tags.");
  }
}

export async function getTagDetail(tagId) {
  try {
    if (!tagId) {
      throw new Error("Tag ID is required.");
    }
    const tag = await Tags.findByPk(tagId, {
      include: [
        {
          model: Books,
          as: "books",
          attributes: ["id", "title", "price", "image_url"],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found.");
    }

    return tag;
  } catch (error) {
    console.error("Error fetching tag detail:", error.message);
    throw error;
  }
}

export async function createTag(tagData) {
  const t = await sequelizes.transaction();
  try {
    if (!tagData.name) {
      throw new Error("Tag name is required.");
    }

    if (!tagData.slug) {
      tagData.slug = generateSlug(tagData.name);
    }

    const newTag = await Tags.create(tagData, { transaction: t });

    await t.commit();
    return newTag;
  } catch (error) {
    await t.rollback();
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new Error(`A tag with that name or slug already exists.`);
    }
    console.error("Error creating tag:", error.message);
    throw error;
  }
}

export async function updateTag(userId, tagId, tagData) {
  const t = await sequelizes.transaction();
  try {
    const user = await Users.findOne({
      where: { id: userId, role: { [Op.in]: ["admin", "vendor"] } },
      transaction: t,
    });
    if (!user) {
      throw new Error("Authorization failed: User does not have permission.");
    }

    const tag = await Tags.findByPk(tagId, { transaction: t });
    if (!tag) {
      throw new Error("Tag not found.");
    }

    if (tagData.name && !tagData.slug) {
      tagData.slug = generateSlug(tagData.name);
    }

    await tag.update(tagData, { transaction: t });
    await t.commit();
    return tag;
  } catch (error) {
    await t.rollback();
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new Error(`A tag with that name or slug already exists.`);
    }
    console.error("Error updating tag:", error.message);
    throw error;
  }
}

export async function deleteTags(userId, tagIds) {
  const t = await sequelizes.transaction();
  try {
    const user = await Users.findOne({
      where: { id: userId, role: "admin" },
      transaction: t,
    });
    if (!user) {
      throw new Error("Authorization failed: User does not have permission.");
    }

    if (!Array.isArray(tagIds) || tagIds.length === 0) {
      throw new Error("An array of tag IDs is required for deletion.");
    }

    const numDeleted = await Tags.destroy({
      where: { id: tagIds },
      transaction: t,
    });

    if (numDeleted === 0) {
      throw new Error("No tags found with the provided IDs to delete.");
    }

    await t.commit();
    return { message: `${numDeleted} tag(s) deleted successfully.` };
  } catch (error) {
    await t.rollback();
    console.error("Error deleting tags:", error.message);
    throw error;
  }
}