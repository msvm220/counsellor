import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="px-6 lg:px-12 py-6 flex items-center justify-between border-b border-border/40">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">P</div>
          <span className="font-bold text-xl tracking-tight text-primary">PathFindr</span>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        <h1 className="text-3xl lg:text-5xl font-extrabold text-primary mb-8">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <p>Last updated: April 30, 2026</p>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, such as when you create an account, complete a career assessment, or book a counseling session. This includes your name, email address, academic background, and career interests.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, including to calculate your Clarity Score and provide personalized career recommendations.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">3. Data Sharing</h2>
            <p>We do not share your personal data with third parties except as necessary to provide our services (e.g., sharing your profile with a counselor you've booked) or as required by law.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
