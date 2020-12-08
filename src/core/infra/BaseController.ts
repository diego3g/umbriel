import express from 'express';

export abstract class BaseController {
  protected request: express.Request;

  protected response: express.Response;

  protected abstract executeImpl(): Promise<void | any>;

  public execute(request: express.Request, response: express.Response): void {
    this.request = request;
    this.response = response;

    this.executeImpl();
  }

  public static jsonResponse(
    response: express.Response,
    code: number,
    message: string
  ): express.Response {
    return response.status(code).json({ message });
  }

  public ok<T>(dto?: T): express.Response {
    if (dto) {
      return this.response.status(200).json(dto);
    }

    return this.response.sendStatus(200);
  }

  public created(): express.Response {
    return this.response.sendStatus(201);
  }

  public clientError(message?: string): express.Response {
    return BaseController.jsonResponse(
      this.response,
      400,
      message || 'Unauthorized'
    );
  }

  public unauthorized(message?: string): express.Response {
    return BaseController.jsonResponse(
      this.response,
      401,
      message || 'Unauthorized'
    );
  }

  public forbidden(message?: string): express.Response {
    return BaseController.jsonResponse(
      this.response,
      403,
      message || 'Forbidden'
    );
  }

  public notFound(message?: string): express.Response {
    return BaseController.jsonResponse(
      this.response,
      404,
      message || 'Not found'
    );
  }

  public conflict(message?: string): express.Response {
    return BaseController.jsonResponse(
      this.response,
      409,
      message || 'Conflict'
    );
  }

  public tooMany(message?: string): express.Response {
    return BaseController.jsonResponse(
      this.response,
      429,
      message || 'Too many requests'
    );
  }

  public fail(error: Error | string): express.Response {
    console.log(error);

    return this.response.status(500).json({
      message: error.toString(),
    });
  }
}
