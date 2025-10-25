import { Request } from "express";

export const isMobileApp = (req: Request): boolean => {
  const userAgent = req.get('User-Agent') || '';
  const isFlutter = req.get('X-Client-Type') === 'flutter';
  
  return isFlutter || 
         userAgent.includes('Flutter') || 
         userAgent.includes('Dart') ||
         req.get('X-Requested-With') === 'flutter';
};