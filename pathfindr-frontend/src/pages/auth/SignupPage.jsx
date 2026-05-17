import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { UserCircle, Lock, Mail, Loader2, Briefcase } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STUDENT' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/signup', formData);
      setToken(response.data.token);
      setUser(response.data.data);
      toast.success('Account created successfully!');
      
      if (formData.role === 'STUDENT') navigate('/dashboard');
      else if (formData.role === 'COUNSELOR') navigate('/counselor/dashboard');
      else navigate('/');
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 font-sans">
      <Link to="/" className="absolute top-6 left-6 font-bold text-xl text-primary flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">P</div>
        PathFindr
      </Link>
      
      <div className="w-full max-w-md clay-card p-8 md:p-10 my-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
          <p className="text-muted-foreground font-medium">Start your career journey with PathFindr.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground ml-2">I am a...</label>
            <div className="flex gap-4">
               <button 
                 type="button"
                 onClick={() => setFormData({...formData, role: 'STUDENT'})}
                 className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${formData.role === 'STUDENT' ? 'border-primary bg-primary/5 text-primary' : 'border-transparent bg-muted text-muted-foreground hover:bg-muted/80'}`}
               >
                 Student
               </button>
               <button 
                 type="button"
                 onClick={() => setFormData({...formData, role: 'COUNSELOR'})}
                 className={`flex-1 py-3 rounded-xl font-bold text-sm border-2 transition-all ${formData.role === 'COUNSELOR' ? 'border-secondary bg-secondary/5 text-secondary' : 'border-transparent bg-muted text-muted-foreground hover:bg-muted/80'}`}
               >
                 Counselor
               </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground ml-2">Full Name</label>
            <div className="relative">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                required
                placeholder="John Doe"
                className="clay-input w-full pl-12 pr-4 py-3 rounded-xl font-medium"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground ml-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="clay-input w-full pl-12 pr-4 py-3 rounded-xl font-medium"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground ml-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="clay-input w-full pl-12 pr-4 py-3 rounded-xl font-medium"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="clay-btn-primary w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in here</Link>
        </div>
      </div>
    </div>
  );
}
