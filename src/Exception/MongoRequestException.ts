import { HttpException } from '@nestjs/common';
import ERROR_CODES from '../error-codes';

export class MongoRequestException extends HttpException {
  constructor() {
    const error = ERROR_CODES.MONGO_ERROR;
    super({
      statusCode: error.httpCode,
      message: error.message,
    }, error.httpCode);
  }
}
