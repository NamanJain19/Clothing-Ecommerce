import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const OtpPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(179);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];
    pasteData.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    const nextIndex = Math.min(pasteData.length, 5);
    inputsRef.current[nextIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter all 6 digits of your verification passcode.');
      return;
    }

    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/admin/reset-password');
      }, 1000);
    }, 1200);
  };

  const handleResend = () => {
    if (timeLeft === 0) {
      setTimeLeft(180);
      setOtp(['', '', '', '', '', '']);
      inputsRef.current[0]?.focus();
    }
  };

  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <main className="flex min-h-screen w-full">
      {/* Left Side: Visual/Branding */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-primary-container">
        <div
          className="absolute inset-0 z-0 opacity-30 bg-cover bg-center grayscale"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB4l-3Gki2pw1IRV8kKXl5PYUj5DbMdfJz_zClJsVUey0jbXnanHiF3L9s07gkc67NeWYSOHbPlw-Y5KjJjUZ3JqlOlD9QrZ_Z2G2D7qQwj_5LX_YBkBd-t9pwAgHjFBZN5lbo4TqVMjpTIh8g9KUFONu28Pj_usq6dE8v-mJ_YTp-qW2nIbcK9AQEd02pOgyYdxziUeGqpZPa2kKMKCzEDAGksXOfyZUGF_3por64a5sAteomoi7zI0A')`,
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-space-2xl w-full h-full text-on-primary">
          <div>
            <h1 className="font-headline-lg text-headline-lg font-black tracking-tighter uppercase mb-2">
              Monolith Admin
            </h1>
            <p className="font-body-md text-body-md opacity-80">
              Luxury Operations Management System
            </p>
          </div>
          <div className="max-w-md">
            <h2 className="font-display text-display mb-space-md leading-tight">
              Verification required for secure access.
            </h2>
            <p className="font-body-lg text-body-lg opacity-70 leading-relaxed">
              To maintain our standards of quiet authority and uncompromising security, we've sent a
              unique one-time passcode to your registered device.
            </p>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="w-10 h-10 rounded-full bg-on-primary/10 flex items-center justify-center backdrop-blur-sm">
              <Lock className="w-5 h-5 text-on-primary" />
            </div>
            <span className="font-label-md text-label-md tracking-widest uppercase">
              End-to-End Encrypted
            </span>
          </div>
        </div>
      </div>

      {/* Right Side: OTP Interface */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-background p-6 sm:p-space-xl">
        <div className="w-full max-w-[440px]">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 mb-space-xl text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-label-md text-label-md">Back to login</span>
          </Link>

          <header className="mb-space-xl">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Verify Identity</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              We have transmitted a 6-digit access passkey to{' '}
              <span className="font-semibold text-on-surface">ad***@monolith.luxury</span>.
            </p>
          </header>

          <form className="space-y-space-xl" onSubmit={handleSubmit}>
            <div className="flex justify-between gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold rounded-lg border border-outline-variant bg-surface focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-on-surface"
                />
              ))}
            </div>

            {error && <p className="font-caption text-error text-xs text-center">{error}</p>}

            <div className="flex flex-col gap-space-md">
              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || isSuccess}
                className={`w-full h-12 text-on-primary font-label-md rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                  isSuccess ? 'bg-emerald-600' : 'bg-primary hover:bg-on-background'
                }`}
                type="submit"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying Passkey...
                  </span>
                ) : isSuccess ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Access Authorized
                  </span>
                ) : (
                  'Verify Access'
                )}
              </motion.button>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono">{formatTime()}</span>
                </div>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timeLeft > 0}
                  className="font-label-md text-xs text-on-surface-variant hover:text-primary underline underline-offset-4 disabled:opacity-40 disabled:no-underline cursor-pointer"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          </form>

          <div className="mt-space-2xl pt-space-xl border-t border-outline-variant">
            <div className="flex items-start gap-3 text-xs">
              <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-on-surface">Monolith Secure Guard</p>
                <p className="text-on-surface-variant mt-0.5">
                  If you didn't request this verification code, please contact your Security Lead immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
