/// <reference types="next" />
/// <reference types="next/types/global" />

declare module 'next' {
  import { NextApiRequest as OriginalNextApiRequest, NextApiResponse as OriginalNextApiResponse } from 'next/types';
  
  export interface NextApiRequest extends OriginalNextApiRequest {
    file?: Express.Multer.File;
    files?: Express.Multer.File[];
  }
  
  export type NextApiResponse<T = any> = OriginalNextApiResponse<T>;
}
