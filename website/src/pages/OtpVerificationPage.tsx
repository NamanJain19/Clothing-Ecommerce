import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Loader2, Phone } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { authService } from '../services/authService';
import { authBrandConfig } from '../data/authConfig';

export const OtpVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [phone, setPhone] = useState<string>((location.state as any)?.phone || '');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
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

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setErrorMessage('Please enter a valid phone number (e.g. +91 9876543210)');
      return;
    }

    setIsSending(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const res = await authService.sendOtp(phone.trim());
      setStatusMessage(res.message || `Verification code dispatched to ${phone}`);
      setTimeLeft(60);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to send SMS verification code. Please check your Twilio configuration.');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('').trim();
    if (code.length < 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    if (!phone.trim()) {
      setErrorMessage('Phone number is required for verification.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const res = await authService.verifyOtp(phone.trim(), code);
      setIsVerified(true);
      setStatusMessage(res.message || 'Phone number verified successfully.');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid or expired verification code. Please try again.');
    } finally {
      setIsVerifying(false);
    }
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
              src={authBrandConfig.loginImage}
              alt="MONOLITH Luxury Editorial"
              className="w-full h-full object-cover grayscale brightness-95 scale-105 hover:scale-100 transition-transform duration-[3000ms]"
            />
            <div className="absolute top-12 left-12 z-20">
              <span className="font-display-lg text-4xl tracking-tighter text-white font-serif uppercase drop-shadow-md">
                {authBrandConfig.brandName}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: OTP Verification Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-surface px-margin-mobile md:px-margin-desktop py-12">
          <div className="max-w-md w-full">
            <div className="mb-8 text-center md:text-left">
              <h1 className="font-headline-md text-3xl md:text-4xl text-primary mb-3">
                Phone SMS Verification
              </h1>
              <p className="font-body-md text-secondary text-sm">
                Authenticate with an official one-time passkey dispatched via Twilio Verify SMS.
              </p>
            </div>

            {/* Status Messages */}
            {statusMessage && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded flex items-center gap-3 text-emerald-600 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded flex items-center gap-3 text-red-500 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Phone Input & Send Section */}
            <div className="mb-8 p-4 border border-outline-variant rounded-md bg-surface-container">
              <label className="font-label-caps text-[10px] uppercase text-secondary block mb-1.5 font-semibold">
                Client Mobile Number (E.164 Format)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-secondary" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-outline-variant text-sm font-body-md focus:border-primary focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSending || timeLeft > 0}
                  className="px-4 py-2 bg-primary text-white font-button text-xs uppercase tracking-wider hover:bg-black/90 disabled:opacity-50 transition-all cursor-pointer shrink-0"
                >
                  {isSending ? (
                    <span className="flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Dispatching...</span>
                  ) : timeLeft > 0 ? (
                    `Sent (${timeLeft}s)`
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </div>
            </div>

            <form onSubmit={handleVerify} className="space-y-8">
              {/* 6 OTP Input Boxes */}
              <div>
                <label className="font-label-caps text-[10px] uppercase text-secondary block mb-3 text-center md:text-left">
                  Enter 6-Digit Verification Code
                </label>
                <div className="flex justify-between gap-1.5 sm:gap-2 md:gap-3">
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
                      className="w-9 h-12 sm:w-12 sm:h-16 md:w-14 md:h-20 text-center font-headline-md text-lg sm:text-2xl font-semibold border-b-2 border-outline-variant bg-transparent focus:border-primary focus:outline-none transition-all duration-300"
                    />
                  ))}
                </div>
              </div>

              {/* Actions Area */}
              <div className="space-y-6">
                <div className="flex items-center justify-between text-xs">
                  {timeLeft > 0 ? (
                    <span className="font-label-caps text-secondary">
                      Resend in <span className="font-bold text-primary">{formatTime(timeLeft)}</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="font-label-caps text-primary underline underline-offset-4 cursor-pointer font-semibold"
                    >
                      RESEND OTP SMS
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="font-label-caps text-secondary underline underline-offset-4 cursor-pointer"
                  >
                    Return to Login
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={isVerifying || isVerified}
                    className="w-full bg-primary text-white py-5 font-button text-button uppercase tracking-[0.2em] hover:bg-black/90 transition-colors shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Verifying Code...
                      </>
                    ) : isVerified ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Verified
                      </>
                    ) : (
                      'Verify Passkey'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full border border-primary text-primary py-3.5 font-button text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all cursor-pointer"
                  >
                    Back
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
