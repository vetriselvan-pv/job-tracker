import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

const toolbarButtons = [
  { label: "B", command: "bold" },
  { label: "I", command: "italic" },
  { label: "U", command: "underline" },
  { label: "•", command: "insertUnorderedList" },
  { label: "1.", command: "insertOrderedList" },
];

const sanitizeEditorMarkup = (value: string) =>
  value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .trim();

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

const CreateInterviewQuestion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const editorRef = useRef<HTMLDivElement | null>(null);
  const isEditMode = Boolean(id);
  const [topicCategory, setTopicCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!isEditMode || !id) {
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/interview-questions/${id}`);
        const data = await parseJsonResponse<{
          topicCategory?: string;
          question?: string;
          answer?: string;
          error?: string;
        }>(response);

        if (!response.ok) {
          throw new Error(data?.error || "Failed to load interview question");
        }

        setTopicCategory(data?.topicCategory ?? "");
        setQuestion(data?.question ?? "");
        setAnswer(data?.answer ?? "");

        if (editorRef.current) {
          editorRef.current.innerHTML = data?.answer ?? "";
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id, isEditMode]);

  const runCommand = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command);
    setAnswer(sanitizeEditorMarkup(editorRef.current?.innerHTML ?? ""));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        isEditMode ? `/api/interview-questions/${id}` : "/api/interview-questions",
        {
          method: isEditMode ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topicCategory,
            question,
            answer: sanitizeEditorMarkup(answer),
          }),
        },
      );

      const data = await parseJsonResponse<{ error?: string }>(response);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            (isEditMode
              ? "Failed to update interview question"
              : "Failed to create interview question"),
        );
      }

      navigate("/interview-questions");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/interview-questions")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 group transition-colors"
        >
          <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-slate-100 transition-colors">
            <ChevronLeftIcon />
          </div>
          <span>Back to Question Bank</span>
        </button>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="px-8 py-7 md:px-12 md:py-10 border-b border-slate-100 bg-[linear-gradient(135deg,rgba(26,50,99,0.04),rgba(190,233,232,0.28))]">
            <p className="text-xs uppercase tracking-[0.35em] font-black text-slate-400">
              Interview Prep
            </p>
            <h1 className="mt-3 text-3xl font-black text-slate-900 tracking-tight">
              {isEditMode ? "Update Question & Answer" : "Create Question & Answer"}
            </h1>
            <p className="mt-2 text-slate-500 font-medium">
              Write the interview question, then craft a formatted answer you can review later.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-black text-slate-400 ml-1">
                Topic Category
              </label>
              <input
                type="text"
                value={topicCategory}
                onChange={(event) => setTopicCategory(event.target.value)}
                placeholder="System Design, React, Node.js, Behavioural"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-black text-slate-400 ml-1">
                Interview Question
              </label>
              <input
                type="text"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Tell me about a time you handled a production issue."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase tracking-widest font-black text-slate-400 ml-1">
                Rich Text Answer
              </label>

              <div className="flex flex-wrap gap-2">
                {toolbarButtons.map((button) => (
                  <button
                    key={button.command}
                    type="button"
                    onClick={() => runCommand(button.command)}
                    className="min-w-11 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-black hover:border-brand-primary hover:text-brand-primary transition-colors"
                  >
                    {button.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                {!answer && (
                  <div className="pointer-events-none absolute top-5 left-5 text-slate-400 font-medium">
                    Structure your answer with bullets, highlights, and concise outcomes.
                  </div>
                )}

                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(event) =>
                    setAnswer(
                      sanitizeEditorMarkup(
                        (event.target as HTMLDivElement).innerHTML,
                      ),
                    )
                  }
                  className="min-h-72 w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-3xl focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all font-medium"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-bold text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-5 bg-brand-primary text-white font-black rounded-2xl shadow-xl shadow-brand-primary/20 hover:bg-opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting
                ? isEditMode
                  ? "Updating Question..."
                  : "Saving Question..."
                : isEditMode
                  ? "Update Question"
                  : "Save Question"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateInterviewQuestion;
