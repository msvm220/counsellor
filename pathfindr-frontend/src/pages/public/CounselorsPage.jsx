import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { 
  Search, Filter, Star, Video, MessageSquare, 
  Briefcase, Heart, Activity, Wallet, Scale, 
  CreditCard, Sparkles, Users 
} from 'lucide-react';
import BookingModal from '../../components/booking/BookingModal';

const categories = [
  { id: 'Career', label: 'Career', icon: Briefcase },
  { id: 'Marriage', label: 'Marriage', icon: Heart },
  { id: 'Health', label: 'Health', icon: Activity },
  { id: 'Wealth', label: 'Wealth', icon: Wallet },
  { id: 'Legal', label: 'Legal', icon: Scale },
  { id: 'Finance', label: 'Finance', icon: CreditCard },
  { id: 'Remedies', label: 'Remedies', icon: Sparkles },
  { id: 'Parents', label: 'Parents', icon: Users },
];

export default function CounselorsPage() {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      const res = await api.get('/counselors');
      setCounselors(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching counselors:', err);
      setLoading(false);
    }
  };

  const handleBook = (counselor) => {
    setSelectedCounselor(counselor);
    setIsModalOpen(true);
  };

  const filteredCounselors = counselors.filter(c => {
    const matchesSearch = c.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.specializations?.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || c.specializations?.some(e => e.toLowerCase() === selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Header */}
      <header className="px-6 lg:px-12 py-12 bg-primary text-primary-foreground shadow-lg overflow-hidden relative">
        <div className="flex items-center justify-between mb-8 relative z-10">
          <Link to="/" className="text-sm font-bold opacity-80 hover:opacity-100 flex items-center gap-2">
            <span>&larr;</span> Back to Home
          </Link>
        </div>
        <div className="max-w-6xl relative z-10">
          <h1 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">Expert Guidance for Every Dimension.</h1>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl font-medium">Connect with verified professionals in Love, Career, Health, Finance, Legal, and more.</p>
          
          {/* New Filter Bar */}
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-2xl overflow-x-auto no-scrollbar max-w-full">
            {/* Search Box */}
            <div className="flex items-center bg-input/50 rounded-xl overflow-hidden border border-border min-w-[280px]">
              <div className="bg-secondary p-3.5 flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <input 
                type="text" 
                placeholder="Search name or expertise..." 
                className="bg-transparent px-4 py-2 focus:outline-none text-sm font-bold text-foreground w-full placeholder:text-muted-foreground/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Button */}
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-border rounded-xl text-sm font-bold text-muted-foreground hover:bg-muted/50 transition-all shadow-sm shrink-0">
              <Filter className="w-4 h-4" /> Filter
            </button>

            <div className="h-10 w-[1px] bg-border mx-1 shrink-0" />

            {/* Category Chips */}
            <div className="flex items-center gap-2 pr-2">
              {categories.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border-2 transition-all whitespace-nowrap shadow-sm group ${
                    selectedCategory === cat.id 
                      ? 'bg-accent/10 border-accent text-accent ring-2 ring-accent/20' 
                      : 'bg-white border-border text-muted-foreground hover:border-accent/50 hover:bg-muted/30'
                  }`}
                >
                  <cat.icon className={`w-4 h-4 text-accent group-hover:scale-110 transition-transform`} />
                  <span className="text-sm font-bold tracking-tight">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Abstract shapes for premium feel */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute right-40 bottom-0 w-64 h-64 bg-accent/20 rounded-full blur-2xl" />
      </header>

      {/* Main Content */}
      <main className="px-6 lg:px-12 py-16 max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-3xl font-black text-primary tracking-tight">Top Rated Counselors</h2>
          <div className="flex items-center gap-2 bg-background px-4 py-2 rounded-xl shadow-sm border border-border">
             <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
             <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{filteredCounselors.length} Experts Available Now</span>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="clay-card h-80 animate-pulse" />
            ))}
          </div>
        ) : filteredCounselors.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-muted-foreground">No counselors found matching your criteria.</h3>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedCategory(null);}}
              className="mt-4 text-primary font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCounselors.map(counselor => (
              <div key={counselor.id} className="clay-card flex flex-col group hover:-translate-y-2 transition-transform duration-500">
                <div className="flex gap-6 mb-8">
                  <div className="relative">
                    <img src={counselor.user?.avatarUrl || `https://i.pravatar.cc/150?u=${counselor.id}`} alt={counselor.user?.name} className="w-24 h-24 rounded-3xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground p-1 rounded-lg border-4 border-background">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-primary group-hover:text-secondary transition-colors">{counselor.user?.name || 'Expert Counselor'}</h3>
                    <p className="text-sm font-bold text-muted-foreground mb-3 line-clamp-1">{counselor.bio || 'Life Strategy Expert'}</p>
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-black bg-accent/10 text-accent px-3 py-1 rounded-full uppercase tracking-tighter">
                          Verified Expert
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8 flex-grow">
                  {(counselor.specializations?.length > 0 ? counselor.specializations : ['Love', 'Career', 'Wealth']).map(spec => (
                    <span key={spec} className="px-3 py-1.5 bg-muted text-[10px] font-black rounded-xl text-muted-foreground uppercase tracking-widest border border-border">
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border mt-auto">
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-black uppercase tracking-widest mb-1">Session Fee</span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-black text-primary text-2xl">₹199</span>
                      <span className="text-muted-foreground/50 text-sm line-through">₹1500</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => toast('Please book a session to start chatting with this expert.', { icon: '📅' })}
                      className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-secondary/10 hover:text-secondary transition-all"
                    >
                      <MessageSquare className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => handleBook(counselor)}
                      className="clay-btn-primary px-8 rounded-2xl font-black text-sm flex items-center gap-2 transition-all active:scale-95"
                    >
                      <Video className="w-5 h-5" /> Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedCounselor && (
        <BookingModal 
          counselor={selectedCounselor}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
