import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Heart, Target, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Navbar */}
      <header className="px-6 lg:px-12 py-6 flex items-center justify-between z-10 sticky top-0 bg-background/80 backdrop-blur-md border-b border-border/40">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">P</div>
          <span className="font-bold text-xl tracking-tight text-primary">PathFindr</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 font-semibold text-sm">
          <Link to="/counselors" className="hover:text-secondary transition-colors">Counselors</Link>
          <Link to="/resources" className="hover:text-secondary transition-colors">Resources</Link>
          <Link to="/about" className="text-secondary">About</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login" className="font-semibold text-sm hover:text-secondary transition-colors">Log in</Link>
          <Link to="/signup" className="clay-btn-primary px-5 py-2.5 rounded-lg font-bold text-sm">
            Sign Up
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <div className="lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
               Our Mission
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-primary mb-8 leading-tight">
              Expert guidance for every dimension of life.
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-10 leading-relaxed">
              PathFindr is a holistic life-guidance platform. We believe that true success isn't just about a career—it's about finding harmony across Love, Wealth, Health, and Personal Growth. We connect you with verified experts to navigate life's most complex choices.
            </p>
            <div className="flex gap-4">
              <Link to="/signup" className="clay-btn-primary px-8 py-4 rounded-xl font-bold text-lg">
                Start Your Journey
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
             <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl absolute -z-10"></div>
             <div className="clay-card p-12 aspect-square flex items-center justify-center relative overflow-hidden">
                <Users className="w-32 h-32 text-primary opacity-20 absolute -top-10 -left-10" />
                <div className="text-center">
                   <div className="text-7xl font-black text-primary mb-2">10k+</div>
                   <div className="text-xl font-bold text-muted-foreground">Lives Transformed</div>
                </div>
                <Heart className="w-32 h-32 text-secondary opacity-20 absolute -bottom-10 -right-10" />
             </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
           <div className="clay-card">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Holistic Harmony</h3>
              <p className="text-muted-foreground">We look at the big picture. Our guidance spans across all vital life dimensions for true fulfillment.</p>
           </div>
           <div className="clay-card">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Experts</h3>
              <p className="text-muted-foreground">Quality over quantity. We vet every counselor to ensure you receive world-class, ethical advice.</p>
           </div>
           <div className="clay-card">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Unbiased Guidance</h3>
              <p className="text-muted-foreground">No hidden agendas. Our only priority is helping you find alignment and peace in your life choices.</p>
           </div>
        </div>

        {/* Team Section Placeholder */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-12">Built by experts in Psychology, Finance, and Law</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             {[1, 2, 3, 4].map((i) => (
               <div key={i} className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-muted mb-4 border-4 border-background shadow-xl"></div>
                  <div className="font-bold">Team Member {i}</div>
                  <div className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Founder / Expert</div>
               </div>
             ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-12 border-t border-border/40 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">P</div>
            <span className="font-bold text-lg text-primary">PathFindr</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2026 PathFindr. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
