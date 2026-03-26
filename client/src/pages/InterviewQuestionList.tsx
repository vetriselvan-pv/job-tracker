import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface InterviewQuestion {
  id: string;
  topicCategory?: string;
  question: string;
  answer: string;
}

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
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

const InterviewQuestionList = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/interview-questions");
        const data = await parseJsonResponse<InterviewQuestion[] & { error?: string }>(response);

        if (!response.ok) {
          throw new Error(data?.error || "Failed to fetch interview questions");
        }

        setQuestions(data ?? []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(250,185,91,0.18),_transparent_26%),linear-gradient(180deg,#fffdf8_0%,#ffffff_45%,#f8fafc_100%)] p-4 md:p-8">
      <div className="max-w-[90lvw] mx-4 space-y-8">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-bold text-sm">
            {error}
          </div>
        )}

        {!questions.length ? (
          <div className="rounded-[2rem] border border-dashed border-slate-200 bg-white/80 backdrop-blur-sm p-10 text-center shadow-lg shadow-slate-200/40">
            <h2 className="text-2xl font-black text-slate-900">No questions yet</h2>
            <p className="mt-2 text-slate-500 font-medium">
              Create your first interview answer and start building a reusable prep library.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {questions.map((item) => (
              <article
                key={item.id}
                onClick={() => navigate(`/interview-questions/${item.id}`)}
                className="group overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
              >
                <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-100">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1A3263,#2d5aa6)] text-sm font-black text-white">
                    IQ
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-black text-slate-900">
                        Engineering Interview Notes
                      </p>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        {item.topicCategory || "General"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      Curated answer card
                    </p>
                  </div>
                </div>

                <div className="px-5 py-5 space-y-4">
                  <h2 className="line-clamp-2 text-xl font-black leading-snug text-slate-900">
                    {item.question}
                  </h2>

                  <div
                    className="prose prose-slate max-w-none text-sm prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-strong:text-slate-900 line-clamp-6 overflow-hidden text-slate-600"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-500">
                  <span className="uppercase tracking-[0.22em]">Tap to open</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    Read more
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/interview-questions/new")}
        className="fixed bottom-24 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary text-white shadow-2xl shadow-brand-primary/30 transition-all hover:scale-105 hover:bg-opacity-90 md:right-10"
        title="Add New Question"
      >
        <PlusIcon />
      </button>
    </div>
  );
};

export default InterviewQuestionList;
