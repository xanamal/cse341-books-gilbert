
import {
  getAllBooks, getBookById, createBook, updateBook, deleteBook
} from '../models/books.js';
import { getAuthorById } from '../models/authors.js';

// Validate book data and publication dates
const validateBook = (book, update = false) => {
  if (!book || typeof book !== 'object' || Array.isArray(book)) {
    return 'Invalid book data';
  }

  const fields = update
    ? ['authorId', 'title', 'publicationDate']
    : ['id', 'authorId', 'title', 'publicationDate'];

  if (Object.keys(book).some((key) => {return !fields.includes(key)})) {
    return 'Unexpected fields provided';
  }

  if (fields.some((key) => {return typeof book[key] !== 'string' || !book[key].trim()})) {
    return 'All book fields are required and must be nonempty strings';
  }

  const date = book.publicationDate;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(Date.parse(date)) ||
      new Date(date).toISOString().slice(0, 10) !== date) {
    return 'Invalid publication date (YYYY-MM-DD)';
  }

  return null;
};

// Shared error handler
const serverError = (res, error) => {
  console.error('Book API error:', error);
  return res.status(500).json({ message: 'Internal server error' });
};

// GET /books
const getBooksHandler = async (req, res) => {
  try {
    return res.status(200).json(await getAllBooks());
  } catch (error) {
    return serverError(res, error);
  }
};

// GET /books/:id
const getBookByIdHandler = async (req, res) => {
  try {
    const book = await getBookById(req.params.id);
    return book
      ? res.status(200).json(book)
      : res.status(404).json({ message: 'Book not found' });
  } catch (error) {
    return serverError(res, error);
  }
};

// POST /books
const createBookHandler = async (req, res) => {
  try {
    const message = validateBook(req.body);
    if (message) return res.status(400).json({ message });

    const { id, authorId, title, publicationDate } = req.body;

    if (await getBookById(id.trim())) {
      return res.status(400).json({ message: 'Book ID already exists' });
    }
    if (!await getAuthorById(authorId.trim())) {
      return res.status(400).json({ message: 'Author not found' });
    }

    const book = {
      id: id.trim(), authorId: authorId.trim(),
      title: title.trim(), publicationDate
    };

    return res.status(201).json(await createBook(book));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Book ID already exists' });
    }
    return serverError(res, error);
  }
};

// PUT /books/:id
const updateBookHandler = async (req, res) => {
  try {
    const message = validateBook(req.body, true);
    if (message) return res.status(400).json({ message });

    if (!await getBookById(req.params.id)) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const { authorId, title, publicationDate } = req.body;

    if (!await getAuthorById(authorId.trim())) {
      return res.status(400).json({ message: 'Author not found' });
    }

    const updated = await updateBook(req.params.id, {
      authorId: authorId.trim(), title: title.trim(), publicationDate
    });

    return updated
      ? res.status(200).json(updated)
      : res.status(404).json({ message: 'Book not found' });
  } catch (error) {
    return serverError(res, error);
  }
};

// DELETE /books/:id
const deleteBookHandler = async (req, res) => {
  try {
    const result = await deleteBook(req.params.id);
    return result.deletedCount
      ? res.status(204).send()
      : res.status(404).json({ message: 'Book not found' });
  } catch (error) {
    return serverError(res, error);
  }
};

export {
  getBooksHandler, getBookByIdHandler, createBookHandler,
  updateBookHandler, deleteBookHandler
};
