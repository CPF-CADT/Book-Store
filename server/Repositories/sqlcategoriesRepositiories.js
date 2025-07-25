import { categories } from "../module/categoriesDb.js";
import { Users } from "../module/usersDb.js"; // Assuming you have a Users model for role checks

import { sequelizes } from "../utils/database.js";
import { Op } from "sequelize";


export async function getAllCategories(options = {}) {
  try {
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 15;
    const offset = (page - 1) * limit;
    const sortBy = options.sortBy || "sort_order";
    const sortOrder =
      options.sortOrder?.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const queryOptions = {
      attributes: [
        "id",
        "name",
        "slug",
        "description",
        "parent_id",
        "sort_order",
        "is_active",

      ],
      where: {},
      limit,
      offset,
      order: [[sortBy, sortOrder]],
      include: [
        {
          model: categories,
          as: "children",
          attributes: ["id", "name", "slug", "sort_order"],
        },
      ],
    };

    if (options.searchQuery) {
      queryOptions.where.name = {
        [Op.like]: `%${options.searchQuery}%`,
      };
    }

    if (options.isActive !== undefined) {
      queryOptions.where.is_active = options.isActive;
    }

    if (options.parentId !== undefined) {
      queryOptions.where.parent_id = options.parentId;
    }


    const { count, rows } = await categories.findAndCountAll(queryOptions);

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      categories: rows,
    };
  } catch (error) {
    console.error("Error fetching all categories:", error);
    throw new Error("Could not retrieve categories.");
  }
}

export async function getCategoryDetail(categoryId) {
  try {
    if (!categoryId) {
      throw new Error("Category ID is required.");
    }
    const category = await categories.findByPk(categoryId, {
      include: [
        {
          model: categories,
          as: "parent",
        },
        {
          model: categories,
          as: "children", 
        },
      ],
    });

    if (!category) {
      throw new Error("Category not found.");
    }

    return category;
  } catch (error) {
    console.error("Error fetching category detail:", error.message);
    throw error;
  }
}


export async function createCategory(categoryData) {
  const t = await sequelizes.transaction();
  try {
    if (!categoryData.name) {
      throw new Error("Category name is required.");
    }


    const newCategory = await categories.create(categoryData, {
      transaction: t,
    });

    await t.commit();
    return newCategory;
  } catch (error) {
    await t.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error(`A category with that name or slug already exists.`);
    }
    console.error("Error creating category:", error.message);
    throw error;
  }
}

export async function updateCategory(userId, categoryId, categoryData) {
  const t = await sequelizes.transaction();
  try {
    const user = await Users.findOne({
      where: { id: userId, role: { [Op.in]: ['admin', 'vendor'] } },
      transaction: t,
    });
    if (!user) {
      throw new Error("Authorization failed: User does not have permission.");
    }

    const category = await categories.findByPk(categoryId, { transaction: t });
    if (!category) {
      throw new Error("Category not found.");
    }

    
    await category.update(categoryData, { transaction: t });
    
    await t.commit();
    return category;
  } catch (error) {
    await t.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error(`A category with that name or slug already exists.`);
    }
    console.error("Error updating category:", error.message);
    throw error;
  }
}
export async function deleteCategory(userId, categoryIds) {
  const t = await sequelizes.transaction();
  try {
    const user = await Users.findOne({
      where: { id: userId, role: 'admin' },
      transaction: t,
    });
    if (!user) {
      throw new Error("Authorization failed: User does not have permission.");
    }
    
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      throw new Error("An array of category IDs is required.");
    }

    const numDeleted = await categories.destroy({
      where: { id: categoryIds },
      transaction: t,
    });

    if (numDeleted === 0) {
        throw new Error("No categories found with the provided IDs to delete.");
    }

    await t.commit();
    return { message: `${numDeleted} categor(y/ies) deleted successfully.` };
  } catch (error) {
    await t.rollback();
    console.error("Error deleting categories:", error.message);
    throw error;
  }
}