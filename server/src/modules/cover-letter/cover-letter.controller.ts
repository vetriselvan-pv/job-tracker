import type { Request, Response } from "express";
import { AppError } from "../../middleware/error.middleware";
import * as coverLetterService from "./cover-letter.service";

export const generate = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await coverLetterService.generateCoverLetter(req.body);
    res.status(200).json(result);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }

    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate cover letter";
    res.status(500).json({ error: message });
  }
};
