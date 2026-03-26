import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../middleware/error.middleware';

interface InterviewQuestionInput {
  topicCategory: string;
  question: string;
  answer: string;
}

interface InterviewQuestionRecord extends InterviewQuestionInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDirectory = path.resolve(__dirname, '../../data');
const dataFile = path.join(dataDirectory, 'interview-questions.json');

const sanitizeRichText = (value: string): string => {
  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
};

const ensureStore = async () => {
  await mkdir(dataDirectory, { recursive: true });

  try {
    await readFile(dataFile, 'utf8');
  } catch {
    await writeFile(dataFile, '[]', 'utf8');
  }
};

const readQuestions = async (): Promise<InterviewQuestionRecord[]> => {
  await ensureStore();
  const content = await readFile(dataFile, 'utf8');

  try {
    return JSON.parse(content) as InterviewQuestionRecord[];
  } catch {
    throw new AppError('Interview question store is corrupted', 500);
  }
};

const writeQuestions = async (questions: InterviewQuestionRecord[]) => {
  await writeFile(dataFile, JSON.stringify(questions, null, 2), 'utf8');
};

export const listQuestions = async () => {
  const questions = await readQuestions();

  return questions.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
};

export const getQuestion = async (questionId: string) => {
  const questions = await readQuestions();
  const question = questions.find((item) => item.id === questionId);

  if (!question) {
    throw new AppError('Interview question not found', 404);
  }

  return question;
};

export const createQuestion = async (data: Partial<InterviewQuestionInput>) => {
  const topicCategory = data.topicCategory?.trim();
  const question = data.question?.trim();
  const answer = sanitizeRichText(data.answer ?? '');

  if (!topicCategory) {
    throw new AppError('Topic category is required', 400);
  }

  if (!question) {
    throw new AppError('Question is required', 400);
  }

  if (!answer || answer === '<br>') {
    throw new AppError('Answer is required', 400);
  }

  const questions = await readQuestions();
  const timestamp = new Date().toISOString();

  const record: InterviewQuestionRecord = {
    id: randomUUID(),
    topicCategory,
    question,
    answer,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  questions.push(record);
  await writeQuestions(questions);

  return record;
};

export const updateQuestion = async (
  questionId: string,
  data: Partial<InterviewQuestionInput>,
) => {
  const topicCategory = data.topicCategory?.trim();
  const question = data.question?.trim();
  const answer = sanitizeRichText(data.answer ?? '');

  if (!topicCategory) {
    throw new AppError('Topic category is required', 400);
  }

  if (!question) {
    throw new AppError('Question is required', 400);
  }

  if (!answer || answer === '<br>') {
    throw new AppError('Answer is required', 400);
  }

  const questions = await readQuestions();
  const questionIndex = questions.findIndex((item) => item.id === questionId);

  if (questionIndex === -1) {
    throw new AppError('Interview question not found', 404);
  }

  const existingQuestion = questions[questionIndex];
  if (!existingQuestion) {
    throw new AppError('Interview question not found', 404);
  }

  const updatedQuestion: InterviewQuestionRecord = {
    ...existingQuestion,
    topicCategory,
    question,
    answer,
    updatedAt: new Date().toISOString(),
  };
  questions[questionIndex] = updatedQuestion;

  await writeQuestions(questions);

  return updatedQuestion;
};
