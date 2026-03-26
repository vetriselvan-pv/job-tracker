import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface InterviewQuestion {
  id: string;
  topicCategory?: string;
  question: string;
  answer: string;
}

const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const parseJsonResponse = async <T,>(response: Response): Promise<T | null> => {
  const text = await response.text();

  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
};

const InterviewQuestionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [question, setQuestion] = useState<InterviewQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/interview-questions/${id}`);
        const data = await parseJsonResponse<InterviewQuestion & { error?: string }>(response);

        if (!response.ok) {
          throw new Error(data?.error || "Failed to fetch interview question");
        }

        setQuestion(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(190,233,232,0.36),_transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={() => navigate("/interview-questions")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold group transition-colors"
        >
          <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-slate-100 transition-colors">
            <ChevronLeftIcon />
          </div>
          <span>Back to Question Bank</span>
        </button>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-bold text-sm">
            {error}
          </div>
        )}

        {question && (
          <article className="rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="px-8 py-8 md:px-12 md:py-10 border-b border-slate-100 bg-[linear-gradient(135deg,rgba(26,50,99,0.06),rgba(250,185,91,0.12))]">
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex rounded-full bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-slate-600">
                  {question.topicCategory || "General"}
                </span>
                <button
                  onClick={() => navigate(`/interview-questions/${question.id}/edit`)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
                >
                  Edit
                </button>
              </div>
              <h1 className="mt-4 text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {question.question}
              </h1>
            </div>

            <div
              className="px-8 py-8 md:px-12 md:py-10 prose prose-slate max-w-none prose-p:my-4 prose-ul:my-4 prose-ol:my-4 prose-li:my-1 prose-strong:text-slate-900 prose-pre:overflow-visible prose-pre:whitespace-pre-wrap prose-pre:break-words prose-code:whitespace-pre-wrap prose-code:break-words"
              dangerouslySetInnerHTML={{ __html: question.answer }}
            />
          </article>
        )}
      </div>
    </div>
  );
};

export default InterviewQuestionDetail;
