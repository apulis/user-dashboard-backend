import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    console.log(JSON.stringify(exception))
    response
      .status(status)
      .json({
        date: new Date().toLocaleDateString(),
        path: request.url,
        message: exception.response.message,
      });
  }

}