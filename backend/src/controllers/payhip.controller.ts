import type { Request, Response } from 'express';
import { validatePayhipCode } from '../services/payhip.service.js';

export const validateCode = async (req: Request, res: Response) => {
  const { code } = req.body as { code: string };
  const result = await validatePayhipCode(code);
  res.json({ data: result });
};
