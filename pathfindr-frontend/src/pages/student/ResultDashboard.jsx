import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ResultDashboard = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/assessment/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.data.hasTaken) {
        setResult(res.data.data.latestResult);
      } else {
        navigate('/dashboard/assessment');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching result:', err);
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen bg-slate-50">Loading Results...</div>;
  if (!result) return null;

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex flex-col items-center font-sans text-foreground">
      <div className="max-w-4xl w-full">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-primary mb-2">Your Life Clarity</h1>
          <p className="text-muted-foreground">We've analyzed your responses. Here is your current alignment across domains.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Score Card */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="md:col-span-2 clay-card flex flex-col items-center"
          >
            <h2 className="text-xl font-bold text-primary mb-8 self-start">Overall Clarity Score</h2>
            
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Circular Background */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="100"
                  stroke="currentColor"
                  strokeWidth="20"
                  fill="transparent"
                  className="text-muted"
                />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="100"
                  stroke="currentColor"
                  strokeWidth="20"
                  fill="transparent"
                  strokeDasharray="628"
                  initial={{ strokeDashoffset: 628 }}
                  animate={{ strokeDashoffset: 628 - (628 * result.clarityScore) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="text-accent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-6xl font-black text-primary">{result.clarityScore}</span>
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Percent</span>
              </div>
            </div>

            <div className="mt-12 text-center max-w-md">
              <p className="text-muted-foreground leading-relaxed italic">
                "{result.clarityScore > 70 
                  ? "You have a very strong sense of direction. You're ready to dive into specialization!" 
                  : result.clarityScore > 40 
                    ? "You're on the right path but need more exploration in specific areas like Relationships and Finance." 
                    : "You are currently in the exploration phase. This is the best time to discover new priorities!"}"
              </p>
            </div>
          </motion.div>

          {/* Sidebar Cards */}
          <div className="flex flex-col gap-6">
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="clay-card"
            >
              <h3 className="font-bold text-primary mb-4">Top Strengths</h3>
              <div className="flex flex-wrap gap-2">
                {result.strengthTags.map(tag => (
                  <span key={tag} className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-primary rounded-[1.5rem] p-6 shadow-xl text-primary-foreground overflow-hidden relative"
            >
              <div className="relative z-10">
                <h3 className="font-bold mb-2 text-white">Need more clarity?</h3>
                <p className="text-white/80 text-sm mb-4">Book a 1-on-1 session with a specialized counselor.</p>
                <button 
                  onClick={() => navigate('/counselors')}
                  className="bg-white text-primary px-4 py-2 rounded-lg font-bold text-sm hover:bg-white/90 transition-colors"
                >
                  Book Session
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>

        {/* Life Domains */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 w-full"
        >
          <h2 className="text-2xl font-bold text-primary mb-6">Recommended Domains to Focus On</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'Financial Wealth', desc: 'Investment strategies, savings, and wealth building', icon: '💰' },
              { name: 'Relationships', desc: 'Marriage, family dynamics, and romantic life', icon: '❤️' }
            ].map((track, i) => (
              <div key={i} className="clay-card flex items-center hover:scale-[1.02] transition-transform cursor-pointer">
                <div className="text-3xl mr-4 bg-muted p-3 rounded-xl shadow-sm">{track.icon}</div>
                <div>
                  <h4 className="font-bold text-primary">{track.name}</h4>
                  <p className="text-xs text-muted-foreground">{track.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultDashboard;
