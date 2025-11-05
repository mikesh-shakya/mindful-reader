/**
 * Default configuration and fallbacks
 * for Mindful Reader MVP frontend.
 */

export const DEFAULTS = {
  // 🧍 USER
  user: {
    displayName: "Mindful Reader",
    profilePictureUrl: "/illustrations/default-avatar.svg",
    nationality: "Unknown",
  },

  // ✍️ AUTHOR
  author: {
    fullName: "Unknown Author",
    bio: "This author prefers to let their words speak for themselves.",
    profilePictureUrl: "/illustrations/default-author.svg",
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
    coverImageUrl: "/illustrations/book-placeholder.svg",
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
    meditation: "/illustrations/meditation.svg",
    bookshelf: "/illustrations/bookshelves.svg",
    reader: "/illustrations/writer.svg",
    blankPhoto: "/illustrations/blank_photo.svg",
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
