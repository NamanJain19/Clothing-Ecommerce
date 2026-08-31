import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { authBrandConfig } from '../data/authConfig';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    const trimmedName = fullName.trim();
    const nameParts = trimmedName.split(' ');
    const firstName = nameParts[0] || 'Client';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Member';

    setIsSubmitting(true);
    const result = await register({
      firstName,
      lastName,
      email: email.trim(),
      phone: phone.trim(),
      password,
    });
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setErrorMessage(result.error || 'Registration failed. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await loginWithGoogle();
    setIsSubmitting(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setErrorMessage(result.error || 'Google Sign-In failed');
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md selection:bg-primary selection:text-white">
      {/* Shared Master Navbar */}
      <Navbar />

      <main className="flex min-h-screen w-full pt-20">
        {/* Left Section: Editorial Imagery */}
        <div className="hidden md:block md:w-1/2 lg:w-[55%] sticky top-20 h-[calc(100vh-80px)] overflow-hidden bg-surface-dim">
          <div className="absolute inset-0 z-10 bg-black/10 pointer-events-none" />
          <img
            src={authBrandConfig.registerImage}
            alt="MONOLITH Luxury Editorial"
            className="w-full h-full object-cover grayscale brightness-95 scale-105 hover:scale-100 transition-transform duration-[3000ms]"
          />
          <div className="absolute top-12 left-12 z-20">
            <Link to="/" className="font-display-lg text-4xl tracking-tighter text-white font-serif uppercase drop-shadow-md">
              {authBrandConfig.brandName}
            </Link>
          </div>
        </div>

        {/* Right Section: Registration Form */}
        <div className="w-full md:w-1/2 lg:w-[45%] flex items-center justify-center bg-surface px-margin-mobile md:px-margin-desktop py-12">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center md:text-left">
              <h1 className="font-headline-lg text-3xl md:text-4xl text-primary mb-2">
                Join the Monolith.
              </h1>
              <p className="font-body-md text-secondary text-sm">
                Create your account to experience curated luxury.
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="w-full mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-body-md text-center animate-in fade-in">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="relative">
                <label className="font-label-caps text-[10px] uppercase text-secondary mb-1 block">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ALEXANDER VOGUE"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-3 font-body-md text-sm text-on-surface placeholder:text-outline focus:border-primary transition-all uppercase"
                />
              </div>

              {/* Email Address */}
              <div className="relative">
                <label className="font-label-caps text-[10px] uppercase text-secondary mb-1 block">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="CONTACT@MONOLITH.COM"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-3 font-body-md text-sm text-on-surface placeholder:text-outline focus:border-primary transition-all"
                />
              </div>

              {/* Phone Number */}
              <div className="relative">
                <label className="font-label-caps text-[10px] uppercase text-secondary mb-1 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-3 font-body-md text-sm text-on-surface placeholder:text-outline focus:border-primary transition-all"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <label className="font-label-caps text-[10px] uppercase text-secondary mb-1 block">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-3 font-body-md text-sm text-on-surface placeholder:text-outline focus:border-primary transition-all"
                />
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="font-label-caps text-[10px] uppercase text-secondary mb-1 block">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-transparent border-0 border-b border-outline-variant py-3 font-body-md text-sm text-on-surface placeholder:text-outline focus:border-primary transition-all"
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 border-outline text-primary focus:ring-0 rounded-none cursor-pointer"
                />
                <label className="font-body-md text-xs text-secondary leading-tight">
                  I accept the{' '}
                  <Link to="/terms-conditions" className="text-primary underline underline-offset-4">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" className="text-primary underline underline-offset-4">
                    Privacy Policy
                  </Link>.
                </label>
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-5 font-button text-button uppercase tracking-[0.2em] hover:bg-black/90 disabled:opacity-50 transition-all duration-300 shadow-md cursor-pointer mt-4"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant" />
              </div>
              <div className="relative flex justify-center font-label-caps text-[10px] uppercase">
                <span className="bg-surface px-4 text-secondary tracking-widest">Or continue with</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 border border-outline-variant py-3.5 px-4 font-button text-xs uppercase tracking-wider hover:border-primary transition-colors cursor-pointer bg-white disabled:opacity-50 shadow-xs"
              >
                Google
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center justify-center gap-2 border border-outline-variant py-3.5 px-4 font-button text-xs uppercase tracking-wider hover:border-primary transition-colors cursor-pointer bg-white"
              >
                Apple
              </button>
            </div>

            {/* Footer Link */}
            <div className="mt-8 text-center border-t border-outline-variant/40 pt-6">
              <p className="font-body-md text-sm text-secondary">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary font-semibold underline underline-offset-4 hover:opacity-70 transition-opacity ml-1"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
