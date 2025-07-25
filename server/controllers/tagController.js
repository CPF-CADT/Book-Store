import * as tagRepository from '../Repositories/sqltagsRepositiories.js';

export async function handleGetAllTags(req, res) {
  try {
    const options = req.query;
    const result = await tagRepository.getAllTags(options);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function handleGetTagDetail(req, res) {
  try {
    const tagId = req.params.id;
    const tag = await tagRepository.getTagDetail(tagId);
    res.status(200).json(tag);
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

export async function handleCreateTag(req, res) {
  try {
    const tagData = req.body;
    const newTag = await tagRepository.createTag(tagData);
    res.status(201).json(newTag);
  } catch (error) {
    if (error.message.includes("is required")) {
      return res.status(400).json({ message: error.message });
    }
    if (error.message.includes("already exists")) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

export async function handleUpdateTag(req, res) {
  try {
    const userId = req.user.id;
    const tagId = req.params.id;
    const tagData = req.body;
    const updatedTag = await tagRepository.updateTag(userId, tagId, tagData);
    res.status(200).json(updatedTag);
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

export async function handleDeleteTags(req, res) {
  try {
    const userId = req.user.id;
    const idsQuery = req.query.ids;

    if (!idsQuery) {
      return res.status(400).json({ message: "Missing 'ids' query parameter. Please provide a comma-separated list of tag IDs." });
    }

    const tagIds = idsQuery
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    if (tagIds.length === 0) {
      return res.status(400).json({ message: "No valid tag IDs were provided." });
    }

    const result = await tagRepository.deleteTags(userId, tagIds);
    res.status(200).json(result);

  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("Authorization failed")) {
      return res.status(403).json({ message: error.message });
    }
    console.error("Error deleting tags:", error.message);
    res.status(500).json({ message: error.message });
  }
}