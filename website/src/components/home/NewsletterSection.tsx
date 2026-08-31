import React, { useState } from 'react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail('');
    }
  };

  return (
    <section className="py-10 md:py-12 bg-white border-y border-black/5" id="newsletter">
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-left">
          <h3 className="font-headline-md text-xl md:text-2xl mb-1 italic">
            Join the Monolith Circle
          </h3>
          <p className="font-body-md text-secondary text-xs md:text-sm tracking-wide">
            Receive seasonal updates and private invitations.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex w-full md:w-auto min-w-full md:min-w-[400px] border-b border-black">
          <input
            className="flex-grow bg-transparent border-none focus:outline-none focus:ring-0 font-body-md py-4 px-0 placeholder:text-outline/40"
            placeholder={submitted ? 'Thank you for joining.' : 'Your Email Address'}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            className="font-label-caps text-[11px] uppercase tracking-[0.3em] pl-8 py-4 hover:opacity-50 transition-opacity cursor-pointer"
            type="submit"
          >
            {submitted ? 'Joined' : 'Subscribe'}
          </button>
        </form>
      </div>
    </section>
  );
};
