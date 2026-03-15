import { GoogleGenerativeAI } from '@google/generative-ai';
import PDFDocument from 'pdfkit';
import { AppError } from '../../middleware/error.middleware';

interface CoverLetterRequest {
  developerDetails: string;
  jobDescription: string;
  experienceAndSkills: string;
}

interface CoverLetterResponse {
  latex: string;
  pdfBase64: string;
  fileName: string;
}

const stripCodeFences = (value: string): string =>
  value.replace(/^```(?:json|latex)?\s*/i, '').replace(/```\s*$/i, '').trim();

const extractJsonObject = (content: string): Record<string, unknown> => {
  const clean = stripCodeFences(content);

  try {
    return JSON.parse(clean) as Record<string, unknown>;
  } catch {
    const start = clean.indexOf('{');
    const end = clean.lastIndexOf('}');

    if (start === -1 || end === -1 || end <= start) {
      throw new AppError('Gemini returned an invalid response format', 500);
    }

    const slice = clean.slice(start, end + 1);

    try {
      return JSON.parse(slice) as Record<string, unknown>;
    } catch {
      throw new AppError('Gemini returned malformed JSON', 500);
    }
  }
};

const normalizeLatex = (latex: string): string => {
  const cleanLatex = stripCodeFences(latex);

  if (cleanLatex.includes('\\documentclass')) {
    return cleanLatex;
  }

  return [
    '\\documentclass[11pt]{article}',
    '\\usepackage[margin=1in]{geometry}',
    '\\usepackage{hyperref}',
    '\\begin{document}',
    cleanLatex,
    '\\end{document}',
  ].join('\n');
};

const buildPrompt = ({ developerDetails, jobDescription, experienceAndSkills }: CoverLetterRequest): string => `
You are an expert ATS resume and cover letter writer.
Write an ATS-friendly, professional cover letter based on the candidate and job data.

Return ONLY valid JSON with this schema:
{
  "latex": "full latex document string",
  "plainText": "plain text version of the same cover letter"
}

Rules:
- latex must be a complete compilable document starting with \\documentclass and ending with \\end{document}
- do not wrap output in markdown code fences
- no extra keys
- plainText must not contain LaTeX commands
- Keep the letter concise and role-specific

Candidate details:
${developerDetails}

Job description:
${jobDescription}

Work experience and skills:
${experienceAndSkills}
`;

const renderPdfBuffer = (plainText: string): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const pdf = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks: Buffer[] = [];

    pdf.on('data', (chunk: Buffer) => chunks.push(chunk));
    pdf.on('end', () => resolve(Buffer.concat(chunks)));
    pdf.on('error', reject);

    pdf.fontSize(12);
    pdf.text(plainText.trim(), {
      align: 'left',
      lineGap: 5,
    });

    pdf.end();
  });

export const generateCoverLetter = async (data: unknown): Promise<CoverLetterResponse> => {
  const body = data as Partial<CoverLetterRequest>;

  if (!body?.developerDetails?.trim()) {
    throw new AppError('Developer details are required', 400);
  }

  if (!body?.jobDescription?.trim()) {
    throw new AppError('Job description is required', 400);
  }

  if (!body?.experienceAndSkills?.trim()) {
    throw new AppError('Work experience and skills are required', 400);
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new AppError('GEMINI_API_KEY is not configured on the server', 500);
  }

  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: modelName });

  const result = await model.generateContent(buildPrompt({
    developerDetails: body.developerDetails,
    jobDescription: body.jobDescription,
    experienceAndSkills: body.experienceAndSkills,
  } as CoverLetterRequest));

  const rawText = result.response.text();
  const parsed = extractJsonObject(rawText);

  const latex = typeof parsed.latex === 'string' ? normalizeLatex(parsed.latex) : '';
  const plainText = typeof parsed.plainText === 'string' ? parsed.plainText.trim() : '';

  if (!latex) {
    throw new AppError('Gemini did not return valid LaTeX content', 500);
  }

  if (!plainText) {
    throw new AppError('Gemini did not return a plain text cover letter', 500);
  }

  const pdfBuffer = await renderPdfBuffer(plainText);
  const timestamp = new Date().toISOString().slice(0, 10);

  return {
    latex,
    pdfBase64: pdfBuffer.toString('base64'),
    fileName: `ats-cover-letter-${timestamp}.pdf`,
  };
};
