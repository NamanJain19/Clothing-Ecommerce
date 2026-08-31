import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Eye, EyeOff, Info, ArrowLeft, CheckCircle2, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { authService } from '../services/authService';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [associatedEmail, setAssociatedEmail] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const checkToken = async () => {
      if (!token) {
        setIsVerifying(false);
        setIsTokenValid(false);
        setTokenError('No password reset token was provided. Please request a new link.');
        return;
      }

      try {
        const result = await authService.verifyResetToken(token);
        if (isMounted) {
          if (result.valid) {
            setIsTokenValid(true);
            setAssociatedEmail(result.email || '');
          } else {
            setIsTokenValid(false);
            setTokenError(result.message || 'This password reset link is invalid or has expired.');
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setIsTokenValid(false);
          setTokenError(err.message || 'Unable to verify reset token. Please request a new link.');
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    };

    checkToken();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (newPassword.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match. Please re-enter.');
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.resetPassword(token, newPassword);
      setIsSuccess(true);
    } catch (err: any) {
      setFormError(err.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md selection:bg-primary selection:text-white">
      {/* Shared Master Navbar */}
      <Navbar />

      <main className="flex min-h-screen w-full pt-20">
        {/* Left Section: Editorial Image */}
        <div className="hidden md:block md:w-1/2 h-[calc(100vh-80px)] sticky top-20 overflow-hidden bg-surface-dim">
          <div className="w-full h-full relative group">
            <div className="absolute inset-0 bg-primary/10 z-10 pointer-events-none" />
            <img
              src="https://lh3.googleusercontent.com/aida/AP1WRLstQ-t_BKdLJTMOe57cDvBzNV9OdnMaFENbnzIvKVDenP0nPwHK8nBImh9CSUaQoziP-XhfZFUE4Z8dSWOLRLC4WmLGdWUOiVH3AouzWdChpdCD8v6qcncmP7Lbc3g09DfZXFJ3p80pE9cqHKqETR7Ft4xrv0Wzlx9mW-0t8P5oTV2ESEx5QV3401dDROHbZFa7rD9k9lxJTrlQ9qJS6oV6btCjl1kjEdDcBpenweg2H3duoHO1jLr1UGk4"
              alt="MONOLITH Luxury Editorial"
              className="w-full h-full object-cover grayscale transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            <div className="absolute top-12 left-12 z-20">
              <span className="font-display-lg text-4xl tracking-tighter text-white font-serif uppercase drop-shadow-md">
                MONOLITH
              </span>
            </div>
            <div className="absolute bottom-12 left-12 z-20 max-w-xs">
              <span className="font-label-caps text-[10px] tracking-widest text-white uppercase block mb-2 font-semibold">
                COLLECTION 2024
              </span>
              <p className="font-body-md text-white text-xs opacity-90 leading-relaxed">
                Architectural silhouettes and structured wools redefine the modern wardrobe.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Reset Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-background px-margin-mobile md:px-margin-desktop py-12">
          <div className="w-full max-w-md">
            {isVerifying ? (
              <div className="text-center py-16 space-y-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto stroke-[1.5]" />
                <h2 className="font-headline-md text-xl text-primary">Verifying Reset Token</h2>
                <p className="font-body-md text-xs text-secondary">
                  Validating your secure cryptographic authorization...
                </p>
              </div>
            ) : !isTokenValid ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-500">
                  <AlertCircle className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h2 className="font-headline-md text-2xl text-primary">Invalid or Expired Link</h2>
                <p className="font-body-md text-sm text-secondary leading-relaxed">
                  {tokenError || 'This password reset link is invalid or has expired. For your security, reset links are single-use and valid for 60 minutes.'}
                </p>
                <div className="pt-6 space-y-3">
                  <Link
                    to="/forgot-password"
                    className="block w-full bg-primary text-white font-button text-button py-4 uppercase tracking-[0.2em] hover:bg-black/90 transition-all text-center cursor-pointer shadow-md"
                  >
                    Request New Reset Link
                  </Link>
                  <Link
                    to="/login"
                    className="font-label-caps text-xs text-secondary hover:text-primary transition-colors inline-flex items-center gap-2 pt-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Return to Login
                  </Link>
                </div>
              </div>
            ) : isSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h2 className="font-headline-md text-2xl text-primary">Password Reset Complete</h2>
                <p className="font-body-md text-sm text-secondary leading-relaxed">
                  Your credentials have been securely updated. You may now sign in to your MONOLITH luxury account using your new password.
                </p>
                <div className="pt-6">
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-primary text-white font-button text-button py-4 uppercase tracking-[0.2em] hover:bg-black/90 transition-all cursor-pointer shadow-md"
                  >
                    Sign In Now
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center md:text-left">
                  <div className="flex items-center gap-2 text-xs font-semibold text-secondary uppercase tracking-widest mb-2">
                    <KeyRound className="w-4 h-4 text-primary" /> Secure Authentication
                  </div>
                  <h1 className="font-headline-lg text-3xl md:text-4xl text-primary mb-2">
                    Reset Password
                  </h1>
                  <p className="font-body-md text-secondary text-sm">
                    {associatedEmail ? (
                      <>Create a new password for <span className="font-semibold text-primary">{associatedEmail}</span></>
                    ) : (
                      'Please create a new secure password for your account.'
                    )}
                  </p>
                </div>

                {formError && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded flex items-center gap-3 text-red-500 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* New Password Field */}
                  <div className="relative group">
                    <label className="font-label-caps text-[10px] uppercase text-secondary block mb-1">
                      New Password
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-3 pr-10 font-body-md text-sm text-on-surface placeholder:text-outline focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-0 text-secondary hover:text-primary transition-colors cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="relative group">
                    <label className="font-label-caps text-[10px] uppercase text-secondary block mb-1">
                      Confirm Password
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent border-0 border-b border-outline-variant py-3 pr-10 font-body-md text-sm text-on-surface placeholder:text-outline focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-0 text-secondary hover:text-primary transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Security Note */}
                  <div className="flex items-start gap-3 py-4 border-t border-b border-outline-variant/40">
                    <Info className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <p className="text-xs text-secondary leading-relaxed">
                      Passwords must be at least 6 characters and contain a mix of letters, numbers, and symbols to ensure maximum account protection.
                    </p>
                  </div>

                  {/* Primary Action */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-5 font-button text-button uppercase tracking-[0.2em] hover:bg-black/90 disabled:opacity-50 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Updating Credentials...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </form>

                {/* Back to Login Link */}
                <div className="mt-10 flex justify-center">
                  <Link
                    to="/login"
                    className="font-label-caps text-xs text-secondary hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Shared Master Footer */}
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
