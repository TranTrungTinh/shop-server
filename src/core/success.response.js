const { StatusCodes, ReasonPhrases } = require("../constants/httpCode.constants");

class SussesResponse {
  constructor({ message, statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, metadata = {} }) {
    this.status = 'OK';
    this.message = message || reasonStatusCode;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.statusCode).json(this)
  }
}

class CreatedResponse extends SussesResponse {
  constructor({ message, statusCode = StatusCodes.CREATED, reasonStatusCode = ReasonPhrases.CREATED, metadata = {}, options = {} }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}

class OkResponse extends SussesResponse {
  constructor({ message, statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, metadata = {}, options = {} }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}

module.exports = {
  OkResponse,
  CreatedResponse,
}