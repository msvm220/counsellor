import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AssessmentPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/assessment/questions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setLoading(false);
    }
  };

  const handleSelect = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const formattedAnswers = Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        value
      }));

      await axios.post(`${import.meta.env.VITE_API_URL}/assessment/submit`, 
        { answers: formattedAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      navigate('/dashboard/results');
    } catch (err) {
      console.error('Submission failed:', err);
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen bg-slate-50">Loading Questions...</div>;

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex flex-col items-center font-sans text-foreground">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="w-full bg-muted h-3 rounded-full mb-8 overflow-hidden shadow-inner">
          <motion.div 
            className="bg-accent h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="clay-card"
          >
            <span className="text-accent font-bold mb-2 block uppercase tracking-widest text-xs">
              {currentQuestion.category} • {currentStep + 1} of {questions.length}
            </span>
            <h2 className="text-2xl font-bold text-primary mb-8 leading-relaxed">
              {currentQuestion.questionText}
            </h2>

            <div className="space-y-4">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(currentQuestion.id, opt.value)}
                  className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border-2 ${
                    answers[currentQuestion.id] === opt.value
                      ? 'bg-accent/10 border-accent shadow-inner'
                      : 'bg-input border-transparent hover:border-accent/30 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                      answers[currentQuestion.id] === opt.value ? 'border-accent bg-accent' : 'border-border'
                    }`}>
                      {answers[currentQuestion.id] === opt.value && <div className="w-2 h-2 bg-background rounded-full" />}
                    </div>
                    <span className={`text-lg ${answers[currentQuestion.id] === opt.value ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                      {opt.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-12 flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${
                  currentStep === 0 ? 'text-muted-foreground/50' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                disabled={!answers[currentQuestion.id] || submitting}
                className="clay-btn-primary px-10 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                {currentStep === questions.length - 1 ? (submitting ? 'Calculating...' : 'Finish') : 'Next Question'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AssessmentPage;
