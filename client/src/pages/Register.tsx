import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const UserIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Successful registration
      navigate("/?registered=true");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-bg-base transition-colors duration-700">
      {/* Background Gradients/Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-primary rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-brand-secondary rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-brand-accent rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Main Card */}
      <div className="w-full max-w-md p-8 mx-4 bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative z-10 overflow-hidden transform transition-all hover:scale-[1.01] duration-500">
        
        {/* Header */}
        <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary mb-2 tracking-tight">
              Create Account
            </h1>
            <p className="text-text-muted text-sm font-medium">
              Join us and start tracking your journey.
            </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="space-y-2 group">
            <label 
              htmlFor="name" 
              className={`text-xs uppercase tracking-wider font-bold ml-1 transition-colors duration-300 ${focusedInput === 'name' ? 'text-brand-primary' : 'text-text-muted'}`}
            >
              Full Name
            </label>
            <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 ${focusedInput === 'name' ? 'border-brand-primary bg-brand-primary/5 shadow-[0_0_20px_rgba(65,189,187,0.15)]' : 'border-border-base bg-white/50 dark:bg-slate-800/50 hover:border-brand-secondary/50'}`}>
              <div className={`transition-colors duration-300 ${focusedInput === 'name' ? 'text-brand-primary' : 'text-text-muted'}`}>
                <UserIcon />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="flex-1 bg-transparent outline-none text-text-base placeholder-text-muted/60 font-medium"
                placeholder="John Doe"
                onFocus={() => setFocusedInput('name')}
                onBlur={() => setFocusedInput(null)}
                required
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2 group">
            <label 
              htmlFor="email" 
              className={`text-xs uppercase tracking-wider font-bold ml-1 transition-colors duration-300 ${focusedInput === 'email' ? 'text-brand-primary' : 'text-text-muted'}`}
            >
              Email Address
            </label>
            <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 ${focusedInput === 'email' ? 'border-brand-primary bg-brand-primary/5 shadow-[0_0_20px_rgba(65,189,187,0.15)]' : 'border-border-base bg-white/50 dark:bg-slate-800/50 hover:border-brand-secondary/50'}`}>
              <div className={`transition-colors duration-300 ${focusedInput === 'email' ? 'text-brand-primary' : 'text-text-muted'}`}>
                <MailIcon />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="flex-1 bg-transparent outline-none text-text-base placeholder-text-muted/60 font-medium"
                placeholder="john@example.com"
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2 group">
             <label 
              htmlFor="password" 
              className={`text-xs uppercase tracking-wider font-bold ml-1 transition-colors duration-300 ${focusedInput === 'password' ? 'text-brand-primary' : 'text-text-muted'}`}
            >
              Password
            </label>
            <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 ${focusedInput === 'password' ? 'border-brand-primary bg-brand-primary/5 shadow-[0_0_20px_rgba(65,189,187,0.15)]' : 'border-border-base bg-white/50 dark:bg-slate-800/50 hover:border-brand-secondary/50'}`}>
               <div className={`transition-colors duration-300 ${focusedInput === 'password' ? 'text-brand-primary' : 'text-text-muted'}`}>
                <LockIcon />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="flex-1 bg-transparent outline-none text-text-base placeholder-text-muted/60 font-medium"
                placeholder="••••••••"
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                required
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2 group">
             <label 
              htmlFor="confirmPassword" 
              className={`text-xs uppercase tracking-wider font-bold ml-1 transition-colors duration-300 ${focusedInput === 'confirmPassword' ? 'text-brand-primary' : 'text-text-muted'}`}
            >
              Confirm Password
            </label>
            <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 ${focusedInput === 'confirmPassword' ? 'border-brand-primary bg-brand-primary/5 shadow-[0_0_20px_rgba(65,189,187,0.15)]' : 'border-border-base bg-white/50 dark:bg-slate-800/50 hover:border-brand-secondary/50'}`}>
               <div className={`transition-colors duration-300 ${focusedInput === 'confirmPassword' ? 'text-brand-primary' : 'text-text-muted'}`}>
                <LockIcon />
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="flex-1 bg-transparent outline-none text-text-base placeholder-text-muted/60 font-medium"
                placeholder="••••••••"
                onFocus={() => setFocusedInput('confirmPassword')}
                onBlur={() => setFocusedInput(null)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group w-full p-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-xl shadow-lg hover:shadow-brand-primary/40 transform transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span>{loading ? "Creating Account..." : "Sign Up"}</span>
            {!loading && (
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                 <ArrowRightIcon />
              </span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-text-muted text-sm">
            Already have an account?{" "}
            <Link to="/" className="font-bold text-brand-primary hover:text-brand-secondary transition-colors duration-300">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
