# Books API Week 02 Spec - Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal

Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model

Book documents will be stored in the `books` collection.

Required book fields:

- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors

Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books

Purpose: Return all books.

Success:

- Status code: `200`
- Response body: an array of book objects

Errors:

- `500` if an unexpected server or database error occurs

#### GET /books/:id

Purpose: Return one book by its custom id.

Success:

- Status code: `200`
- Response body: the matching book object

Errors:

- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books

Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:

- Status code: `201`
- Response body: the newly created book object

Errors:

- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id

Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:

- Status code: `200`
- Response body: the updated book object

Errors:

- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id

Purpose: Delete an existing book.

Success:

- Status code: `204`
- Response body: none

Errors:

- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation

Swagger must document every book route.

### Deployment Expectations

After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

## Feature 2: Author CRUD Operations

### Goal

Create an Authors API that supports all CRUD operations (Create, Read, Update, and Delete). Authors will be stored in MongoDB and referenced by books using the `authorId` field. All author routes must be documented and testable in Swagger.

### Data Model

Author documents will be stored in the `authors` collection.

Required author fields:

- `id`: string, required, custom id such as `a1`
- `name`: string, required

Authors will use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Books

Each book references an author through its `authorId` field.

An author cannot be deleted while any books reference that author.

If a client attempts to delete an author who still has books, the API will return:

- Status code: `409 Conflict`
- Response body: `{"message":"Cannot delete author because books reference this author"}`

Books must be deleted or reassigned to another author before the author can be deleted.

### Routes

#### GET /authors

Purpose: Return all authors.

Success:

- Status code: `200`
- Response body: an array of author objects

Errors:

- `500` if an unexpected server or database error occurs

#### GET /authors/:id

Purpose: Return one author by their custom id.

Success:

- Status code: `200`
- Response body: the matching author object

Errors:

- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors

Purpose: Create a new author.

Request body:

    {
      "id": "a1",
      "name": "J.K. Rowling"
    }

Success:

- Status code: `201`
- Response body: the newly created author object

Errors:

- `400` if a required field is missing
- `400` if the id already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id

Purpose: Update an existing author.

Request body:

    {
      "name": "Updated Author Name"
    }

Success:

- Status code: `200`
- Response body: the updated author object

Errors:

- `400` if a required field is missing
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id

Purpose: Delete an existing author.

Success:

- Status code: `204`
- Response body: none

Errors:

- `404` if no author exists with that id
- `409` if books still reference this author
- `500` if an unexpected server or database error occurs

### Swagger Documentation

Swagger must document every author route, including request bodies, response codes, and error messages.

### Deployment Expectations

After implementation, all author routes must work locally and from the deployed Render application.

The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.

# Books API Week 02 Spec - Version 2

## Feature 1: Book CRUD Operations and Author References

### Goal

Expand the existing Week 01 Books API to support all CRUD operations and connect books to authors stored in MongoDB.

All book routes must include proper validation, consistent error handling, Swagger documentation, and testing locally and on Render.

### Data Model

Book documents will be stored in the `books` collection.

Required fields:

- `id`: string, required, unique, such as `b1`
- `authorId`: string, required, references an existing author
- `title`: string, required, cannot be empty
- `publicationDate`: string, required, formatted as YYYY-MM-DD

Books will continue using custom string IDs instead of MongoDB `_id` values for API route parameters.

The `id` field must be unique and cannot be changed after creation.

### Relationship to Authors

Each book must reference an existing author through the `authorId` field.

The `authorId` must match the custom `id` field of a document in the `authors` collection.

When creating or updating a book:

- Verify that the author exists.
- Reject invalid author references with HTTP 400.
- Return a JSON error message explaining the problem.

### Existing Book Data

The three existing books from Week 01 currently use an `author` field containing the author's name.

These records must be updated to use `authorId`.

The corresponding author documents must exist before assigning their IDs.

Example:

Before:
{
"id": "b1",
"author": "J.K. Rowling",
"title": "Harry Potter and the Sorcerer's Stone",
"publicationDate": "1997-06-26"
}

After:
{
"id": "b1",
"authorId": "a1",
"title": "Harry Potter and the Sorcerer's Stone",
"publicationDate": "1997-06-26"
}

The original book information should be preserved during migration.

### Input Validation

All create and update requests must be validated before saving data to MongoDB.

Validation rules:

- Required fields cannot be missing.
- Required string fields cannot be empty or contain only spaces.
- IDs must be strings.
- Book IDs must be unique.
- `authorId` must reference an existing author.
- `publicationDate` must contain a valid date in YYYY-MM-DD format.
- Unexpected fields should be rejected.
- Existing custom IDs cannot be changed through PUT requests.

Create a unique MongoDB index on the custom `id` field to prevent duplicate book IDs.

### Routes

#### GET /books

Purpose: Retrieve all books.

Success:

- Status code: `200`
- Response body: JSON array containing all books
- Return an empty array if no books exist

Errors:

- `500` for unexpected server or database errors

#### GET /books/:id

