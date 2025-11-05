import { myAxios, privateAxios } from "./Helper";
import { handleAxiosError } from "./ErrorHandler";

/* ------------------------------------
   📚 Book Service APIs
------------------------------------ */

// 🔹 Get all books (with optional filters)
export const getAllBooks = async ({ offset, limit, orderBy, title } = {}) => {
  try {
    const { data } = await myAxios.get("/books", {
      params: { offset, limit, orderBy, title },
    });
    return data;
  } catch (err) {
    throw handleAxiosError(err, "fetching books");
  }
};

// 🔹 Get single book by ID
export const getBook = async (bookId) => {
  try {
    const { data } = await myAxios.get(`/books/${bookId}`);
    return data;
  } catch (err) {
    throw handleAxiosError(err, "fetching book details");
  }
};

// 🔹 Get all books by author ID
export const getAllBooksByAuthor = async (
  authorId,
  { offset, limit, orderBy } = {}
) => {
  try {
    const { data } = await myAxios.get(`/books/author/${authorId}`, {
      params: { offset, limit, orderBy },
    });
    return data;
  } catch (err) {
    throw handleAxiosError(err, "fetching author's books");
  }
};

// 🔹 Add a new book (private)
export const addBook = async (book) => {
  try {
    const { data } = await privateAxios.post("/books", book);
    return data;
  } catch (err) {
    throw handleAxiosError(err, "adding new book");
  }
};

// 🔹 Update a book (private)
export const updateBook = async (book, bookId) => {
  try {
    const { data } = await privateAxios.put(`/books/${bookId}`, book);
    return data;
  } catch (err) {
    throw handleAxiosError(err, "updating book details");
  }
};

// 🔹 Delete a book (private)
export const deleteBook = async (bookId) => {
  try {
    const { data } = await privateAxios.delete(`/books/${bookId}`);
    return data;
  } catch (err) {
    throw handleAxiosError(err, "deleting book");
  }
};
