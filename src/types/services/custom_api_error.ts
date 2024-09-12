import { errorTypes } from "src/core/data/error_types";

export interface ICustomApiError {
    error_value: string;
    error_type: errorTypes;
    status_code: number;
  }