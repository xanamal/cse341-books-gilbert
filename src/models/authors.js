

import { getDb } from '../db/connect.js';

// Get all authors
const getAllAuthors = async () => {
  const db = getDb();
  return await db.collection('authors').find({}).toArray();
};

// Get one author by custom ID
const getAuthorById = async (id) => {
  const db = getDb();
  return await db.collection('authors').findOne({ id });
};

// Create a new author
const createAuthor = async (author) => {
  const db = getDb();
  await db.collection('authors').insertOne(author);
  return author;
};

// Update an existing author
const updateAuthor = async (id, author) => {
  const db = getDb();

  return await db.collection('authors').findOneAndUpdate(
    { id },
    { $set: author },
    { returnDocument: 'after' }
  );
};

// Delete an author
const deleteAuthor = async (id) => {
  const db = getDb();
  return await db.collection('authors').deleteOne({ id });
};

// Check whether books reference an author
const authorHasBooks = async (id) => {
  const db = getDb();
  const book = await db.collection('books').findOne({ authorId: id });
  return book !== null;
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks
};