Purpose: Retrieve one book using its custom ID.

Success:

- Status code: `200`
- Response body: matching book object

Errors:

- `404` if the book does not exist
- `500` for unexpected server or database errors

Example 404 response:
{
"message": "Book not found"
}

#### POST /books

Purpose: Create a new book.

Request body:
{
"id": "b4",
"authorId": "a1",
"title": "Example Book Title",
"publicationDate": "2026-01-15"
}

Success:

- Status code: `201`
- Response body: newly created book object

Errors:

- `400` if required fields are missing or invalid
- `400` if the book ID already exists
- `400` if the author does not exist
- `500` for unexpected server or database errors

#### PUT /books/:id

Purpose: Update an existing book using its custom ID.

The ID in the URL identifies the book and cannot be changed.

Request body:
{
"authorId": "a2",
"title": "Updated Book Title",
"publicationDate": "2026-02-20"
}

Success:

- Status code: `200`
- Response body: updated book object

Errors:

- `400` if required fields are missing or invalid
- `400` if the author does not exist
- `404` if the book does not exist
- `500` for unexpected server or database errors

#### DELETE /books/:id

Purpose: Delete an existing book.

Success:

- Status code: `204`
- Response body: none

Errors:

- `404` if the book does not exist
- `500` for unexpected server or database errors

### Error Handling

All API errors should use consistent JSON responses.

Example:
{
"message": "Author not found"
}

Unexpected server errors must not expose MongoDB connection strings, passwords, or internal server information.

Database errors should be logged securely on the server.

### Security Considerations

- Validate all incoming request data.
- Reject unexpected fields and invalid input.
- Do not expose sensitive database information.
- Store database credentials in environment variables.
- Avoid returning raw internal error details to clients.
- Consider authentication and authorization before allowing public write access in a production application.

### Efficiency Considerations

- Use a unique MongoDB index for book IDs.
- Query individual books by custom ID.
- Check author existence using the author's custom ID.
- Use targeted database queries rather than retrieving entire collections unnecessarily.
- Pagination may be added later if the collection becomes large.

### Swagger Documentation

Swagger must document all five book routes.

Documentation must include:

- Route descriptions
- Required parameters
- Request body examples
- Expected JSON responses
- HTTP status codes
- Error responses

Swagger documentation must be available at `/api-docs`.

### Deployment Expectations

All book routes must function locally and on the deployed Render application.

The deployed Swagger documentation must allow users to test every book route.

### Test Plan

- Verify GET /books returns HTTP 200 and a JSON array.
- Verify GET /books/:id returns an existing book.
- Verify GET /books/:id returns 404 for an unknown ID.
- Verify POST /books creates a new book with HTTP 201.
- Verify POST /books rejects missing required fields.
- Verify POST /books rejects duplicate IDs.
- Verify POST /books rejects nonexistent authors.
- Verify PUT /books/:id updates an existing book.
- Verify PUT /books/:id rejects invalid author references.
- Verify PUT /books/:id returns 404 for unknown IDs.
- Verify DELETE /books/:id successfully deletes a book.
- Verify DELETE /books/:id returns 404 for unknown IDs.
- Verify existing books have valid authorId references.
- Verify invalid dates and empty strings are rejected.
- Verify all five routes appear in Swagger.
- Test every route locally using Swagger.
- Test every route on the deployed Render application.
- Verify unexpected errors return safe JSON messages.

## Feature 2: Author CRUD Operations - Version 2

### Goal

Create an Authors API that supports all CRUD operations (Create, Read, Update, and Delete).

Authors will be stored in MongoDB and referenced by books using the `authorId` field.

All author routes must include input validation, proper error handling, Swagger documentation, and testing locally and on Render.

### Data Model

Author documents will be stored in the `authors` collection.

Required fields:

- `id`: string, required, unique, such as `a1`
- `name`: string, required, cannot be empty
- `birthYear`: number, required, such as `1965`

Authors will use custom string IDs instead of MongoDB `_id` values for API route parameters.

The `id` field must be unique and cannot be changed after creation.

Example author document:

{
"id": "a1",
"name": "J.K. Rowling",
"birthYear": 1965
}

### Relationship to Books

Each book references an author through its `authorId` field.

The `authorId` must match the custom `id` of an existing author document.

An author cannot be deleted while any books reference that author.

If a client attempts to delete an author who still has books:

- Return HTTP `409 Conflict`.
- Do not delete the author.
- Return a JSON error message.

Example response:

{
"message": "Cannot delete author because books reference this author"
}

Books must be deleted or reassigned to another author before the author can be deleted.

### Initial Author Data

Create an `authors` collection in MongoDB Atlas.

Insert at least three author documents using custom IDs.

Example documents:

{
"id": "a1",
"name": "J.K. Rowling",
"birthYear": 1965
}

{
"id": "a2",
"name": "J.R.R. Tolkien",
"birthYear": 1892
}

{
"id": "a3",
"name": "George Orwell",
"birthYear": 1903
}

