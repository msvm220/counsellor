import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { UserCircle, Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', formData);
      setToken(response.data.token);
      setUser(response.data.data);
      toast.success('Login successful!');
      
      // Redirect based on role
      if (response.data.data.role === 'STUDENT') navigate('/dashboard');
      else if (response.data.data.role === 'COUNSELOR') navigate('/counselor/dashboard');
      else navigate('/');
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
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
      
      <div className="w-full max-w-md clay-card p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
          <p className="text-muted-foreground font-medium">Log in to continue your career journey.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground ml-2">Email Address</label>
            <div className="relative">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
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
            <div className="flex justify-between items-center ml-2">
              <label className="text-sm font-bold text-foreground">Password</label>
              <Link to="/forgot-password" className="text-xs font-bold text-secondary hover:underline">Forgot password?</Link>
            </div>
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
            className="clay-btn-primary w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
          Don't have an account? <Link to="/signup" className="text-secondary font-bold hover:underline">Sign up for free</Link>
        </div>
      </div>
    </div>
  );
}
