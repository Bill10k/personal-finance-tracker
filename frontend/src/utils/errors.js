// frontend/src/utils/errors.js
export function parseServerError(err) {
  if (err.response && err.response.data && err.response.data.detail) {
    return err.response.data.detail;
  }
  if (err.message) {
    return err.message;
  }
  return "An unknown error occurred.";
}
