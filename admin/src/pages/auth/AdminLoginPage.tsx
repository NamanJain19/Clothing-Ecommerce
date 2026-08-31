import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@monolith.luxury');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Field active states for smooth focus accents
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    if (!email.trim()) {
      setErrorMessage('Please enter your administrator email.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    // Simulated network verification
    setTimeout(() => {
      setIsLoading(false);

      // Dummy authentication simulation
      if (email.toLowerCase().includes('fail') || password === 'wrong') {
        setErrorMessage('Invalid credentials. Please contact your system administrator.');
      } else {
        setSuccessMessage('Authentication successful. Redirecting to executive dashboard...');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 800);
      }
    }, 1200);
  };

  return (
    <main className="flex min-h-screen">
      {/* Left Side: Visual Experience */}
      <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary-container">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuATT8ERG7OXAHHfsVDDR_PIjU8lWaHou2PZNgQS0t1grOJegixUBQZY9S46UVmhNHF7htuAiQCiZNjK58-o1UrvimzQwhxlpkRj1Un45EepJyAzVXW5T9f6Uw5iNOBeGJtjWjtVWiCSmyA1S2v3oZPLm-gD10ji0-F40vUbTi1PZHMqOEJFQ6soKv6wtbqlhib1z31fyy4GdmqWBPnRp2g3p0V4IJmF7kER3FKkiHPnC64blBDBU2vNZg')`,
          }}
        />
        <div className="absolute inset-0 visual-overlay z-10" />

        <div className="relative z-20 flex flex-col justify-between p-space-2xl w-full">
          <div>
            <h1 className="font-display text-display text-white mb-space-xs">Monolith Luxury</h1>
            <div className="h-1 w-12 bg-white mb-space-lg" />
            <h2 className="font-headline-md text-headline-md text-white/90">Admin Panel</h2>
          </div>

          <div className="max-w-md">
            <p className="font-headline-lg text-headline-lg text-white mb-space-md">
              Luxury Clothing Management System
            </p>
            <p className="font-body-lg text-body-lg text-white/70 leading-relaxed">
              Precision-engineered for internal high-end retail operations. Manage global inventory,
              bespoke orders, and atelier assets with quiet authority and absolute security.
            </p>
          </div>

          <div className="flex items-center space-x-space-md">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-surface-container-highest flex items-center justify-center overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="Administrator avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeyaLfyJ4ILYCH86uZVVveR2M3b8Sbuiz6X2l8rB2NVl8MkgBEQESqJKrm-2ghMJVjUIzJFUqZ04a-1g8uBAn7W1nz7Jgg2q9Pa56C5Oglc1tPZvEzTaXAccy2RFwd4d5YvgbMlxBqQIKwZwuSgsDSOa0cGEz4N5bsZnjDg9sYnaVAmVLPL5kVeHC9zzU8oO7_w2sSYinJX7k8VcnQ393reHd_qMRBTP6Vn--I9MxEJ4ZIJQNfpSs7rQ"
                />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-surface-container-highest flex items-center justify-center overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="Designer avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAieKJwXoPSramdJkcZE-alnA9VqM2Gll-lRDyQ2Tpj3TiJFvAC09t7hQfF6ZEfHLANuzPqqL7p8NwJkTEI_5w4eEwI-Yg2SM3_YgwWbPae4AwSI_eluAQ8i3Cm_WKkThHVnoYyO1nUdllWhYK4eLCHNzgktNmvwYV8C4IYlxv5d4BFJGPN9ZNp_5Lmui8BkuEZIeuOfmZJTqvYe8WkVbrnDrQ0_WrT9uROrvv67vERtvC5SzmGJP4tNQ"
                />
              </div>
            </div>
            <span className="font-label-md text-label-md text-white/60">
              Active session management enabled
            </span>
          </div>
        </div>
      </section>

      {/* Right Side: Login Component */}
      <section className="w-full lg:w-1/2 flex flex-col justify-center items-center px-space-md py-space-xl lg:px-space-2xl bg-surface">
        <div className="w-full max-w-[440px]">
          {/* Header */}
          <div className="mb-space-xl text-center lg:text-left">
            <div className="inline-flex items-center px-space-md py-space-xs rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm mb-space-md border border-outline-variant">
              <Lock className="w-3.5 h-3.5 mr-space-xs fill-current text-on-surface-variant" />
              Authorized Personnel Only
            </div>
            <h3 className="font-headline-lg text-headline-lg text-on-surface">Secure Login</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
              Access the Monolith Enterprise Gateway
            </p>
          </div>

          {/* Login Card */}
          <div className="luxury-card rounded-xl p-space-xl">
            <form className="space-y-space-lg" onSubmit={handleSubmit} noValidate>
              {/* Email Field */}
              <div className="space-y-space-xs">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="email">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                      emailFocused ? 'text-primary' : 'text-outline'
                    }`}
                  />
                  <input
                    className="w-full h-[40px] pl-10 pr-space-md bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200 font-body-md text-on-surface"
                    id="email"
                    name="email"
                    placeholder="admin@monolith.luxury"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-space-xs">
                <label
                  className="block font-label-md text-label-md text-on-surface"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <KeyRound
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                      passwordFocused ? 'text-primary' : 'text-outline'
                    }`}
                  />
                  <input
                    className="w-full h-[40px] pl-10 pr-10 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200 font-body-md text-on-surface"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors p-0.5 rounded focus:outline-none"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-space-xs">
                <label className="flex items-center cursor-pointer group select-none">
                  <div className="relative flex items-center">
                    <input
                      className="peer sr-only"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <div className="w-4 h-4 border border-outline-variant rounded bg-surface peer-checked:bg-primary peer-checked:border-primary transition-all duration-200" />
                    <span className="absolute text-white scale-0 peer-checked:scale-100 transition-transform duration-200 left-[1px]">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  </div>
                  <span className="ml-2 font-label-md text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors">
                    Remember Me
                  </span>
                </label>
                <Link
                  className="font-label-md text-label-md text-primary hover:underline underline-offset-4"
                  to="/admin/forgot-password"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full h-[44px] bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-on-background active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 mt-space-md disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Error Feedback Area */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  className="mt-space-md overflow-hidden"
                >
                  <div className="p-space-md rounded-lg bg-error-container text-on-error-container flex items-center gap-space-sm font-label-sm text-label-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                </motion.div>
              )}

              {/* Success Feedback */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  className="mt-space-md overflow-hidden"
                >
                  <div className="p-space-md rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-space-sm font-label-sm text-label-sm">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                    <span>{successMessage}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Security Footer */}
          <div className="mt-space-2xl border-t border-outline-variant pt-space-xl flex flex-col items-center lg:items-start">
            <div className="flex flex-wrap justify-center lg:justify-start gap-space-lg mb-space-md text-on-surface-variant font-label-sm text-label-sm">
              <a className="hover:text-primary transition-colors cursor-pointer" href="#privacy">
                Privacy Policy
              </a>
              <a className="hover:text-primary transition-colors" href="#terms">
                Terms of Service
              </a>
              <a className="hover:text-primary transition-colors" href="#security">
                Security Audit
              </a>
            </div>
            <div className="flex items-center gap-space-sm text-outline font-caption text-caption">
              <span>v4.12.0-PRO</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              <span>© 2024 Monolith Luxury Operations</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
