// server/routes/filters.js
import express from 'express';
import { Op } from 'sequelize';
// Import your models
import Book from '../module/BookDb.js';
import Category from '../module/categoriesDb.js';
import Publisher from '../module/PublishersDb.js';
import Author from '../module/authorsDb.js';
import Tag from '../module/tagsDb.js';

const router = express.Router();

// GET /api/filters - Get all available filter options dynamically from database
router.get('/', async (req, res) => {
  try {
    // Get all unique categories
    const categories = await Category.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']]
    });

    // Get all unique publishers (brands)
    const publishers = await Publisher.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']]
    });

    // Get all unique authors
    const authors = await Author.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']]
    });

    // Get all unique tags
    const tags = await Tag.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']]
    });

    // Get unique values from books table for other filters
    const uniqueBindingTypes = await Book.findAll({
      attributes: [[Book.sequelize.fn('DISTINCT', Book.sequelize.col('binding_type')), 'binding_type']],
      where: {
        binding_type: { [Op.not]: null }
      },
      raw: true
    });

    const uniqueCoverColors = await Book.findAll({
      attributes: [[Book.sequelize.fn('DISTINCT', Book.sequelize.col('cover_color')), 'cover_color']],
      where: {
        cover_color: { [Op.not]: null }
      },
      raw: true
    });

    // Build filter options in the format expected by your frontend
    const filterOptions = {
      productType: categories.map(category => ({
        value: category.name,
        label: category.name
      })),
      
      availability: [
        { value: 'In Stock', label: 'In Stock' },
        { value: 'Out of Stock', label: 'Out of Stock' },
        { value: 'Limited Stock', label: 'Limited Stock' }
      ],
      
      brand: publishers.map(publisher => ({
        value: publisher.name,
        label: publisher.name
      })),
      
      color: uniqueCoverColors.map(item => ({
        value: item.cover_color,
        label: item.cover_color
      })).filter(item => item.value), // Remove null values
      
      material: uniqueBindingTypes.map(item => ({
        value: item.binding_type,
        label: item.binding_type
      })).filter(item => item.value), // Remove null values

      // Additional filters you might want
      authors: authors.map(author => ({
        value: author.name,
        label: author.name
      })),
      
      tags: tags.map(tag => ({
        value: tag.name,
        label: tag.name
      }))
    };

    res.status(200).json(filterOptions);
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ 
      message: 'Failed to fetch filters', 
      error: error.message 
    });
  }
});

// GET /api/filters/price-range - Get min and max price range
router.get('/price-range', async (req, res) => {
  try {
    const priceRange = await Book.findOne({
      attributes: [
        [Book.sequelize.fn('MIN', Book.sequelize.col('price')), 'minPrice'],
        [Book.sequelize.fn('MAX', Book.sequelize.col('price')), 'maxPrice']
      ],
      raw: true
    });

    res.status(200).json({
      minPrice: parseFloat(priceRange.minPrice) || 0,
      maxPrice: parseFloat(priceRange.maxPrice) || 100
    });
  } catch (error) {
    console.error('Error fetching price range:', error);
    res.status(500).json({ 
      message: 'Failed to fetch price range', 
      error: error.message 
    });
  }
});

export default router;