These author IDs can be used to update the existing books from Week 01.

### Input Validation

All create and update requests must be validated before saving data to MongoDB.

Validation rules:

- Required fields cannot be missing.
- String fields cannot be empty or contain only spaces.
- `id` must be a string.
- `id` must be unique.
- `name` must be a nonempty string.
- `birthYear` must be a valid integer.
- `birthYear` cannot be greater than the current year.
- `birthYear` must be a reasonable positive year.
- Unexpected fields should be rejected.
- Existing author IDs cannot be changed through PUT requests.

Create a unique MongoDB index on the custom `id` field to prevent duplicate author IDs.

### Routes

#### GET /authors

Purpose: Retrieve all authors.

Success:

- Status code: `200`
- Response body: JSON array containing all authors
- Return an empty array if no authors exist

Errors:

- `500` for unexpected server or database errors

#### GET /authors/:id

Purpose: Retrieve one author using their custom ID.

Success:

- Status code: `200`
- Response body: matching author object

Errors:

- `404` if the author does not exist
- `500` for unexpected server or database errors

Example 404 response:

{
"message": "Author not found"
}

#### POST /authors

Purpose: Create a new author.

Request body:

{
"id": "a4",
"name": "Example Author",
"birthYear": 1980
}

Success:

- Status code: `201`
- Response body: newly created author object

Errors:

- `400` if required fields are missing or invalid
- `400` if the author ID already exists
- `500` for unexpected server or database errors

#### PUT /authors/:id

Purpose: Update an existing author using their custom ID.

The ID in the URL identifies the author and cannot be changed.

Request body:

{
"name": "Updated Author Name",
"birthYear": 1981
}

Success:

- Status code: `200`
- Response body: updated author object

Errors:

- `400` if required fields are missing or invalid
- `404` if the author does not exist
- `500` for unexpected server or database errors

#### DELETE /authors/:id

Purpose: Delete an existing author.

Before deleting an author, check whether any books reference their ID.

Success:

- Status code: `204`
- Response body: none

Errors:

- `404` if the author does not exist
- `409` if books still reference the author
- `500` for unexpected server or database errors

Example 409 response:

{
"message": "Cannot delete author because books reference this author"
}

### Error Handling

All errors must return consistent JSON responses.

Example:

{
"message": "Author not found"
}

Unexpected server errors must not expose MongoDB connection strings, passwords, or internal server information.

Database errors should be logged securely on the server.

### Security Considerations

- Validate all incoming request data.
- Reject invalid or unexpected fields.
- Do not expose sensitive database information.
- Store database credentials in environment variables.
- Avoid returning raw internal database errors.
- Consider authentication and authorization before allowing public write access in a production application.

### Efficiency Considerations

- Create a unique MongoDB index on author IDs.
- Query individual authors using their custom IDs.
- Check for associated books using a targeted query on `authorId`.
- Create an index on the books collection's `authorId` field.
- Avoid retrieving entire collections when checking relationships.
- Pagination may be added later if the authors collection becomes large.

### Project Structure

Follow the existing MVC-style project structure.

- `src/models/authors.js`: Handles MongoDB author operations.
- `src/controllers/authors.js`: Handles HTTP requests and responses.
- `src/router.js`: Defines and connects author routes.

The authors model should support:

- getAllAuthors
- getAuthorById
- createAuthor
- updateAuthor
- deleteAuthor
- authorHasBooks

The `authorHasBooks` function will check whether books reference an author before deletion.

### Swagger Documentation

Swagger must document all five author routes.

Documentation must include:

- Route descriptions
- Required parameters
- Request body examples
- Expected JSON responses
- HTTP status codes
- Error responses

POST and PUT documentation must include the required `id`, `name`, and `birthYear` fields as appropriate.

Swagger documentation must be available at `/api-docs`.

### Deployment Expectations

All author routes must function locally and on the deployed Render application.

The deployed Swagger documentation must allow users to test every author route.

### Test Plan

- Verify GET /authors returns HTTP 200 and a JSON array.
- Verify GET /authors/:id returns an existing author.
- Verify GET /authors/:id returns 404 for an unknown ID.
- Verify POST /authors creates a new author with HTTP 201.
- Verify POST /authors rejects missing required fields.
- Verify POST /authors rejects duplicate IDs.
- Verify POST /authors rejects invalid birthYear values.
- Verify POST /authors rejects empty names.
- Verify PUT /authors/:id updates an existing author.
- Verify PUT /authors/:id validates required fields.
- Verify PUT /authors/:id returns 404 for unknown IDs.
- Verify DELETE /authors/:id successfully deletes an author without books.
- Verify DELETE /authors/:id returns 404 for unknown IDs.
- Verify DELETE /authors/:id returns 409 when books reference the author.
- Verify authors cannot be deleted while books reference them.
- Verify all five routes appear in Swagger.
- Test every route locally using Swagger.
- Test every route on the deployed Render application.
- Run npm run lint and verify it passes.
- Verify unexpected errors return safe JSON messages.
