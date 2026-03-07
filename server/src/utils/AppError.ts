export class AppError extends Error {
  public statusCode: number;
  public errors?: any; // For validation lists or detailed field errors
  public isOperational: boolean;

  constructor(message: string, statusCode: number, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // Marks this as a known error (vs a system crash)

    // Restore prototype chain
    Object.setPrototypeOf(this, AppError.prototype);
  }
}