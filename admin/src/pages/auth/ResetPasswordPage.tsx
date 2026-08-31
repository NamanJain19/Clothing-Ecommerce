import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, Gem } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both inputs.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessModal(true);
    }, 1200);
  };

  return (
    <main className="flex min-h-screen">
      {/* Left Side: Brand Visual */}
      <section className="hidden lg:flex lg:w-1/2 relative bg-primary-container overflow-hidden items-center justify-center p-space-2xl">
        <div
          className="absolute inset-0 -z-10 opacity-30 bg-cover bg-center grayscale"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB_DdrvugQ5stUNnFKUI_5wFeASAtELs4GW1y5JXK9Tsho1P7kkqzPCaSwj9ZGcaXftkPk0LgFM-qBEiXqpAv2pXBQE2W-vWzlRAuo6gt_tWRil1wtz8B0-Mo4QwMDC1mJqZHXLT2ViM58WUdDasFQ4lY7P6A5nZl8Cw2tuWfU39ZIeYNI67QuFYd_dQncdlWTfaU5H-gHegZWG-9CtUKVC6kpIBdK_mmdcrk1IOqnrRQ6YD4nFVsxWKg')`,
          }}
        />
        <div className="relative z-10 text-center max-w-lg text-white">
          <div className="mb-space-lg flex justify-center">
            <Gem className="w-14 h-14 text-white" />
          </div>
          <h1 className="font-display text-display text-white mb-space-md">Monolith Admin</h1>
          <p className="font-body-lg text-body-lg text-white/70 leading-relaxed">
            Secure access to the luxury inventory and operations suite. Maintain the standard of
            excellence with quiet authority.
          </p>
          <div className="mt-space-2xl flex items-center justify-center space-x-space-md opacity-50">
            <div className="h-px w-12 bg-white" />
            <span className="font-label-sm text-label-sm text-white uppercase tracking-widest">
              Est. 1924
            </span>
            <div className="h-px w-12 bg-white" />
          </div>
        </div>
      </section>

      {/* Right Side: Reset Form */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-space-xl bg-surface">
        <div className="w-full max-w-md">
          {/* Mobile Brand */}
          <div className="lg:hidden flex items-center gap-2 mb-space-xl">
            <Gem className="w-7 h-7 text-primary" />
            <span className="font-headline-md text-headline-md font-bold">Monolith Admin</span>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 sm:p-space-xl shadow-sm">
            <header className="mb-space-xl">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-xs">
                Reset Password
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Please choose a strong password to protect your admin privileges.
              </p>
            </header>

            <form className="space-y-space-lg" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="new_password">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                  <input
                    id="new_password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    required
                  />
                </div>
                <p className="text-[11px] text-outline px-1">Must be at least 8 characters long.</p>
              </div>

              <div className="space-y-2">
                <label
                  className="block font-label-md text-label-md text-on-surface"
                  htmlFor="confirm_password"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                  <input
                    id="confirm_password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 pl-10 pr-4 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    required
                  />
                </div>
              </div>

              {error && <p className="font-caption text-error text-xs">{error}</p>}

              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full h-11 bg-primary text-on-primary font-label-md text-label-md rounded-lg flex items-center justify-center gap-2 hover:bg-on-background active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-70 shadow-sm"
                type="submit"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating Credentials...
                  </span>
                ) : (
                  <>
                    <span>Update Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-space-xl pt-space-lg border-t border-outline-variant flex justify-center">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 text-on-surface-variant font-label-md text-label-md hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </div>

          <footer className="mt-space-xl text-center">
            <p className="font-caption text-caption text-outline text-xs">
              Trouble resetting?{' '}
              <a className="text-primary font-medium hover:underline" href="#contact">
                Contact System Administrator
              </a>
            </p>
          </footer>
        </div>
      </section>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-space-md">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-xl border border-outline-variant p-space-xl max-w-sm w-full shadow-xl text-center z-10"
            >
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-space-md">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-headline-md text-headline-md mb-space-xs text-primary">
                Password Updated
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg text-xs leading-relaxed">
                Your security credentials have been successfully updated. You can now authenticate
                with your new master key.
              </p>
              <button
                onClick={() => navigate('/admin/login')}
                className="w-full h-10 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-on-background transition-all cursor-pointer"
              >
                Proceed to Login
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};
