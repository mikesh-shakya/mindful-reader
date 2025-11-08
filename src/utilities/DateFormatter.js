/**
 * Utility: formatDate
 * -------------------------------------
 * Converts an ISO 8601 date (e.g., "1859-04-30")
 * into a human-friendly, localized format.
 *
 * Example output: "April 30, 1859"
 * Automatically falls back to "Unknown date" if invalid.
 */

export const formatDate = (date, fallback = "Unknown date") => {
  if (!date || date === "Unknown") return fallback;

  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return fallback; // Invalid date

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return fallback;
  }
};
