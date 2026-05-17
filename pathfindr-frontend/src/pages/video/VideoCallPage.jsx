import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

const VideoCallPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBooking(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching booking:', err);
      toast.error('Could not load session details');
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white font-black uppercase text-xs tracking-widest">Entering Video Room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all backdrop-blur-md"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-white font-black text-xl leading-none mb-1">Session with {booking?.counselorProfile?.user?.name || 'Expert'}</h1>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted</p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate(`/session/chat/${bookingId}`)}
          className="px-6 py-3 bg-secondary text-white rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl hover:bg-secondary/90 transition-all active:scale-95 backdrop-blur-md"
        >
          <MessageSquare className="w-4 h-4" /> Open Chat
        </button>
      </div>

      {/* Jitsi Iframe */}
      <div className="flex-grow relative">
        <iframe
          title="Video Session"
          src={`${booking?.videoRoomUrl}`}
          allow="camera; microphone; display-capture; autoplay; clipboard-write"
          className="w-full h-full border-none"
        />
        
        {/* Connection Visualizers (Purely Aesthetic) */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-1 opacity-20 pointer-events-none">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="w-1 h-8 bg-accent rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>

      {/* Controls Footer */}
      <div className="p-8 flex items-center justify-center gap-6 bg-slate-900 border-t border-white/5 z-20">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`p-5 rounded-3xl transition-all shadow-xl active:scale-90 ${isMuted ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}
        >
          {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>
        
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-6 bg-red-500 text-white rounded-[2rem] shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:bg-red-600 transition-all active:scale-95 group"
        >
          <PhoneOff className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </button>

        <button 
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`p-5 rounded-3xl transition-all shadow-xl active:scale-90 ${isVideoOff ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}
        >
          {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};

export default VideoCallPage;
