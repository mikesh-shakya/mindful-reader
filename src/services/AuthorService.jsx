import { myAxios, privateAxios } from "./Helper";
import { handleAxiosError } from "./ErrorHandler";

/* -----------------------------
   🪶 Author Service APIs
----------------------------- */

// 🪷 Get all authors (with pagination + optional search)
export const getAllAuthors = async ({
  offset = 0,
  limit = 12,
  orderBy,
  name,
} = {}) => {
  try {
    const { data } = await myAxios.get("/authors", {
      params: { offset, limit, orderBy, name },
    });
    return data;
  } catch (err) {
    throw handleAxiosError(err, "fetching authors");
  }
};

// 🌼 Get a single author by ID
export const getAuthor = async (authorId) => {
  try {
    const { data } = await myAxios.get(`/authors/${authorId}`);
    return data;
  } catch (err) {
    throw handleAxiosError(err, "fetching author details");
  }
};

// 🌿 Add a new author (private)
export const addAuthor = async (author) => {
  try {
    const { data } = await privateAxios.post("/authors", author);
    return data;
  } catch (err) {
    throw handleAxiosError(err, "adding author");
  }
};

// 🍃 Update an author (private)
export const updateAuthor = async (author, authorId) => {
  try {
    const { data } = await privateAxios.put(`/authors/${authorId}`, author);
    return data;
  } catch (err) {
    throw handleAxiosError(err, "updating author");
  }
};

// 🪴 Delete an author (private)
export const deleteAuthor = async (authorId) => {
  try {
    const { data } = await privateAxios.delete(`/authors/${authorId}`);
    return data;
  } catch (err) {
    throw handleAxiosError(err, "deleting author");
  }
};
