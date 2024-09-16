import { ICustomApiError } from "src/types/services/custom_api_error";
import { errorTypes } from "../data/error_types";

export class CustomApiError extends Error implements ICustomApiError {
  error_value: string;
  error_type: errorTypes;
  status_code: number;

  constructor(error_value: string, error_type: errorTypes) {
    super(error_value); 
    this.error_type = error_type;
    this.error_value = error_value;
    this.status_code = this._statusCodeLoader(error_type);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  private _statusCodeLoader(errorType: errorTypes): number {
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
      case errorTypes.duplicateValue:
        return 417;
      default:
        return 500; // Varsayılan hata kodu
    }
  }
}
