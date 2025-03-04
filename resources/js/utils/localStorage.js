/**
 * Safely parse a JSON string
 * @param {string} text - The JSON string to parse
 * @param {any} defaultValue - The default value to return if parsing fails
 * @returns {any} - The parsed value or the default value
 */
export const safeJsonParse = (text, defaultValue = null) => {
  if (!text) return defaultValue;
  
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return defaultValue;
  }
};

/**
 * Safely get and parse JSON data from localStorage
 * @param {string} key - The key to retrieve from localStorage
 * @param {any} defaultValue - The default value to return if the key doesn't exist or parsing fails
 * @returns {any} - The parsed value or the default value
 */
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    
    return safeJsonParse(item, defaultValue); // Use the provided default value if parsing fails
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Safely set JSON data in localStorage
 * @param {string} key - The key to set in localStorage
 * @param {any} value - The value to stringify and store
 */
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
};

/**
 * Remove an item from localStorage
 * @param {string} key - The key to remove
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};