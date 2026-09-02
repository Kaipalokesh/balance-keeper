/**
 * Formats date into a user-friendly format (e.g., '16 Mar 2026').
 * Handles both Date instances and raw ISO date strings safely.
 */
export function formatDate(date) {
  if (date instanceof Date && !Number.isNaN(date.getTime())) {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  if (typeof date === "string") {
    return date.slice(0, 10);
  }
  return String(date);
}

/**
 * Extracts a numeric timestamp (epoch milliseconds) for reliable sorting.
 * Converts Date objects and ISO strings to comparable timestamps.
 */
export function dateValue(date) {
  if (date instanceof Date) return date.getTime();
  if (typeof date === "string") return new Date(date).getTime();
  return 0;
}
