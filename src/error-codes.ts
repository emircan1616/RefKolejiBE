interface ErrorCode {
    httpCode: number;
    message: string;
  }
  
  const ERROR_CODES: Record<string, ErrorCode> = {
    "OK": {
      httpCode: 200,
      message: "Ok"
    },
    "UNDEFINED_ERROR": {
      httpCode: 500,
      message: "Undefined error"
    },
    "MONGO_ERROR": {
      httpCode: 50,
      message: "Database Error"
    },
    "BAD_REQUEST": {
      httpCode: 400,
      message: "Bad request"
    },
    "FORBIDDEN": {
      httpCode: 403,
      message: "You are not authorized"
    },
    "NOT_FOUND": {
      httpCode: 404,
      message: "Not found"
    },
    "NOT_IMPLEMENTED": {
      httpCode: 501,
      message: "Not Implemented"
    },
    "ROUTE_PARAMS_VALIDATION_ERROR": {
      httpCode: 400,
      message: "Route params validation error"
    },
    "BAD_PARAMS_ERROR": {
      httpCode: 400,
      message: "Bad params"
    },
    "SESSION_UNDEFINED": {
      httpCode: 400,
      message: "Invalid session"
    }
  };
  
  export default ERROR_CODES;
  