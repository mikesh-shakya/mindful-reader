import { myAxios, privateAxios } from "./Helper";
import { handleAxiosError } from "./ErrorHandler";

/* -----------------------------
   💬 Review (Reflection) API
----------------------------- */

/**
 * ➕ Add or update a user's review/reflection for a book
 * @param {Object} review - review object containing bookId, userId, and review text
 */
export const addOrUpdateReview = async (review) => {
  try {
    const { data } = await privateAxios.post("/ratings", review);
    return data;
  } catch (err) {
    throw handleAxiosError(err, "submitting your reflection");
  }
};

/**
 * 📚 Get all reviews/reflections for a specific book
 * @param {number|string} bookId - The book's unique identifier
 */
export const getAllReviewsByBook = async (bookId) => {
  try {
    const { data } = await myAxios.get(`/ratings/book/${bookId}`);
    return data;
  } catch (err) {
    throw handleAxiosError(err, "fetching book reflections");
  }
};

/**
 * 👤 Get all reviews/reflections made by a specific user
 * @param {number|string} userId - The user's unique identifier
 */
export const getAllReviewsByUser = async (userId) => {
  try {
    const { data } = await myAxios.get(`/ratings/user/${userId}`);
    return data;
  } catch (err) {
    throw handleAxiosError(err, "fetching your reflections");
  }
};

/**
 * 🪶 Get the average reflection score (if rating is reintroduced later)
 * @param {number|string} bookId - The book's unique identifier
 */
export const getAverageRatingByBook = async (bookId) => {
  try {
    const { data } = await myAxios.get(`/ratings/book/${bookId}/average`);
    return data;
  } catch (err) {
    throw handleAxiosError(err, "fetching average reflections");
  }
};
