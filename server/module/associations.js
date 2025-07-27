// server/module/associations.js
import { Books } from './BookDb.js';
import { categories } from './categoriesDb.js';
import { publishers } from './PublishersDb.js';
import { authors } from './authorsDb.js';
import { BookAuthors } from './BookauthorsDb.js';
import { Users } from './usersDb.js';

// Book <-> Category
Books.belongsTo(categories, { foreignKey: 'category_id', as: 'category' });
categories.hasMany(Books, { foreignKey: 'category_id', as: 'books' });

// Book <-> Publisher
Books.belongsTo(publishers, { foreignKey: 'publisher_id', as: 'publisher' });
publishers.hasMany(Books, { foreignKey: 'publisher_id', as: 'books' });

// Book <-> Author (Many-to-Many)
Books.belongsToMany(authors, { through: BookAuthors, foreignKey: 'book_id', otherKey: 'author_id', as: 'authors' });
authors.belongsToMany(Books, { through: BookAuthors, foreignKey: 'author_id', otherKey: 'book_id', as: 'books' });

export { Books, categories, publishers, authors, BookAuthors, Users };