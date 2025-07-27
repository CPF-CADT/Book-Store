// server/controllers/bookControllers.js
import { Op } from 'sequelize';
import { Books, authors, publishers } from '../module/associations.js';

export async function handleGetAllbooks(req, res) {
  try {
    const {
      page = 1,
      limit = 12,
      sort = 'relevance',
      search,
      min: minPrice,
      max: maxPrice,
      brand, // This will be the publisher name
      material, // This will be the format (paperback, hardcover)
      availability, // This will be the status (active, inactive)
    } = req.query;

    const options = {
      where: {},
      include: [
        { model: authors, as: 'authors', attributes: ['name'], through: { attributes: [] } },
        { model: publishers, as: 'publisher', attributes: ['name'] }
      ],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    };

    // Filtering logic
    if (search) {
      options.where.title = { [Op.like]: `%${search}%` };
    }
    if (minPrice) {
      options.where.price = { ...options.where.price, [Op.gte]: parseFloat(minPrice) };
    }
    if (maxPrice) {
      options.where.price = { ...options.where.price, [Op.lte]: parseFloat(maxPrice) };
    }
    if (availability) {
      options.where.status = { [Op.in]: availability.split(',') };
    }
    if (material) {
      options.where.format = { [Op.in]: material.split(',') };
    }
    if (brand) {
      options.include[1].where = { name: { [Op.in]: brand.split(',') } };
    }
    
    // Sorting logic
    switch (sort) {
        case 'price_asc': options.order = [['price', 'ASC']]; break;
        case 'price_desc': options.order = [['price', 'DESC']]; break;
        case 'title_asc': options.order = [['title', 'ASC']]; break;
        case 'title_desc': options.order = [['title', 'DESC']]; break;
        case 'newest': options.order = [['create_at', 'DESC']]; break;
    }

    const { count, rows } = await Books.findAndCountAll(options);

    // Reformat books for the frontend
    const formattedBooks = rows.map(book => ({
        id: book.id,
        title: book.title,
        author: book.authors.map(a => a.name).join(', '),
        brand: book.publisher ? book.publisher.name : 'N/A',
        price: parseFloat(book.price),
        originalPrice: book.original_price ? parseFloat(book.original_price) : null,
        imageUrl: book.image_url,
        availability: book.status === 'active' ? 'In Stock' : 'Out of Stock',
        material: book.format
    }));

    res.status(200).json({ books: formattedBooks, total: count });

  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: 'Server error fetching books', error: error.message });
  }
}

export async function getFilterOptions(req, res) {
  try {
    const distinctFormats = await Books.findAll({ attributes: [[sequelizes.fn('DISTINCT', sequelizes.col('format')), 'format']] });
    const distinctPublishers = await publishers.findAll({ attributes: ['name'] });

    const filterData = {
      brand: distinctPublishers.map(p => ({ value: p.name, label: p.name })),
      material: distinctFormats.map(f => ({ value: f.format, label: f.format.charAt(0).toUpperCase() + f.format.slice(1) })),
      availability: [
        { value: 'active', label: 'In Stock' },
        { value: 'inactive', label: 'Out of Stock' },
      ],
    };

    res.status(200).json(filterData);
  } catch (error) {
    console.error("Error fetching filter options:", error);
    res.status(500).json({ message: "Failed to load filter options" });
  }
}