import React, { useState } from "react";

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
      className="transition-colors duration-300"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
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
      className="transition-colors duration-300"
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

const Login: React.FC = () => {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Inline SVG icons for components to avoid external dependencies
      {/* Background Gradients/Blobs */}
  return (
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-bg-base transition-colors duration-700">
      {/* Background Gradients/Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-primary rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-brand-secondary rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-brand-accent rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Main Card */}
      <div className="w-full max-w-md p-8 mx-4 bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative z-10 overflow-hidden transform transition-all hover:scale-[1.01] duration-500">
        
        {/* Header */}
        <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary mb-2 tracking-tight">
              Job Tracker
            </h1>
            <p className="text-text-muted text-sm font-medium">
              Welcome back! Please enter your details.
            </p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Username Input */}
          <div className="space-y-2 group">
            <label 
              htmlFor="username" 
              className={`text-xs uppercase tracking-wider font-bold ml-1 transition-colors duration-300 ${focusedInput === 'username' ? 'text-brand-primary' : 'text-text-muted'}`}
            >
              Username
            </label>
            <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 ${focusedInput === 'username' ? 'border-brand-primary bg-brand-primary/5 shadow-[0_0_20px_rgba(65,189,187,0.15)]' : 'border-border-base bg-white/50 dark:bg-slate-800/50 hover:border-brand-secondary/50'}`}>
              <div className={`transition-colors duration-300 ${focusedInput === 'username' ? 'text-brand-primary' : 'text-text-muted'}`}>
                <UserIcon />
              </div>
              <input
                type="text"
                id="username"
                name="username"
                className="flex-1 bg-transparent outline-none text-text-base placeholder-text-muted/60 font-medium"
                placeholder="Enter your username"
                onFocus={() => setFocusedInput('username')}
                onBlur={() => setFocusedInput(null)}
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
                className="flex-1 bg-transparent outline-none text-text-base placeholder-text-muted/60 font-medium"
                placeholder="••••••••"
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
              />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex items-center justify-end">
            <a href="#" className="text-sm font-semibold text-brand-primary hover:text-brand-secondary transition-colors duration-300">
              Forgot Password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="group w-full p-4 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-xl shadow-lg hover:shadow-brand-primary/40 transform transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            <span>Sign In</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">
               <ArrowRightIcon />
            </span>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-text-muted text-sm">
            Don't have an account?{" "}
            <a href="#" className="font-bold text-brand-primary hover:text-brand-secondary transition-colors duration-300">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
