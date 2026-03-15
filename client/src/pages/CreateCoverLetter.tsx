import { useState } from 'react';

type CoverLetterResponse = {
  latex: string;
  pdfBase64: string;
  fileName: string;
};

const base64ToBlob = (base64: string, type: string): Blob => {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type });
};

const downloadPdf = (base64: string, fileName: string) => {
  const blob = base64ToBlob(base64, 'application/pdf');
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();

  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

const CreateCoverLetter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latex, setLatex] = useState('');

  const [formData, setFormData] = useState({
    developerDetails: '',
    jobDescription: '',
    experienceAndSkills: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Please login to generate a cover letter.');
      }

      const response = await fetch('/api/coverLetter/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as CoverLetterResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate cover letter');
      }

      setLatex(data.latex);
      downloadPdf(data.pdfBase64, data.fileName || 'cover-letter.pdf');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            ATS Cover Letter Generator
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Provide your developer details, job description, and experience to generate an ATS-friendly cover letter in LaTeX and download it as PDF.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 md:p-10">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-black text-slate-400 ml-1">
              Developer Details (Name, URL, Address, Contact)
            </label>
            <textarea
              name="developerDetails"
              value={formData.developerDetails}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Name: John Doe\nPortfolio: https://johndoe.dev\nAddress: 123 Main St, Austin, TX\nEmail: john@email.com"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all font-medium resize-y"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-black text-slate-400 ml-1">
              Job Description
            </label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              required
              rows={8}
              placeholder="Paste the full job description here..."
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all font-medium resize-y"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest font-black text-slate-400 ml-1">
              Work Experience and Skills
            </label>
            <textarea
              name="experienceAndSkills"
              value={formData.experienceAndSkills}
              onChange={handleChange}
              required
              rows={7}
              placeholder="Describe your relevant projects, years of experience, technologies, and achievements..."
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all font-medium resize-y"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 font-bold text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-brand-primary text-white font-black rounded-2xl shadow-xl shadow-brand-primary/20 hover:bg-opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating Cover Letter...' : 'Generate LaTeX + Download PDF'}
          </button>
        </form>

        {latex && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 md:p-10 space-y-3">
            <h2 className="text-lg font-black text-slate-900">Generated LaTeX</h2>
            <textarea
              readOnly
              value={latex}
              rows={18}
              className="w-full px-4 py-3 bg-slate-900 text-slate-100 border border-slate-700 rounded-2xl font-mono text-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCoverLetter;
