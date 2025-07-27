import { publishers } from "../module/PublishersDb.js";
import { Users } from "../module/usersDb.js"; // For authorization checks
import { Books } from "../module/BookDb.js"; // To show associated books
import { sequelizes } from "../utils/database.js";
import { literal, Op } from "sequelize";

// Helper function to generate a URL-friendly slug from a name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with a single one
};


export async function getAllPublishers(options = {}) {
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
        "slug",
        "description",
        "website",
        "logo_url",
        "is_active",
        
        [
          literal(`(
            SELECT COUNT(*)
            FROM \`books\`
            WHERE \`books\`.\`publisher_id\` = \`publishers\`.\`id\`
          )`),
          "book_count",
        ],
      ],
      where: {},
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    };


    if (options.searchQuery) {
      queryOptions.where.name = {
        [Op.like]: `%${options.searchQuery}%`,
      };
    }

    if (options.isActive !== undefined) {
      queryOptions.where.is_active = options.isActive;
    }

    const { count, rows } = await publishers.findAndCountAll(queryOptions);

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      publishers: rows, 
    };
  } catch (error) {
    console.error("Error fetching all publishers:", error);
    throw new Error("Could not retrieve publishers.");
  }
}


export async function getPublisherDetail(publisherId) {
  try {
    if (!publisherId) {
      throw new Error("Publisher ID is required.");
    }
    const publisher = await publishers.findByPk(publisherId, {
      include: [

        {
          model: Books,
          as: 'books', 
          attributes: ['id', 'title', 'image_url', 'price']
        }
      ],
    });

    if (!publisher) {
      throw new Error("Publisher not found.");
    }

    return publisher;
  } catch (error) {
    console.error("Error fetching publisher detail:", error.message);
    throw error;
  }
}

export async function createPublisher(publisherData) {
  const t = await sequelizes.transaction();
  try {
    if (!publisherData.name) {
      throw new Error("Publisher name is required.");
    }


    if (!publisherData.slug) {
      publisherData.slug = generateSlug(publisherData.name);
    }

    const newPublisher = await publishers.create(publisherData, {
      transaction: t,
    });

    await t.commit();
    return newPublisher;
  } catch (error) {
    await t.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error(`A publisher with that name or slug already exists.`);
    }
    console.error("Error creating publisher:", error.message);
    throw error;
  }
}

export async function updatePublisher(userId, publisherId, publisherData) {
  const t = await sequelizes.transaction();
  try {
    const user = await Users.findOne({
      where: { id: userId, role: { [Op.in]: ['admin', 'vendor'] } },
      transaction: t,
    });
    if (!user) {
      throw new Error("Authorization failed: User does not have permission.");
    }

    const publisher = await publishers.findByPk(publisherId, { transaction: t });
    if (!publisher) {
      throw new Error("Publisher not found.");
    }
    if (publisherData.name && !publisherData.slug) {
      publisherData.slug = generateSlug(publisherData.name);
    }
    
    await publisher.update(publisherData, { transaction: t });
    
    await t.commit();
    return publisher;
  } catch (error) {
    await t.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error(`A publisher with that name or slug already exists.`);
    }
    console.error("Error updating publisher:", error.message);
    throw error;
  }
}
export async function deletePublisher(userId, publisherIds) {
  const t = await sequelizes.transaction();
  try {
    const user = await Users.findOne({
      where: { id: userId, role: 'admin' },
      transaction: t,
    });
    if (!user) {
      throw new Error("Authorization failed: User does not have permission.");
    }
    
    if (!Array.isArray(publisherIds) || publisherIds.length === 0) {
      throw new Error("An array of publisher IDs is required.");
    }

    const numDeleted = await publishers.destroy({
      where: { id: publisherIds },
      transaction: t,
    });

    if (numDeleted === 0) {
        throw new Error("No publishers found with the provided IDs to delete.");
    }

    await t.commit();
    return { message: `${numDeleted} publisher(s) deleted successfully.` };
  } catch (error) {
    await t.rollback();
    console.error("Error deleting publishers:", error.message);
    throw error;
  }
}