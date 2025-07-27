import * as publisherServices from '../Repositories/sqlPublishersRepositiories.js';
export async function handleGetAllPublishers(req, res) {
  try {
    const options = req.query; 
    const result = await publisherServices.getAllPublishers(options);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export async function handleGetPublisherDetail(req, res) {
  try {
    const publisherId = req.params.id; 
    const publisher = await publisherServices.getPublisherDetail(publisherId);
    res.status(200).json(publisher);
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
export async function handleCreatePublisher(req, res) {
  try {
    const publisherData = req.body;
    const newPublisher = await publisherServices.createPublisher(publisherData);
    res.status(201).json(newPublisher);
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
export async function handleUpdatePublisher(req, res) {
  try {
    const userId = req.user.id; 
    const publisherId = req.params.id;
    const publisherData = req.body;
    
    const updatedPublisher = await publisherServices.updatePublisher(userId, publisherId, publisherData);
    res.status(200).json(updatedPublisher);

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
export async function handleDeletePublisher(req, res) {
  try {
    const userId = req.user.id;
    const idsQuery = req.query.ids;

    if (!idsQuery) {
      return res.status(400).json({ message: "Missing 'ids' query parameter. Please provide a comma-separated list of publisher IDs." });
    }
    
    const publisherIds = idsQuery
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    if (publisherIds.length === 0) {
      return res.status(400).json({ message: "No valid publisher IDs were provided." });
    }

    const result = await publisherServices.deletePublisher(userId, publisherIds);
    res.status(200).json(result);

  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("Authorization failed")) {
      return res.status(403).json({ message: error.message });
    }
    console.error("Error deleting publishers:", error.message);
    res.status(500).json({ message: error.message });
  }
}