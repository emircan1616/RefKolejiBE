import { HttpException } from '@nestjs/common';
import ERROR_CODES from '../error-codes';

export class UnathException extends HttpException {
  constructor() {
    const error = ERROR_CODES.FORBIDDEN;
    super({
      statusCode: error.httpCode,
      message: error.message,
    }, error.httpCode);
  }
}
