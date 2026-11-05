import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection('books');
  const books = await collection.find({}).toArray();
  return books;
};

const getBookById = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');
  const book = await collection.findOne({ id: bookId });
  return book;
};

const createBook = async (book) => {
  const db = getDb();
  await db.collection('books').insertOne(book);
  return book;
};

const updateBook = async (bookId, book) => {
  const db = getDb();
  return await db.collection('books').findOneAndUpdate(
    { id: bookId },
    { $set: book },
    { returnDocument: 'after' }
  );
};

const deleteBook = async (bookId) => {
  const db = getDb();
  return await db.collection('books').deleteOne({ id: bookId });
};

export {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};