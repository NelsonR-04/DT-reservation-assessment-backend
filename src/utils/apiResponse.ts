import { Response } from 'express';
import { HTTP_STATUS, HttpStatusCode } from './httpStatus';
import { ErrorCode } from './errorCodes';

export interface ApiErrorResponse {
  error: string;
  code: ErrorCode;
  statusCode: number;
}

export interface ApiSuccessResponse<T = any> {
  data?: T;
  message?: string;
}

export const sendError = (
  res: Response,
  statusCode: HttpStatusCode,
  error: string,
  code: ErrorCode
): Response => {
  return res.status(statusCode).json({
    error,
    code,
    statusCode,
  });
};

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: HttpStatusCode = HTTP_STATUS.OK
): Response => {
  return res.status(statusCode).json(data);
};
