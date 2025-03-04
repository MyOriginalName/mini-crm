/**
 * This file patches the global JSON.parse method to make it safer.
 * It prevents errors when parsing undefined or invalid values.
 */

// Store the original parse method
const originalParse = JSON.parse;

// Override with a safer version
JSON.parse = function(text, reviver) {
  if (text === undefined || text === null) {
    console.warn('Attempted to parse undefined or null JSON value');
    return null;
  }
  
  try {
    return originalParse(text, reviver);
  } catch (error) {
    console.warn('Error parsing JSON:', error, 'text:', text);
    return null; // Return null instead of the original string to prevent further errors
  }
};

// Help avoid promise-related JSON parse errors
const originalPromiseThen = Promise.prototype.then;
Promise.prototype.then = function(onFulfilled, onRejected) {
  const wrappedOnFulfilled = onFulfilled
    ? (value) => {
        try {
          return onFulfilled(value);
        } catch (error) {
          if (error instanceof SyntaxError && error.message.includes('JSON')) {
            console.warn('Caught JSON parse error in promise resolution:', error);
            return value; // Return the original value on parse error
          }
          throw error;
        }
      }
    : undefined;
  
  return originalPromiseThen.call(this, wrappedOnFulfilled, onRejected);
};

console.log('JSON.parse and Promise.prototype.then patched for safety');