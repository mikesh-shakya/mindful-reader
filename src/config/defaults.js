/**
 * Default configuration and fallbacks
 * for Mindful Reader MVP frontend.
 */

// 🌍 Base path for illustrations (adjusts per environment)
const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/assets" : "/illustrations";

// Helper to safely resolve illustration paths
export const getIllustrationPath = (filename) => `${BASE_PATH}/${filename}`;

export const DEFAULTS = {
  // 🧍 USER
  user: {
    displayName: "Mindful Reader",
    nationality: "Unknown",
  },

  // ✍️ AUTHOR
  author: {
    fullName: "Unknown Author",
    bio: "This author prefers to let their words speak for themselves.",
    profilePictureUrl: getIllustrationPath("writer.svg"),
    nationality: "Unknown",
    quote: "“Stories live within those who dare to feel.”",
  },

  // 📚 BOOK
  book: {
    title: "Untitled Book",
    authorName: "Unknown Author",
    genre: "Unknown Genre",
    language: "Unknown Language",
    description:
      "This book doesn’t have a description yet — but every page still holds a world to explore.",
    coverImageUrl: getIllustrationPath("book-placeholder.svg"),
    quote: "“Every book teaches us something about ourselves.”",
  },

  // 💬 REFLECTION
  reflection: {
    reviewPlaceholder:
      "Share your reflection — what did this book make you feel, realize, or remember?",
    noReviewsMessage:
      "No reflections yet. Be the first to share your thoughts.",
  },

  // 🌿 GENERIC ILLUSTRATIONS (used in empty states or hero sections)
  illustrations: {
    guyAvatar: getIllustrationPath("avatar/guy-avatar.svg"),
    girlAvatar: getIllustrationPath("avatar/girl-avatar.svg"),
    defaultAvatar: getIllustrationPath("avatar/default-avatar.svg"),
    bookLover: getIllustrationPath("book-lover.svg"),
    bookPlaceHolder: getIllustrationPath("book-placeholder.svg"),
    books: getIllustrationPath("books.svg"),
    bookshelf: getIllustrationPath("bookshelves.svg"),
    chatting: getIllustrationPath("chatting.svg"),
    checklist: getIllustrationPath("checklist2.svg"),
    connectionLost: getIllustrationPath("connection-lost.svg"),
    contactUs: getIllustrationPath("contact-us.svg"),
    goals: getIllustrationPath("goals.svg"),
    login: getIllustrationPath("login.svg"),
    meditation: getIllustrationPath("meditation.svg"),
    pageNotFound: getIllustrationPath("page-not-found.svg"),
    readingBook: getIllustrationPath("reading-time.svg"),
    thankYou: getIllustrationPath("thank-you.svg"),
    welcome: getIllustrationPath("welcome.svg"),
    writer: getIllustrationPath("writer.svg"),
    writing: getIllustrationPath("writing.svg"),
  },

  // 🕊️ DEFAULT QUOTES (for fallback use)
  quotes: [
    "“A book is a dream you hold in your hands.” — Neil Gaiman",
    "“A writer only begins a book. A reader finishes it.” — Samuel Johnson",
    "“We read to know we are not alone.” — C.S. Lewis",
  ],
};

/**
 * Utility function to safely get a fallback value
 * Example: safeGet(book.authorName, DEFAULTS.book.authorName)
 */
export const safeGet = (value, fallback) => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }
  return value;
};

/**
 * Utility to fetch a random default quote.
 * Useful when a book or author has no custom quote.
 */
export const getRandomQuote = () => {
  const { quotes } = DEFAULTS;
  return quotes[Math.floor(Math.random() * quotes.length)];
};
