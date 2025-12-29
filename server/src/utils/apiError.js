class ApiError extends Error {
  constructor({ code, message, status = 500, details = null }) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

module.exports = { ApiError };
