import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const QUESTIONS = [
  {
    id: 1,
    text: "What kind of work excites you most?",
    options: [
      { id: 'A', label: "Working with numbers & data" },
      { id: 'B', label: "Creating things (art, design, writing)" },
      { id: 'C', label: "Helping people solve problems" },
      { id: 'D', label: "Building systems or technology" }
    ]
  },
  {
    id: 2,
    text: "When you face a hard problem, what do you naturally do?",
    options: [
      { id: 'A', label: "Research and analyze it deeply" },
      { id: 'B', label: "Talk to others and get different perspectives" },
      { id: 'C', label: "Jump in and try different solutions" },
      { id: 'D', label: "Make a structured plan first" }
    ]
  },
  {
    id: 3,
    text: "Which school subject did you always look forward to?",
    options: [
      { id: 'A', label: "Mathematics or Science" },
      { id: 'B', label: "Languages or Literature" },
      { id: 'C', label: "Social studies or History" },
      { id: 'D', label: "Art, Music, or Physical Education" }
    ]
  },
  {
    id: 4,
    text: "How do you feel about working in an office every day?",
    options: [
      { id: 'A', label: "I love structure and routine" },
      { id: 'B', label: "I'd prefer flexibility and variety" },
      { id: 'C', label: "I want to work outdoors or move around" },
      { id: 'D', label: "I'd rather work from home/independently" }
    ]
  },
  {
    id: 5,
    text: "What matters most to you in a future career?",
    options: [
      { id: 'A', label: "High salary" },
      { id: 'B', label: "Creative freedom" },
      { id: 'C', label: "Helping society" },
      { id: 'D', label: "Job security" }
    ]
  }
];

export default function ClarityScorePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();

  const handleOptionSelect = (optionId) => {
    setAnswers({ ...answers, [currentStep]: optionId });
    setTimeout(() => {
      if (currentStep < QUESTIONS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 400); // Small delay for animation
  };

  // Mock Result Screen
  if (showResult) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md clay-card text-center space-y-6">
          <h2 className="text-2xl font-bold text-primary">Your Career Clarity Score</h2>
          
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center rounded-full bg-muted/50 shadow-[inset_4px_4px_8px_rgba(15,28,63,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.9)]">
             <div className="absolute inset-2 rounded-full border-4 border-secondary/20"></div>
             <div className="absolute inset-2 rounded-full border-4 border-secondary border-t-transparent border-r-transparent rotate-45"></div>
             <div className="text-5xl font-extrabold text-primary">47</div>
             <div className="absolute bottom-8 text-xs font-semibold text-muted-foreground uppercase tracking-widest">/ 100</div>
          </div>

          <div className="bg-muted p-4 rounded-xl">
             <p className="text-sm font-medium text-foreground">You're in the <strong>Exploration Zone</strong> — you have strong interests but haven't narrowed down yet.</p>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-primary/5 p-6 border border-primary/10">
            <div className="absolute inset-0 backdrop-blur-md bg-white/40 z-10 flex flex-col items-center justify-center p-4 text-center">
               <h3 className="font-bold text-primary mb-2">Sign up to unlock your full profile</h3>
               <p className="text-xs text-muted-foreground mb-4">See your top career match, strengths, and personalized roadmap.</p>
               <button onClick={() => navigate('/signup')} className="clay-btn-primary px-6 py-2 rounded-lg font-bold text-sm">
                 Create Free Account
               </button>
            </div>
            <h4 className="text-sm font-bold text-primary mb-1">Your top career match:</h4>
            <div className="h-8 bg-primary/20 rounded w-3/4 mx-auto mb-2 filter blur-sm"></div>
            <div className="h-4 bg-primary/10 rounded w-1/2 mx-auto filter blur-sm"></div>
          </div>
        </div>
      </div>
    );
  }

  const question = QUESTIONS[currentStep];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-2xl">
        
        {/* Header & Progress */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-primary">&larr; Back</Link>
          <div className="text-sm font-bold text-primary">Question {currentStep + 1} of {QUESTIONS.length}</div>
        </div>

        <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-12 shadow-inner">
          <div 
            className="h-full bg-secondary transition-all duration-500 ease-out" 
            style={{ width: `${((currentStep) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* Question Area */}
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-bold text-primary leading-tight">
            {question.text}
          </h1>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {question.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleOptionSelect(opt.id)}
              className={`w-full text-left p-6 rounded-xl transition-all duration-200 border-2 flex items-center gap-4 ${
                answers[currentStep] === opt.id 
                  ? 'border-secondary bg-secondary/5 shadow-[inset_2px_2px_4px_rgba(171,53,0,0.1)]' 
                  : 'border-transparent clay-card hover:-translate-y-1'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                answers[currentStep] === opt.id ? 'bg-secondary text-white' : 'bg-muted text-muted-foreground'
              }`}>
                {opt.id}
              </div>
              <span className="text-lg font-medium text-foreground">{opt.label}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
