import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, type Column } from "../components/grid/Table";

interface Job {
  id: string;
  companyName: string;
  role: string;
  status: "Applied" | "Interviewing" | "Offer" | "Rejected" | "Closed";
  appliedFrom: string;
  appliedDate: string;
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

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch("/api/jobs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const columns: Column<Job>[] = [
    {
      header: "Company",
      accessor: "companyName",
      className: "font-bold text-slate-900",
    },
    {
      header: "Role",
      accessor: "role",
      className: "text-slate-600",
    },
    {
      header: "Status",
      accessor: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
            row.status === "Offer"
              ? "bg-green-100 text-green-700"
              : row.status === "Interviewing"
                ? "bg-blue-100 text-blue-700"
                : row.status === "Rejected"
                  ? "bg-red-100 text-red-700"
                  : row.status === "Applied"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-600"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Source",
      accessor: "appliedFrom",
      className: "text-slate-500",
    },
    {
      header: "Applied Date",
      accessor: (row) => new Date(row.appliedDate).toLocaleDateString(),
      className: "text-slate-500 tabular-nums",
    },
    {
      header: "Actions",
      accessor: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/edit-job/${row.id}`);
          }}
          className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5 rounded-xl transition-all"
          title="Modify Application"
        >
          <EditIcon />
        </button>
      ),
      className: "w-10 text-center",
    },
  ];

  const handleRowClick = (job: Job) => {
    console.log("Row clicked:", job);
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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                Jobs Applied
              </h1>
              <p className="text-slate-500 mt-1 font-medium text-lg">
                Manage and track your job applications.
              </p>
            </div>
          </div>


          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/add-job")}
              className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-bold rounded-2xl shadow-lg shadow-brand-primary/20 hover:bg-opacity-90 transform transition-all hover:-translate-y-0.5 active:scale-95"
            >
              <PlusIcon />
              <span>Add New Job</span>
            </button>
          </div>
        </div>
        {/* Stats Summary - Simplified */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Total Apps",
              value: jobs.length,
              color: "text-slate-900",
            },
            {
              label: "Interviews",
              value: jobs.filter((j) => j.status === "Interviewing").length,
              color: "text-blue-600",
            },
            {
              label: "Offers",
              value: jobs.filter((j) => j.status === "Offer").length,
              color: "text-green-600",
            },
            {
              label: "Responses",
              value: jobs.filter((j) => j.status !== "Applied").length,
              color: "text-amber-600",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center"
            >
              <p className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">
                {stat.label}
              </p>
              <p className={`text-3xl font-black ${stat.color}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 font-medium">
            Error: {error}
          </div>
        )}

        {/* Data Grid Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-widest font-black text-slate-400">
              Application List
            </h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
              {jobs.length} total
            </span>
          </div>

          <Table
            data={jobs}
            columns={columns}
            keyExtractor={(job) => job.id}
            onRowClick={handleRowClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
