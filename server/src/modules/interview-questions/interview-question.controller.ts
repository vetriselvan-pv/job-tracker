import type { Request, Response } from 'express';
import * as interviewQuestionService from './interview-question.service';

export const create = async (req: Request, res: Response) => {
  try {
    const question = await interviewQuestionService.createQuestion(req.body);
    res.status(201).json(question);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create interview question';
    res.status(400).json({ error: message });
  }
};

export const findAll = async (req: Request, res: Response) => {
  try {
    const questions = await interviewQuestionService.listQuestions();
    res.status(200).json(questions);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch interview questions';
    res.status(500).json({ error: message });
  }
};

export const findOne = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const question = await interviewQuestionService.getQuestion(id);
    res.status(200).json(question);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch interview question';
    const statusCode =
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      typeof (error as { statusCode?: number }).statusCode === 'number'
        ? (error as { statusCode: number }).statusCode
        : 500;

    res.status(statusCode).json({ error: message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };
    const question = await interviewQuestionService.updateQuestion(id, req.body);
    res.status(200).json(question);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update interview question';
    const statusCode =
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      typeof (error as { statusCode?: number }).statusCode === 'number'
        ? (error as { statusCode: number }).statusCode
        : 400;

    res.status(statusCode).json({ error: message });
  }
};
