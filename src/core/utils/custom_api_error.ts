import { ICustomApiError } from "src/types/services/custom_api_error"; 
import { errorTypes } from "../data/error_types";

export class CustomApiError implements ICustomApiError {
  error_value: string;
  error_type: errorTypes;
  status_code: number;

  constructor(error_value: string, error_type: errorTypes) {
    this.error_type = error_type;
    this.error_value = error_value;
    this.status_code = this._statusCodeLoader(error_type);
  }

  _statusCodeLoader(errorType: errorTypes): number {
    switch (errorType) {
      case errorTypes.authorizationError:
        return 401;
      case errorTypes.dataNotFound:
        return 404;
      case errorTypes.expiredRefreshToken:
        return 407;
      case errorTypes.invalidValue:
        return 400;
      case errorTypes.jwtError:
        return 412;
      case errorTypes.logicalError:
        return 416;
      case errorTypes.successfuly:
        return 200;
      case errorTypes.pricingError:
        return 484;
      default:
        return 200;
    }
  }
}