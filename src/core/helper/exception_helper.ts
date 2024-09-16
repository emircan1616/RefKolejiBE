import { ApiResponse } from '@nestjs/swagger';
import { errorTypes } from '../data/error_types';

export function commonErrorResponses() {
  return [
    ApiResponse({
      status: 400,
      description: errorTypes.invalidValue,
      schema: {
        example: {
          message: errorTypes.invalidValue,
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: errorTypes.authorizationError,
      schema: {
        example: {
          message: errorTypes.authorizationError,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: errorTypes.dataNotFound,
      schema: {
        example: {
          message: errorTypes.dataNotFound,
        },
      },
    }),
    ApiResponse({
      status: 407,
      description: errorTypes.expiredRefreshToken,
      schema: {
        example: {
          message: errorTypes.expiredRefreshToken,
        },
      },
    }),
    ApiResponse({
      status: 412,
      description: errorTypes.jwtError,
      schema: {
        example: {
          message: errorTypes.jwtError,
        },
      },
    }),
    ApiResponse({
      status: 416,
      description: errorTypes.logicalError,
      schema: {
        example: {
          message: errorTypes.logicalError,
        },
      },
    }),
    ApiResponse({
      status: 484,
      description: errorTypes.pricingError,
      schema: {
        example: {
          message: errorTypes.pricingError,
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: errorTypes.serverError,
      schema: {
        example: {
          message: errorTypes.serverError,
        },
      },
    }),
    ApiResponse({
      status: 417,
      description: errorTypes.duplicateValue,
      schema: {
        example: {
          message: errorTypes.duplicateValue,
        },
      },
    }),
  ];
}