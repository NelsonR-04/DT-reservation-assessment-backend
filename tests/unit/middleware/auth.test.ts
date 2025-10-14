import { Request, Response, NextFunction } from 'express';
import { apiKeyAuth } from '../../../src/middleware/auth';

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();
  let responseObject: any = {};

  beforeEach(() => {
    process.env.API_KEY = 'test_api_key';
    
    mockRequest = {
      headers: {},
    };
    
    responseObject = {
      statusCode: 0,
      json: jest.fn().mockReturnThis(),
    };
    
    mockResponse = {
      status: jest.fn().mockImplementation(code => {
        responseObject.statusCode = code;
        return responseObject;
      }),
    };
    
    nextFunction = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() when valid API key is provided', () => {
    mockRequest.headers = {
      'x-api-key': 'test_api_key',
    };

    apiKeyAuth(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should return 401 when no API key is provided', () => {
    apiKeyAuth(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(responseObject.json).toHaveBeenCalledWith({ error: 'API key is required' });
  });

  it('should return 401 when invalid API key is provided', () => {
    mockRequest.headers = {
      'x-api-key': 'invalid_key',
    };

    apiKeyAuth(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(responseObject.json).toHaveBeenCalledWith({ error: 'Invalid API key' });
  });

  it('should handle case-insensitive header name', () => {
    mockRequest.headers = {
      'X-API-KEY': 'test_api_key',
    };

    apiKeyAuth(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });
});