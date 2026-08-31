import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const OtpVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      // Simulate verification and navigate to Reset Password or Dashboard
      navigate('/reset-password');
    }, 1200);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md selection:bg-primary selection:text-white">
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
          </div>
        </div>

        {/* Right Section: OTP Verification Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-surface px-margin-mobile md:px-margin-desktop py-12">
          <div className="max-w-md w-full">
            <div className="mb-10 text-center md:text-left">
              <h1 className="font-headline-md text-3xl md:text-4xl text-primary mb-3">
                Verify Your Identity
              </h1>
              <p className="font-body-md text-secondary text-sm">
                We've sent a 6-digit verification code to your registered email address.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-10">
              {/* 6 OTP Input Boxes */}
              <div className="flex justify-between gap-2 md:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-16 md:w-14 md:h-20 text-center font-headline-md text-2xl font-semibold border-b-2 border-outline-variant bg-transparent focus:border-primary focus:outline-none transition-all duration-300"
                  />
                ))}
              </div>

              {/* Actions Area */}
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs">
                  {timeLeft > 0 ? (
                    <span className="font-label-caps text-secondary">
                      Resend Code in <span className="font-bold text-primary">{formatTime(timeLeft)}</span>
                    </span>
                  ) : (
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setTimeLeft(45)}
                        className="font-label-caps text-primary underline underline-offset-4 cursor-pointer font-semibold"
                      >
                        RESEND OTP
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="font-label-caps text-secondary underline underline-offset-4 cursor-pointer"
                      >
                        CHANGE EMAIL
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full bg-primary text-white py-5 font-button text-button uppercase tracking-[0.2em] hover:bg-black/90 transition-colors shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isVerifying ? 'VERIFYING...' : 'VERIFY OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full border border-primary text-primary py-4 font-button text-button uppercase tracking-widest hover:bg-primary hover:text-white transition-all cursor-pointer"
                  >
                    BACK
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Shared Master Footer */}
      <Footer />
    </div>
  );
};

export default OtpVerificationPage;
