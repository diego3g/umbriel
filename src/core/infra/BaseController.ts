import { HttpResponse } from './HttpResponse'

export abstract class BaseController {
  public ok<T>(dto?: T): HttpResponse {
    return {
      statusCode: 200,
      body: dto,
    }
  }

  public created(): HttpResponse {
    return {
      statusCode: 201,
      body: null,
    }
  }

  public clientError(message = 'Unauthorized'): HttpResponse {
    return {
      statusCode: 400,
      body: {
        message,
      },
    }
  }

  public unauthorized(message = 'Unauthorized'): HttpResponse {
    return {
      statusCode: 401,
      body: {
        message,
      },
    }
  }

  public forbidden(message = 'Forbidden'): HttpResponse {
    return {
      statusCode: 403,
      body: {
        message,
      },
    }
  }

  public notFound(message = 'Not found'): HttpResponse {
    return {
      statusCode: 404,
      body: {
        message,
      },
    }
  }

  public conflict(message = 'Conflict'): HttpResponse {
    return {
      statusCode: 409,
      body: {
        message,
      },
    }
  }

  public tooMany(message = 'Too many requests'): HttpResponse {
    return {
      statusCode: 429,
      body: {
        message,
      },
    }
  }

  public fail(error: Error | string): HttpResponse {
    console.log(error)

    return {
      statusCode: 500,
      body: {
        message: error.toString(),
      },
    }
  }
}
