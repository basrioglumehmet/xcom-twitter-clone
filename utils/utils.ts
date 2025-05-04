import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

/**
 * Formats a given time in seconds into a string representation of minutes and seconds.
 * @param {number} time - The time in seconds to be formatted.
 * @returns {string} The formatted time as a string in the format "MM:SS".
 */
export function formatTime(time: number) {
  // Convert time in seconds to a formatted string (MM:SS)
  // For example, 90 seconds will be formatted as "1:30"
  const minutes = Math.floor(time / 60);
  // Calculate the remaining seconds
  const seconds = Math.floor(time % 60);
  const formattedTime = `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2,"0")}`;
  return formattedTime;
}
