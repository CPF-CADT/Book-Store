import * as categoryServices from '../Repositories/sqlcategoriesRepositiories.js';


export async function handleGetAllCategories(req, res) {
  try {

    const options = req.query;
    const result = await categoryServices.getAllCategories(options);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function handleGetCategoryDetail(req, res) {
  try {
    const categoryId = req.params.id;
    const category = await categoryServices.getCategoryDetail(categoryId);
    res.status(200).json(category);
  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("is required")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "An unexpected server error occurred." });
  }
}


export async function handleCreateCategory(req, res) {
  try {
    const categoryData = req.body;
    const newCategory = await categoryServices.createCategory(categoryData);

    res.status(201).json(newCategory);
  } catch (error) {
    if (error.message.includes("required")) {
      return res.status(400).json({ message: error.message });
    }

    if (error.message.includes("already exists")) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}


export async function handleUpdateCategory(req, res) {
  try {
    const userId = req.user.id;
    const categoryId = req.params.id;
    const categoryData = req.body;

    const updatedCategory = await categoryServices.updateCategory(userId, categoryId, categoryData);
    res.status(200).json(updatedCategory);
  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("Authorization failed")) {
      return res.status(403).json({ message: error.message });
    }
     if (error.message.includes("already exists")) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

export async function handleDeleteCategory(req, res) {
  try {
    const userId = req.user.id;
    const idsQuery = req.query.ids;

    if (!idsQuery) {
      return res.status(400).json({ message: "Missing 'ids' query parameter. Please provide a comma-separated list of category IDs." });
    }
    const categoryIds = idsQuery
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    if (categoryIds.length === 0) {
      return res.status(400).json({ message: "No valid category IDs were provided." });
    }

    const result = await categoryServices.deleteCategory(userId, categoryIds);
    res.status(200).json(result);

  } catch (error) {
     if (error.message.includes("Authorization failed")) {
      return res.status(403).json({ message: error.message });
    }
     if (error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }
    console.error("Error deleting categories:", error.message);
    res.status(500).json({ message: error.message });
  }
}