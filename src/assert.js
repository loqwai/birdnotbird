/**
 * Assert a condition is true. If it is not, throw an error.
 *
 * @param {*} condition
 * @param {string} message
 * @returns {asserts condition}
 */
export const assert = (condition, message) => {
  if (condition) return;
  throw new Error(message);
};
