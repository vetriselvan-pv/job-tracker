import { useState, useEffect } from "react";
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

const AddJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    status: "Applied",
    appliedFrom: "",
    appliedDate: new Date().toISOString().split("T")[0],
    description: "",
  });

  useEffect(() => {
    if (isEditMode && id) {
      const fetchJobDetails = async () => {
        try {
          setFetching(true);
          const token = localStorage.getItem("token");
          const response = await fetch(`/api/jobs/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch job details");
          }

          const data = await response.json();
          setFormData({
            companyName: data.companyName,
            role: data.role,
            status: data.status,
            appliedFrom: data.appliedFrom,
            appliedDate: new Date(data.appliedDate).toISOString().split("T")[0],
            description: data.description || "",
          });
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load job");
        } finally {
          setFetching(false);
        }
      };

      fetchJobDetails();
    }
  }, [id, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const url = isEditMode ? `/api/jobs/${id}` : "/api/jobs";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          appliedDate: new Date(formData.appliedDate).toISOString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Failed to ${isEditMode ? "update" : "add"} job`);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-8 group transition-colors"
        >
          <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-slate-100 transition-colors">
            <ChevronLeftIcon />
          </div>
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="mb-10">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                {isEditMode ? "Modify Application" : "Add New Application"}
              </h1>
              <p className="text-slate-500 mt-2 font-medium">
                {isEditMode 
                  ? "Update the details of your job application."
                  : "Enter the details of your job application to start tracking."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-black text-slate-400 ml-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Google, Meta"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all font-medium"
                  />
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-black text-slate-400 ml-1">
                    Job Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Engineer"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-black text-slate-400 ml-1">
                    Application Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all font-medium appearance-none"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Applied From */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-black text-slate-400 ml-1">
                    Applied From
                  </label>
                  <input
                    type="text"
                    name="appliedFrom"
                    required
                    value={formData.appliedFrom}
                    onChange={handleChange}
                    placeholder="e.g. LinkedIn, Referral"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all font-medium"
                  />
                </div>
              </div>

              {/* Applied Date */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-black text-slate-400 ml-1">
                  Date Applied
                </label>
                <input
                  type="date"
                  name="appliedDate"
                  required
                  value={formData.appliedDate}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all font-medium"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-black text-slate-400 ml-1">
                  Job Description / Notes
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Paste job description or add your notes here..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-primary/5 focus:border-brand-primary transition-all font-medium resize-none"
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
                className="w-full py-5 bg-brand-primary text-white font-black rounded-2xl shadow-xl shadow-brand-primary/20 hover:bg-opacity-90 transform transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{isEditMode ? "Updating..." : "Adding..."} Application...</span>
                  </div>
                ) : (
                  isEditMode ? "Update Application" : "Create Application"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddJob;

