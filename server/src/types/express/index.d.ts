import { IUserDocument } from '../../models/User';

// To extend the Express Request interface
declare global {
  namespace Express {
    export interface Request {
      user?: IUserDocument;
    }
  }
}
