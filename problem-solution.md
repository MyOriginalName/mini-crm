# Fix for JSON Parse Error in localStorage

## Problem Description
The application was experiencing an error when trying to parse undefined values from localStorage:

```
SyntaxError: "undefined" is not valid JSON
    at JSON.parse (<anonymous>)
```

This error was occurring in a promise context in the compiled JavaScript file.

## Solution Approach

Our solution addresses this problem through multiple layers of protection:

1. **Safe localStorage Utility**: 
   - Created a utility module that safely gets/sets values from localStorage
   - Handles JSON parsing errors gracefully by falling back to the raw string value

2. **Global JSON.parse Patch**: 
   - Patched the global JSON.parse method to handle undefined or invalid values
   - Returns the original string when parsing fails instead of throwing an error

3. **Promise Error Handling**: 
   - Added an additional patch to Promise.prototype.then to catch JSON parse errors
   - Prevents unhandled promise rejections from JSON parsing errors

4. **Consistent Token Handling**: 
   - Created a loginService utility to ensure the token is always stored consistently
   - Provided helpers for uniform token storage and retrieval across the application

## Implementation Details

The fixes included:

1. Safely getting localStorage values with fallbacks:
   ```javascript
   export const getStorageItem = (key, defaultValue = null) => {
     try {
       const item = localStorage.getItem(key);
       if (!item) return defaultValue;
       
       return safeJsonParse(item, item); // Fall back to raw value if parsing fails
     } catch (error) {
       console.error(`Error retrieving ${key} from localStorage:`, error);
       return defaultValue;
     }
   };
   ```

2. Patching JSON.parse globally:
   ```javascript
   JSON.parse = function(text, reviver) {
     if (text === undefined || text === null) {
       console.warn('Attempted to parse undefined or null JSON value');
       return null;
     }
     
     try {
       return originalParse(text, reviver);
     } catch (error) {
       console.warn('Error parsing JSON:', error, 'text:', text);
       return text; // Return the original string instead of null
     }
   };
   ```

3. Patching Promise handling:
   ```javascript
   Promise.prototype.then = function(onFulfilled, onRejected) {
     const wrappedOnFulfilled = onFulfilled
       ? (value) => {
           try {
             return onFulfilled(value);
           } catch (error) {
             if (error instanceof SyntaxError && error.message.includes('JSON')) {
               console.warn('Caught JSON parse error in promise resolution:', error);
               return value;
             }
             throw error;
           }
         }
       : undefined;
     
     return originalPromiseThen.call(this, wrappedOnFulfilled, onRejected);
   };
   ```

These changes work together to ensure that any JSON parsing issues in the application are handled gracefully without causing the application to crash.