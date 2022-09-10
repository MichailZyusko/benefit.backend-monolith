import "dotenv/config";
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";

type ApiError = {
  httpCode: number;
  errorCode: number;
  name: string;
  message: string;
  timestamp: string;
  stack: any;
  path?: string;
  method?: string;
};

const generateError = (e: any): ApiError => {
  let httpCode = HttpStatus.INTERNAL_SERVER_ERROR;

  switch (e.constructor.name) {
    case "EntityNotFoundError": {
      httpCode = 404;
      break;
    }
    default: {
      httpCode = e.status || HttpStatus.INTERNAL_SERVER_ERROR;
      break;
    }
  }

  return {
    httpCode,
    errorCode: e?.response?.code || 0,
    name: e.name,
    message: e.message,
    timestamp: new Date().toISOString(),
    stack: e.stack,
  };
};

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const errorResponse = generateError(exception);

    console.error(
      `request method: ${request.method} \nrequest url${request.url}\nexception:`,
      exception
    );

    response.status(errorResponse.httpCode).json(errorResponse);
  }
}
