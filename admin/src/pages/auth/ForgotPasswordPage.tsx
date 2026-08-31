import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, Gem } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your administrator email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/admin/otp');
      }, 1500);
    }, 1200);
  };

  return (
    <main className="min-h-screen flex overflow-hidden">
      {/* Left Side: Visual Narrative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary-container items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 grayscale contrast-125 opacity-40 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAK7dqAQv27aT1jtzCkhVWhWdZycGxYyA9Vva-a3kWsmfOsxOu9yFE0z_WEau740K1nZA4Np7_HJjIIN4KrTasS5c2THCAxjpBibZBFdXgqKpZFi0DzaAiFHbcYVYqdkce7TPesZFJp7HIGJeVya-b_sLTG8yOTvhs9CK1A4F7WfgqrMTEm9ZLejmaustAF8_OVJSXXFrz8y-99CYcwG58FO7KlhGmMYz6c514kz3u6pEQlNbYTwky2FA')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/80 to-transparent z-10" />
        <div className="relative z-20 px-space-2xl text-on-primary max-w-xl">
          <div className="mb-space-lg flex items-center gap-space-sm">
            <Gem className="w-9 h-9 text-white" />
            <span className="font-display text-display font-black tracking-tighter uppercase">
              Monolith Admin
            </span>
          </div>
          <h1 className="font-display text-display font-bold leading-tight mb-space-md">
            Secure Operations Access.
          </h1>
          <p className="font-body-lg text-body-lg text-on-primary/70 leading-relaxed">
            Protecting the heritage of luxury through rigorous digital security. Identity verification
            is required for all administrative overrides.
          </p>
        </div>
      </div>

      {/* Right Side: Interaction Canvas */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-space-xl bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-space-xl flex items-center justify-center gap-space-xs">
            <Gem className="w-7 h-7 text-primary" />
            <span className="font-headline-lg text-headline-lg font-black tracking-tighter text-on-surface">
              MONOLITH
            </span>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant luxury-shadow p-6 sm:p-space-xl rounded-xl">
            <div className="mb-space-xl">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-xs">
                Reset Password
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Enter your administrator email to receive a secure recovery link and OTP code.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-space-lg"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="space-y-space-xs">
                    <label
                      className="font-label-md text-label-md text-on-surface flex justify-between"
                      htmlFor="admin-email"
                    >
                      Admin Email
                      <span className="text-primary/40 font-normal text-xs">Registered Address</span>
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5 group-focus-within:text-primary transition-colors" />
                      <input
                        id="admin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@monolith.luxury"
                        className="w-full h-11 pl-11 pr-space-md bg-surface-bright border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 rounded-lg outline-none font-body-md text-on-surface transition-all placeholder:text-outline"
                        required
                      />
                    </div>
                    {error && <p className="font-caption text-error text-xs">{error}</p>}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className="w-full h-12 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-on-background active:scale-[0.98] transition-all flex items-center justify-center gap-space-sm disabled:opacity-70 cursor-pointer shadow-sm"
                    type="submit"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Transmitting...
                      </span>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-secondary-container/40 border border-secondary-container p-space-md rounded-lg flex items-start gap-space-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-label-md text-label-md text-on-secondary-fixed font-semibold">
                      Recovery Link Sent
                    </p>
                    <p className="font-body-md text-body-md text-on-secondary-fixed-variant text-xs mt-1 leading-relaxed">
                      Please check your inbox. Redirecting to verification protocol...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-space-xl pt-space-xl border-t border-outline-variant flex items-center justify-center">
              <Link
                to="/admin/login"
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary flex items-center gap-space-xs transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </Link>
            </div>
          </div>

          <div className="mt-space-xl flex flex-col md:flex-row justify-between items-center gap-space-md opacity-50 px-space-xs text-xs text-on-surface">
            <p>© 2024 Monolith Luxury Operations</p>
            <div className="flex gap-space-lg">
              <a className="hover:underline" href="#privacy">
                Privacy Protocol
              </a>
              <a className="hover:underline" href="#status">
                System Status
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
