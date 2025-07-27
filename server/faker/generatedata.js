// --- START OF FILE generatedata.js ---

import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

import { sequelizes } from "../utils/database.js";
import { Users } from '../module/usersDb.js';
import { Books } from '../module/BookDb.js';
import {reviews} from '../module/reviewsDb.js';
import {authors} from '../module/authorsDb.js';
import {BookAuthors} from '../module/BookauthorsDb.js'
import { categories } from '../module/categoriesDb.js';
import { publishers } from '../module/PublishersDb.js';
import { Tags } from '../module/tagsDb.js';
import{BookTags} from '../module/BooktagesDb.js';
import {cartItems} from '../module/CartItemDb.js';
import { BlogPost } from '../module/BlogPost.js'; 


const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomSubset = (arr, count) => faker.helpers.arrayElements(arr, { min: 1, max: count });

// --- Data Generation Functions ---

async function createUsers(count) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const password_hash = await bcrypt.hash('password123', 10); // Use a standard password for all fake users
    users.push({
      email: faker.internet.email(),
      password_hash,
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      phone: faker.phone.number('0#######'),
      role: faker.helpers.arrayElement(['customer', 'vendor']),
      is_active: true,
      email_verified: true,
    });
  }
  return Users.bulkCreate(users);
}
async function createBlogPosts(count, allUsers) {
  const posts = [];
  for (let i = 0; i < count; i++) {
    const title = faker.lorem.sentence({ min: 5, max: 10 });
    const content = `<h2>${faker.lorem.sentence()}</h2><p>${faker.lorem.paragraphs(3, '\n\n')}</p><blockquote>${faker.lorem.sentence()}</blockquote><p>${faker.lorem.paragraphs(2, '\n\n')}</p>`;
    
    posts.push({
      title: title,
      slug: faker.helpers.slugify(title).toLowerCase(),
      content: content, // Generates HTML-like content
      excerpt: faker.lorem.paragraph(),
      featured_image_url: faker.image.urlLoremFlickr({ category: 'nature' }),
      // Assign a random user as the author
      author_id: getRandomItem(allUsers).id,
      status: 'published', // Or randomize with 'draft'
      published_at: faker.date.recent({ days: 30 }),
    });
  }
  return BlogPost.bulkCreate(posts);
}

async function createCategories(count) {
  const cats = [];
  const usedNames = new Set();

  // Create unique parent categories
  while (cats.length < count) {
    const name = faker.commerce.department();
    if (usedNames.has(name)) continue;

    usedNames.add(name);

    cats.push({
      name,
      slug: faker.helpers.slugify(name).toLowerCase(),
      description: faker.lorem.sentence(),
      is_active: true,
    });
  }

  // Insert parent categories into DB
  const parentCategories = await categories.bulkCreate(cats);

  // Create subcategories with unique names
  const subCats = [];
  while (subCats.length < 5) {
    const name = faker.commerce.productAdjective() + " Books";
    if (usedNames.has(name)) continue;

    usedNames.add(name);

    subCats.push({
      name,
      slug: faker.helpers.slugify(name).toLowerCase(),
      description: faker.lorem.sentence(),
      parent_id: getRandomItem(parentCategories).id,
      is_active: true,
    });
  }

  // Insert subcategories
  await categories.bulkCreate(subCats);
}

async function createAuthors(count) {
  const auths = [];
  for (let i = 0; i < count; i++) {
    
    auths.push({
      name: faker.person.fullName(),
      bio: faker.lorem.paragraph(),
      photo_url: faker.image.avatar(),
      birth_date: faker.date.past({ years: 50 }),
      nationality: faker.location.country(),
    });
  }
  return authors.bulkCreate(auths);
}

async function createPublishers(count) {
  const pubs = [];
  for (let i = 0; i < count; i++) {
    const name = faker.company.name() + " Publishing";
    pubs.push({
      name: name,
      slug: faker.helpers.slugify(name).toLowerCase(),
      description: faker.company.catchPhrase(),
      website: faker.internet.url(),
      logo_url: faker.image.urlLoremFlickr({ category: 'business' }),
      is_active: true,
    });
  }
  return publishers.bulkCreate(pubs);
}

async function createTags(count) {
  const tags = [];
  const usedNames = new Set();
  for (let i = 0; i < count; i++) {
    const name = faker.word.adjective();
    if(usedNames.has(name)) continue;
    usedNames.add(name);
    tags.push({
      name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
      slug: name,
    });
  }
  return Tags.bulkCreate(tags);
}

