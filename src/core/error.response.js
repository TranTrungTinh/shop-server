const { ReasonPhrases, StatusCodes } = require("../constants/httpCode.constants");

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class NotFoundRequest extends ErrorResponse {
  constructor(message = ReasonPhrases.NOT_FOUND, statusCode = StatusCodes.NOT_FOUND) {
    super(message, statusCode);
  }
}

class ConflictRequest extends ErrorResponse {
  constructor(message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.CONFLICT) {
    super(message, statusCode);
  }
}

class BadRequest extends ErrorResponse {
  constructor(message = ReasonPhrases.BAD_REQUEST, statusCode = StatusCodes.BAD_REQUEST) {
    super(message, statusCode);
  }
}

class ForbiddenRequest extends ErrorResponse {
  constructor(message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN) {
    super(message, statusCode);
  }
}

class UnauthorizedRequest extends ErrorResponse {
  constructor(message = ReasonPhrases.UNAUTHORIZED, statusCode = StatusCodes.UNAUTHORIZED) {
    super(message, statusCode);
  }
}

class InternalServerError extends ErrorResponse {
  constructor(message = ReasonPhrases.INTERNAL_SERVER_ERROR, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message, statusCode);
  }
}

class NotImplemented extends ErrorResponse {
  constructor(message = ReasonPhrases.NOT_IMPLEMENTED, statusCode = StatusCodes.NOT_IMPLEMENTED) {
    super(message, statusCode);
  }
}

module.exports = {
  NotFoundRequest,
  ConflictRequest,
  BadRequest,
  ForbiddenRequest,
  UnauthorizedRequest,
  InternalServerError,
  NotImplemented,
}