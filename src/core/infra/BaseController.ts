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

  public clientError(error = 'Unauthorized'): HttpResponse {
    return {
      statusCode: 400,
      body: {
        error,
      },
    }
  }

  public unauthorized(error = 'Unauthorized'): HttpResponse {
    return {
      statusCode: 401,
      body: {
        error,
      },
    }
  }

  public forbidden(error = 'Forbidden'): HttpResponse {
    return {
      statusCode: 403,
      body: {
        error,
      },
    }
  }

  public notFound(error = 'Not found'): HttpResponse {
    return {
      statusCode: 404,
      body: {
        error,
      },
    }
  }

  public conflict(error = 'Conflict'): HttpResponse {
    return {
      statusCode: 409,
      body: {
        error,
      },
    }
  }

  public tooMany(error = 'Too many requests'): HttpResponse {
    return {
      statusCode: 429,
      body: {
        error,
      },
    }
  }

  public fail(error: Error | string): HttpResponse {
    console.log(error)

    return {
      statusCode: 500,
      body: {
        error: error.toString(),
      },
    }
  }
}
