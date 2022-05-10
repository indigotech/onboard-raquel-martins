import { GraphQLError } from 'graphql';

export class CustomError extends Error {
  code: number;
  details?: string;
  isCustomError = true;

  constructor(message: string, code: number, details?: string) {
    super();
    this.message = message;
    this.code = code;
    this.details = details;
  }
}

export function formatError(error: GraphQLError) {
  const originalError = error.originalError;
  console.error(originalError);
  if (isCustomError(originalError)) {
    return {
      code: originalError.code,
      message: originalError.message,
      details: originalError.details
    };
  } else {
    return {
      code: 500,
      message: 'Tivemos um problema. Por favor, tente novamente.',
      details: originalError.message
    };
  }
}

function isCustomError(error: any): error is CustomError {
  return error.isCustomError;
}
