import React from 'react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="px-6 lg:px-12 py-6 flex items-center justify-between border-b border-border/40">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">P</div>
          <span className="font-bold text-xl tracking-tight text-primary">PathFindr</span>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        <h1 className="text-3xl lg:text-5xl font-extrabold text-primary mb-8">Terms of Service</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <p>Last updated: April 30, 2026</p>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using PathFindr, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">2. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials on PathFindr's website for personal, non-commercial transitory viewing only.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-4">3. Disclaimer</h2>
            <p>The materials on PathFindr's website are provided on an 'as is' basis. PathFindr makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
