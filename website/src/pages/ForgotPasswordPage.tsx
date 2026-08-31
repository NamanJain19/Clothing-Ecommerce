import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await authService.forgotPassword(email.trim());
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to process password reset request. Please try again.');
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
            <div className="absolute inset-0 bg-primary/10 z-10 transition-opacity duration-700 group-hover:opacity-0" />
            <img
              src="https://lh3.googleusercontent.com/aida/AP1WRLstQ-t_BKdLJTMOe57cDvBzNV9OdnMaFENbnzIvKVDenP0nPwHK8nBImh9CSUaQoziP-XhfZFUE4Z8dSWOLRLC4WmLGdWUOiVH3AouzWdChpdCD8v6qcncmP7Lbc3g09DfZXFJ3p80pE9cqHKqETR7Ft4xrv0Wzlx9mW-0t8P5oTV2ESEx5QV3401dDROHbZFa7rD9k9lxJTrlQ9qJS6oV6btCjl1kjEdDcBpenweg2H3duoHO1jLr1UGk4"
              alt="MONOLITH Luxury Editorial"
              className="w-full h-full object-cover grayscale transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            <div className="absolute top-12 left-12 z-20">
              <Link to="/" className="font-display-lg text-4xl tracking-tighter text-white font-serif uppercase drop-shadow-md">
                MONOLITH
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section: Recovery Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-background px-margin-mobile md:px-margin-desktop py-12">
          <div className="w-full max-w-md">
            {!isSubmitted ? (
              <>
                <div className="mb-10 text-center md:text-left">
                  <h1 className="font-headline-md text-3xl md:text-4xl text-primary mb-3">
                    Forgot Password
                  </h1>
                  <p className="font-body-md text-secondary text-sm">
                    Enter your registered email address to receive a reset link.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded flex items-center gap-3 text-red-500 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="relative group">
                    <label className="font-label-caps text-[10px] uppercase text-secondary block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="NAME@DOMAIN.COM"
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-3 font-body-md text-sm text-on-surface placeholder:text-outline focus:border-primary transition-all uppercase"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-white font-button text-button py-5 uppercase tracking-[0.2em] hover:bg-black/90 disabled:opacity-50 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Sending Secure Link...
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-8 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-primary mx-auto stroke-[1.5]" />
                <h2 className="font-headline-md text-2xl text-primary">Instructions Sent</h2>
                <p className="font-body-md text-sm text-secondary">
                  Please check your inbox at <span className="font-semibold text-primary">{email}</span> to reset your password.
                </p>
                <div className="pt-6">
                  <button
                    onClick={() => navigate('/reset-password')}
                    className="w-full bg-primary text-white font-button text-button py-4 uppercase tracking-[0.2em] hover:bg-black/90 transition-all mb-4 cursor-pointer"
                  >
                    Proceed to Reset Password
                  </button>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="font-label-caps text-xs text-primary underline underline-offset-4 cursor-pointer"
                  >
                    Try Again With Different Email
                  </button>
                </div>
              </div>
            )}

            {/* Back to Login Link */}
            <div className="mt-10 flex flex-col items-center gap-6">
              <Link
                to="/login"
                className="font-label-caps text-xs text-secondary hover:text-primary transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Shared Master Footer */}
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
