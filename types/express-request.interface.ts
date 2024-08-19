import { Request } from 'express';

export interface CustomRequest extends Request {
  user: {
    id: string;
    [key: string]: any; // Add other properties as needed
  };
}
