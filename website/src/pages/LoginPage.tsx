import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { authBrandConfig } from '../data/authConfig';
import { useAuth } from '../context/AuthContext';
import { GoogleLogoIcon, AppleLogoIcon } from '../components/common/SocialAuthIcons';

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
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    setIsSubmitting(true);
    const result = await login(normalizedEmail, password);
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
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  onBlur={() => setEmail((prev) => prev.trim().toLowerCase())}
                  placeholder="client@monolith.luxury"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-2 font-body-md text-sm text-on-surface placeholder:text-outline focus:border-primary transition-all duration-300 lowercase"
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
                  <GoogleLogoIcon className="w-4 h-4 shrink-0" />
                  <span className="font-button text-[11px] uppercase tracking-wider">Google</span>
                </button>
                {/* Apple */}
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="w-full flex items-center justify-center gap-2 border border-outline-variant py-2.5 hover:border-primary transition-colors duration-300 cursor-pointer bg-white shadow-xs"
                >
                  <AppleLogoIcon className="w-4 h-4 shrink-0" />
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
