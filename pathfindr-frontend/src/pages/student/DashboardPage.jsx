import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Map, Calendar, Target, Award, PlayCircle, BookMarked, Bell, LogOut, Video, MessageSquare, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../api/axios';

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const [assessmentStatus, setAssessmentStatus] = useState({ hasTaken: false, latestResult: null });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statusRes, bookingsRes] = await Promise.all([
        api.get('/assessment/status'),
        api.get('/bookings/my-bookings')
      ]);
      setAssessmentStatus(statusRes.data.data);
      setBookings(bookingsRes.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex">
      {/* Sidebar */}
      <aside className="w-72 bg-primary text-primary-foreground flex-shrink-0 hidden lg:flex flex-col shadow-2xl relative z-20">
        <div className="p-8 flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-white font-black shadow-lg">P</div>
          <span className="font-black text-2xl tracking-tighter">PathFindr</span>
        </div>
        <nav className="flex-grow p-6 space-y-3">
          <Link to="/dashboard" className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-white/10 font-black transition-all shadow-inner">
            <Map className="w-5 h-5 text-secondary" /> Life Roadmap
          </Link>
          <Link to="/counselors" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-white/60 hover:bg-white/5 hover:text-white transition-all font-black">
            <Calendar className="w-5 h-5" /> Explore Experts
          </Link>
          <Link to="/resources" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-white/60 hover:bg-white/5 hover:text-white transition-all font-black">
            <BookMarked className="w-5 h-5" /> Resources
          </Link>
        </nav>
        <div className="p-6 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-5 py-4 rounded-2xl text-white/40 hover:bg-red-500/10 hover:text-red-400 transition-all font-black w-full"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="px-10 py-8 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-10 border-b border-border/50">
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tight">Welcome back, {user?.name || 'Explorer'}!</h1>
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest mt-1">Ready for your holistic growth session?</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-border flex items-center justify-center text-secondary relative hover:shadow-md transition-all">
              <Bell className="w-6 h-6" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="px-10 py-10 space-y-12">
          
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="clay-card p-8 flex items-center gap-6 group hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Target className="w-7 h-7" />
              </div>
              <div>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Life Harmony</div>
                <div className="text-3xl font-black text-primary">
                  {loading ? '...' : (assessmentStatus.hasTaken ? `${assessmentStatus.latestResult.clarityScore}%` : 'N/A')}
                </div>
              </div>
            </div>
            
            <div className="clay-card p-8 flex items-center gap-6 group hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Growth Tier</div>
                <div className="text-3xl font-black text-primary uppercase">Explorer</div>
              </div>
            </div>

            <div className="clay-card p-8 flex items-center gap-6 group hover:-translate-y-1 transition-transform">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Active Sessions</div>
                <div className="text-3xl font-black text-primary">{bookings.length} Booked</div>
              </div>
            </div>
          </div>

          {/* Active Sessions Section */}
          {bookings.length > 0 && (
            <section>
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-black text-primary tracking-tight">Upcoming Consultations</h2>
                 <Link to="/counselors" className="text-sm font-bold text-secondary flex items-center gap-1 hover:underline">
                   Book More <ChevronRight className="w-4 h-4" />
                 </Link>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {bookings.slice(0, 2).map(booking => (
                   <div key={booking.id} className="clay-card p-6 border-l-4 border-secondary flex items-center justify-between">
                     <div className="flex items-center gap-4">
                       <img 
                        src={booking.counselorProfile?.user?.avatarUrl || `https://i.pravatar.cc/100?u=${booking.id}`} 
                        className="w-16 h-16 rounded-2xl object-cover shadow-md"
                       />
                       <div>
                         <h3 className="font-black text-primary">{booking.counselorProfile?.user?.name}</h3>
                         <p className="text-xs font-bold text-muted-foreground">
                           {new Date(booking.scheduledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at {new Date(booking.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                         </p>
                       </div>
                     </div>
                     <div className="flex gap-2">
                       <button 
                        onClick={() => navigate(`/session/chat/${booking.id}`)}
                        className="p-3 bg-muted hover:bg-secondary/10 hover:text-secondary rounded-xl transition-all"
                       >
                         <MessageSquare className="w-5 h-5" />
                       </button>
                       <button 
                        onClick={() => navigate(`/session/video/${booking.id}`)}
                        className="p-3 bg-secondary text-white rounded-xl shadow-lg hover:bg-secondary/90 transition-all active:scale-95"
                       >
                         <Video className="w-5 h-5" />
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
            </section>
          )}

          {/* Assessment CTA */}
          {!assessmentStatus.hasTaken && !loading && (
            <section className="bg-gradient-to-br from-primary to-secondary rounded-[2.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10 max-w-xl">
                <h2 className="text-4xl font-black mb-4 leading-tight">Master Your Life Dimensions</h2>
                <p className="text-white/80 mb-8 font-medium text-lg leading-relaxed">
                  Take the Life Harmony Audit to understand your balance across Health, Wealth, Love, and Legal domains. Unlock personalized expert recommendations.
                </p>
                <button 
                  onClick={() => navigate('/dashboard/assessment')}
                  className="bg-white text-secondary px-10 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-all active:scale-95"
                >
                  Start Harmony Audit
                </button>
              </div>
              <div className="absolute -right-20 -bottom-20 opacity-10">
                <Target className="w-96 h-96" />
              </div>
              <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-3xl animate-pulse" />
            </section>
          )}

          {/* Result Link if taken */}
          {assessmentStatus.hasTaken && (
             <section className="clay-card p-10">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-2xl font-black text-primary tracking-tight">Harmony Audit Results</h2>
                   <button 
                     onClick={() => navigate('/dashboard/results')}
                     className="bg-secondary/10 text-secondary px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-secondary hover:text-white transition-all"
                   >
                     View Analysis
                   </button>
                </div>
                <div className="flex items-center gap-10">
                   <div className="w-28 h-28 rounded-full border-[8px] border-secondary/20 border-t-secondary flex items-center justify-center shadow-inner relative">
                      <span className="text-3xl font-black text-primary">{assessmentStatus.latestResult.clarityScore}%</span>
                   </div>
                   <div className="flex-grow">
                      <p className="text-muted-foreground font-bold text-lg mb-4">Your life balance is improving! We've identified key growth areas for you.</p>
                      <div className="flex flex-wrap gap-3">
                        {assessmentStatus.latestResult.strengthTags?.map(tag => (
                          <span key={tag} className="text-[10px] font-black bg-muted text-muted-foreground px-4 py-2 rounded-xl border border-border uppercase tracking-widest">
                            {tag}
                          </span>
                        ))}
                      </div>
                   </div>
                </div>
             </section>
          )}

        </div>
      </main>
    </div>
  );
}