async function createBooks(count, allCategories, allPublishers) {
  const books = [];
  for (let i = 0; i < count; i++) {
    const price = parseFloat(faker.commerce.price({ min: 5, max: 100 }));
    books.push({
      title: faker.commerce.productName(),
      description: faker.lorem.paragraphs(2),
      price: price,
      original_price: price + parseFloat(faker.commerce.price({ min: 5, max: 20 })),
      image_url: faker.image.urlLoremFlickr({ category: 'book' }),
      isbn: faker.commerce.isbn(),
      stock: faker.number.int({ min: 0, max: 100 }),
      rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
      review_count: faker.number.int({ min: 0, max: 500 }),
      category_id: getRandomItem(allCategories).id,
      publisher_id: getRandomItem(allPublishers).id,
      publisher_date: faker.date.past({ years: 10 }),
      page_count: faker.number.int({ min: 50, max: 800 }),
      language: 'English',
      format: faker.helpers.arrayElement(['paperback', 'hardcover', 'ebook']),
      status: 'active',
    });
  }
  return Books.bulkCreate(books);
}

async function createReviews(count, allUsers, allBooks) {
  const userReviews = [];
  for (let i = 0; i < count; i++) {
    userReviews.push({
      book_id: getRandomItem(allBooks).id,
      user_id: getRandomItem(allUsers).id,
      rating: faker.number.int({ min: 1, max: 5 }),
      title: faker.lorem.sentence(5),
      review_text: faker.lorem.paragraph(),
      is_verified_purchase: faker.datatype.boolean(),
      is_approved: true,
      helpful_votes: faker.number.int({ min: 0, max: 50 }),
    });
  }
  return reviews.bulkCreate(userReviews);
}

async function createCartItems(count, allUsers, allBooks) {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push({
        user_id: getRandomItem(allUsers).id,
        book_id: getRandomItem(allBooks).id,
        quantity: faker.number.int({ min: 1, max: 3 }),
      });
    }
    // Use findOrCreate to avoid duplicate cart items for the same user/book
    for (const item of items) {
        await cartItems.findOrCreate({
            where: { user_id: item.user_id, book_id: item.book_id },
            defaults: item,
        });
    }
}


// --- Main Seeding Function ---
async function seedDatabase() {
  try {
    console.log('--- STARTING SEED PROCESS ---');


    await sequelizes.sync({ force: true });
    console.log('Database synced! Tables dropped and recreated.');

    // --- Create data in order of dependency ---
    console.log('Creating users...');
    const createdUsers = await createUsers(20);
     console.log('Creating blog posts...');
    await createBlogPosts(15, createdUsers);

    console.log('Creating categories...');
    await createCategories(20); 
    const createdCategories = await categories.findAll(); // Re-fetch after creation

    console.log('Creating authors...');
    const createdAuthors = await createAuthors(50);

    console.log('Creating publishers...');
    const createdPublishers = await createPublishers(15);

    console.log('Creating tags...');
    const createdTags = await createTags(30);

    console.log('Creating books...');
    const createdBooks = await createBooks(100, createdCategories, createdPublishers);
    

    // --- Create relationship data (many-to-many) ---
    console.log('Assigning authors to books...');
    const bookAuthorRelations = [];
    for (const book of createdBooks) {
      const selectedAuthors = getRandomSubset(createdAuthors, 3);
      for (const author of selectedAuthors) {
        bookAuthorRelations.push({
          book_id: book.id,
          author_id: author.id,
          role: 'author' // Can randomize this too if needed
        });
      }
    }
    await BookAuthors.bulkCreate(bookAuthorRelations);
    
    console.log('Assigning tags to books...');
    const bookTagRelations = [];
     for (const book of createdBooks) {
      const selectedTags = getRandomSubset(createdTags, 5);
      for (const tag of selectedTags) {
        bookTagRelations.push({
          book_id: book.id,
          tag_id: tag.id,
        });
      }
    }
    await BookTags.bulkCreate(bookTagRelations);

    console.log('Creating reviews...');
    await createReviews(200, createdUsers, createdBooks);

    console.log('Creating cart items...');
    await createCartItems(30, createdUsers, createdBooks);

    console.log('--- SEEDING COMPLETE! ---');
  } catch (error) {
    console.error('--- FAILED TO SEED DATABASE ---');
    console.error(error);
  } finally {
    await sequelizes.close();
  }
}

// Run the seeder
seedDatabase();