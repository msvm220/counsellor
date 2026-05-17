import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Video, FileText, Download, Search, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import api from '../../api/axios';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.get('/resources');
        setResources(response.data.data);
      } catch (error) {
        console.error('Failed to fetch resources:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'VIDEO': return <Video className="w-6 h-6" />;
      case 'ARTICLE': return <FileText className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };
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
          <Link to="/resources" className="text-secondary">Resources</Link>
          <Link to="/about" className="hover:text-secondary transition-colors">About</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link to="/login" className="font-semibold text-sm hover:text-secondary transition-colors">Log in</Link>
          <Link to="/signup" className="clay-btn-primary px-5 py-2.5 rounded-lg font-bold text-sm">
            Sign Up
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-primary mb-4">Guidance Resources</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Deep insights and practical tools for every dimension of your life—from Love and Health to Wealth and Career strategy.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search guides, videos, or articles..." 
              className="clay-input w-full pl-12 pr-4 py-3 rounded-xl font-medium"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {['All', 'Love', 'Wealth', 'Health', 'Career', 'Legal', 'Personal'].map((filter) => (
              <button 
                key={filter} 
                className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${filter === 'All' ? 'bg-primary text-white shadow-lg' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Resource */}
        <div className="clay-card p-0 overflow-hidden mb-16 flex flex-col lg:flex-row border-2 border-accent/20">
          <div className="lg:w-1/2 bg-accent/5 flex items-center justify-center p-12">
             <div className="w-full aspect-video bg-accent/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <Sparkles className="w-20 h-20 text-accent opacity-20 absolute top-0 right-0 -mt-8 -mr-8" />
                <BookOpen className="w-20 h-20 text-accent opacity-40" />
             </div>
          </div>
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <span className="text-accent font-bold text-sm mb-2 tracking-wider uppercase">FEATURED GUIDE</span>
            <h2 className="text-3xl font-bold mb-4 text-primary">Achieving Life Harmony in 2026</h2>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Our comprehensive roadmap for balancing financial security, personal relationships, and professional growth in a complex world.
            </p>
            <button className="clay-btn-primary self-start px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all">
              Start Reading <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resources.map((res, index) => (
              <div key={index} className="clay-card flex flex-col hover:translate-y-[-4px] transition-transform cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6">
                  {getIcon(res.type)}
                </div>
                <span className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">{res.tags?.[0] || 'Resource'}</span>
                <h3 className="text-xl font-bold mb-3 line-clamp-1">{res.title}</h3>
                <p className="text-muted-foreground text-sm mb-6 flex-grow line-clamp-3">{res.description || 'Access deep insights and guidance for your career.'}</p>
                <div className="flex items-center justify-between text-primary font-bold text-sm pt-4 border-t border-border/40">
                  <span>{res.type}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}
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
