import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, TrendingUp, BookOpen, UserCircle, MessageSquare } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      {/* Navbar */}
      <header className="px-6 lg:px-12 py-6 flex items-center justify-between z-10 sticky top-0 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">P</div>
          <span className="font-bold text-xl tracking-tight text-primary">PathFindr</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 font-semibold text-sm">
          <Link to="/counselors" className="hover:text-secondary transition-colors">Counselors</Link>
          <Link to="/resources" className="hover:text-secondary transition-colors">Resources</Link>
          <Link to="/about" className="hover:text-secondary transition-colors">About</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login" className="font-semibold text-sm hover:text-secondary transition-colors">Log in</Link>
          <Link to="/signup" className="clay-btn-primary px-5 py-2.5 rounded-lg font-bold text-sm">
            Sign Up
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col">
        {/* Hero Section */}
        <section className="px-6 lg:px-12 py-20 lg:py-32 flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-semibold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            India's Premium Multi-Dimensional Counseling Platform
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-primary mb-6 leading-tight">
            Expert Guidance for Every Dimension of Life.
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
            From Career and Education to Love, Health, and Finance. Connect with verified experts to navigate life's most complex choices with clarity.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <Link to="/counselors" className="clay-btn-primary px-10 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl">
               Explore Experts Now
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm font-semibold text-muted-foreground">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Love & Marriage</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Wealth & Finance</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Health & Remedies</div>
          </div>
        </section>

        {/* Methodology Section */}
        <section className="px-6 lg:px-12 py-20 bg-muted/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-primary mb-4">The PathFindr Methodology</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">A structured, tactile approach to uncovering your life's true north.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="clay-card flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">1. Connect</h3>
                <p className="text-muted-foreground">Browse through our curated list of verified experts across all life dimensions.</p>
              </div>
              
              <div className="clay-card flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-6">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">2. Consult</h3>
                <p className="text-muted-foreground">Book private, secure 1-on-1 sessions to discuss your personal or professional challenges.</p>
              </div>

              <div className="clay-card flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                  <UserCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">3. Grow</h3>
                <p className="text-muted-foreground">Implement expert advice and access specialized resources to achieve true life harmony.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-6 lg:px-12 py-24">
          <div className="max-w-4xl mx-auto clay-card bg-primary text-primary-foreground p-12 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -ml-20 -mb-20"></div>
            
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 relative z-10 text-white">Find Your Perfect Counselor.</h2>
            <p className="text-lg mb-10 opacity-90 max-w-2xl mx-auto relative z-10 text-white/80">
              Stop struggling alone. Get professional guidance across Career, Love, Finance, and Health. Our verified experts are here to help you navigate life's toughest choices.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-10 relative z-10 text-white font-medium">
               <div className="flex items-center gap-2"><CheckCircle2 className="text-accent w-5 h-5"/> Verified Experts</div>
               <div className="flex items-center gap-2"><CheckCircle2 className="text-accent w-5 h-5"/> Secure & Private</div>
            </div>
            
            <Link to="/counselors" className="clay-btn-primary inline-flex px-10 py-4 rounded-xl font-bold text-lg relative z-10">
              Browse Experts Now
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-12 border-t border-border/40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">P</div>
            <span className="font-bold text-lg text-primary">PathFindr</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <a href="mailto:support@pathfindr.in" className="hover:text-primary transition-colors">Contact Support</a>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2026 PathFindr. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
