import {
  getAllAuthors as getAllAuthorsFromDb,
  getAuthorById as getAuthorByIdFromDb,
  createAuthor as createAuthorInDb,
  updateAuthor as updateAuthorInDb,
  deleteAuthor as deleteAuthorFromDb,
  authorHasBooks
} from '../models/authors.js';

// Validate author information
const validateAuthor = (author, isUpdate = false) => {
  if (!author || typeof author !== 'object' || Array.isArray(author)) {
    return 'Invalid author data';
  }

  const allowedFields = isUpdate
    ? ['name', 'birthYear']
    : ['id', 'name', 'birthYear'];

  if (Object.keys(author).some((key) => {return !allowedFields.includes(key)})) {
    return 'Unexpected fields provided';
  }

  if (!isUpdate && (typeof author.id !== 'string' || !author.id.trim())) {
    return 'Valid author ID is required';
  }

  if (typeof author.name !== 'string' || !author.name.trim()) {
    return 'Valid author name is required';
  }

  if (
    !Number.isInteger(author.birthYear) ||
    author.birthYear <= 0 ||
    author.birthYear > new Date().getFullYear()
  ) {
    return 'Valid birth year is required';
  }

  return null;
};

// GET /authors
const getAllAuthors = async (req, res) => {
  try {
    const authors = await getAllAuthorsFromDb();
    return res.status(200).json(authors);
  } catch (error) {
    console.error('Error retrieving authors:', error);
    return res.status(500).json({ message: 'Unable to retrieve authors.' });
  }
};

// GET /authors/:id
const getAuthorById = async (req, res) => {
  try {
    const author = await getAuthorByIdFromDb(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json(author);
  } catch (error) {
    console.error('Error retrieving author:', error);
    return res.status(500).json({ message: 'Unable to retrieve author.' });
  }
};

// POST /authors
const createAuthor = async (req, res) => {
  try {
    const errorMessage = validateAuthor(req.body);

    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    const existingAuthor = await getAuthorByIdFromDb(req.body.id);

    if (existingAuthor) {
      return res.status(400).json({ message: 'Author ID already exists' });
    }

    const author = {
      id: req.body.id,
      name: req.body.name.trim(),
      birthYear: req.body.birthYear
    };

    const createdAuthor = await createAuthorInDb(author);

    return res.status(201).json(createdAuthor);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Author ID already exists' });
    }

    console.error('Error creating author:', error);
    return res.status(500).json({ message: 'Unable to create author.' });
  }
};

// PUT /authors/:id
const updateAuthor = async (req, res) => {
  try {
    const errorMessage = validateAuthor(req.body, true);

    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    const existingAuthor = await getAuthorByIdFromDb(req.params.id);

    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const updatedAuthor = await updateAuthorInDb(req.params.id, {
      name: req.body.name.trim(),
      birthYear: req.body.birthYear
    });

    if (!updatedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json(updatedAuthor);
  } catch (error) {
    console.error('Error updating author:', error);
    return res.status(500).json({ message: 'Unable to update author.' });
  }
};

// DELETE /authors/:id
const deleteAuthor = async (req, res) => {
  try {
    const existingAuthor = await getAuthorByIdFromDb(req.params.id);

    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }

    const hasBooks = await authorHasBooks(req.params.id);

    if (hasBooks) {
      return res.status(409).json({
        message: 'Cannot delete author because books reference this author'
      });
    }

    const result = await deleteAuthorFromDb(req.params.id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting author:', error);
    return res.status(500).json({ message: 'Unable to delete author.' });
  }
};


export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks
};