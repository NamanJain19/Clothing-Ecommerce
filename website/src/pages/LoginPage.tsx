import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { authBrandConfig } from '../data/authConfig';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      const redirectPath = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(redirectPath, { replace: true });
    } else {
      setErrorMessage(result.error || 'Invalid email or password');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await loginWithGoogle();
    setIsSubmitting(false);

    if (result.success) {
      const redirectPath = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(redirectPath, { replace: true });
    } else {
      setErrorMessage(result.error || 'Google Sign-In failed');
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md selection:bg-primary selection:text-white">
      {/* Shared Master Navbar */}
      <Navbar />

      <main className="flex min-h-[calc(100vh-80px)] w-full pt-20">
        {/* Left Column: Brand Editorial Photography (Changeable via authConfig.ts) */}
        <section className="hidden md:block w-1/2 relative overflow-hidden bg-surface-dim min-h-[calc(100vh-80px)]">
          <div className="absolute inset-0 z-10 bg-black/10 pointer-events-none" />
          <img
            src={authBrandConfig.loginImage}
            alt="MONOLITH Brand Editorial"
            className="w-full h-full object-cover grayscale brightness-95 scale-105 hover:scale-100 transition-transform duration-[3000ms]"
          />
          <div className="absolute top-10 left-10 z-20">
            <Link to="/" className="font-display-lg text-3xl md:text-4xl tracking-tighter text-white font-serif uppercase drop-shadow-md">
              {authBrandConfig.brandName}
            </Link>
          </div>
        </section>

        {/* Right Column: Minimalist Authentication Form (Screen-Fit Balanced) */}
        <section className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 md:px-12 py-6 bg-surface-bright min-h-[calc(100vh-80px)]">
          <div className="w-full max-w-[420px] flex flex-col items-center">
            {/* Wordmark Header */}
            <div className="mb-4">
              <span className="font-display-lg text-3xl md:text-4xl tracking-tighter uppercase text-primary font-serif">
                MONOLITH
              </span>
            </div>

            {/* Headline */}
            <div className="text-center mb-6">
              <h1 className="font-headline-lg text-2xl md:text-3xl mb-1 text-primary font-bold">Welcome Back.</h1>
              <p className="font-body-md text-secondary text-xs md:text-sm">
                Please enter your details to continue your journey.
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-body-md text-center animate-in fade-in">
                {errorMessage}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              {/* Email Field */}
              <div className="relative group">
                <label className="font-label-caps text-[10px] uppercase text-secondary block mb-0.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-body-md text-sm text-on-surface placeholder:text-outline focus:border-primary transition-all duration-300"
                />
              </div>

              {/* Password Field */}
              <div className="relative group">
                <label className="font-label-caps text-[10px] uppercase text-secondary block mb-0.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-body-md text-sm text-on-surface placeholder:text-outline focus:border-primary transition-all duration-300"
                />
              </div>

              {/* Actions: Remember Me & Forgot Password */}
              <div className="flex items-center justify-between font-label-caps text-[10px] tracking-widest uppercase pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 border border-primary text-primary focus:ring-0 rounded-none cursor-pointer"
                  />
                  <span className="text-secondary group-hover:text-primary transition-colors">
                    Remember Me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-secondary hover:text-primary transition-colors underline underline-offset-4"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Primary Button: Sign In */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-3.5 px-6 font-button text-xs uppercase tracking-[0.2em] hover:bg-black/90 disabled:opacity-50 border border-primary transition-all duration-300 cursor-pointer shadow-md font-semibold"
                >
                  {isSubmitting ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </form>

            {/* Social Login Section */}
            <div className="w-full mt-5">
              <div className="relative flex items-center justify-center mb-4">
                <div className="border-t border-outline-variant w-full" />
                <span className="absolute bg-surface-bright px-3 font-label-caps text-[9px] text-secondary tracking-widest">
                  OR
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Google */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 border border-outline-variant py-2.5 hover:border-primary transition-colors duration-300 cursor-pointer bg-white disabled:opacity-50 shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="font-button text-[11px] uppercase tracking-wider">Google</span>
                </button>
                {/* Apple */}
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center justify-center gap-2 border border-outline-variant py-2.5 hover:border-primary transition-colors duration-300 cursor-pointer bg-white"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.11.77 1.12-.04 2.25-.83 3.67-.74 1.77.11 3.03.88 3.73 2.13-3.62 1.83-3.04 6.7.44 8.16-.69 1.67-1.63 3.31-2.95 4.65zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  <span className="font-button text-[11px] uppercase tracking-wider">Apple</span>
                </button>
              </div>
            </div>

            {/* Redirect to Register */}
            <div className="mt-5 pt-4 border-t border-outline-variant/60 w-full text-center">
              <p className="font-body-md text-xs text-secondary">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary font-semibold hover:underline underline-offset-4"
                >
                  Create Account
                </Link>
              </p>
            </div>

            <p className="mt-4 font-label-caps text-[9px] text-secondary opacity-60 uppercase tracking-[0.15em] leading-relaxed text-center">
              By signing in, you agree to our{' '}
              <Link to="/terms-conditions" className="hover:text-primary underline">
                Terms of Service
              </Link>{' '}
              &{' '}
              <Link to="/privacy-policy" className="hover:text-primary underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </section>
      </main>

      {/* Shared Master Footer */}
      <Footer />
    </div>
  );
};

export default LoginPage;
