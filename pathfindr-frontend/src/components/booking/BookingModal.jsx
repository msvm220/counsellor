import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, X, CheckCircle, MessageSquare, Video } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const BookingModal = ({ counselor, isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Select Slot, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const navigate = useNavigate();

  // Generate dynamic future slots (next 4 available days at 10am and 2pm)
  const generateSlots = () => {
    const slots = [];
    const now = new Date();
    let day = new Date(now);
    day.setDate(day.getDate() + 1); // Start from tomorrow
    while (slots.length < 4) {
      const morning = new Date(day);
      morning.setHours(10, 0, 0, 0);
      const afternoon = new Date(day);
      afternoon.setHours(14, 0, 0, 0);
      slots.push(morning.toISOString());
      if (slots.length < 4) slots.push(afternoon.toISOString());
      day.setDate(day.getDate() + 1);
    }
    return slots;
  };
  const availableSlots = generateSlots();

  const handleBooking = async () => {
    setLoading(true);
    try {
      // 1. Create Free Booking on Backend
      const res = await api.post('/bookings/create', {
        counselorProfileId: counselor.id,
        scheduledAt: selectedSlot,
        amountInr: 0, // Free Session
        sessionType: 'STUDENT_SESSION'
      });

      const { booking } = res.data.data;
      setBookingId(booking.id);

      // Successfully booked free session
      toast.success("Free Session Confirmed!");
      setStep(3); // Move to Success Screen directly

    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-background rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden relative border border-border/50"
      >
        <button onClick={onClose} className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors z-20">
          <X className="w-6 h-6" />
        </button>

        <div className="p-10">
          {step === 1 && (
            <>
              <h2 className="text-3xl font-black text-primary mb-2 tracking-tight">Select a Session</h2>
              <p className="text-muted-foreground mb-8 font-medium">Pick a time that works best for you with <span className="text-secondary font-bold">{counselor.user.name}</span>.</p>
              
              <div className="grid grid-cols-1 gap-4 mb-8">
                {availableSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                      selectedSlot === slot 
                      ? 'bg-accent/10 border-accent text-accent shadow-inner' 
                      : 'bg-white border-border hover:border-accent/30 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <Calendar className={`w-5 h-5 ${selectedSlot === slot ? 'text-accent' : 'opacity-40'}`} />
                      <span className="font-black text-sm uppercase tracking-wider">
                        {new Date(slot).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 opacity-30" />
                      <span className="font-bold text-sm">
                        {new Date(slot).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                disabled={!selectedSlot}
                onClick={() => setStep(2)}
                className="clay-btn-primary w-full py-5 rounded-2xl font-black text-lg shadow-xl disabled:opacity-50 transition-all active:scale-95"
              >
                Proceed to Confirmation
              </button>
            </>
          )}

          {step === 2 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-primary mb-2 tracking-tight">Confirm Free Session</h2>
              <p className="text-muted-foreground mb-8 font-medium">Review your 45-minute consultation details.</p>

              <div className="clay-card !bg-muted/30 border border-border/50 p-8 mb-8 text-left">
                <div className="flex justify-between mb-3">
                  <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Session with</span>
                  <span className="font-black text-primary">{counselor.user.name}</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Duration</span>
                  <span className="font-black text-primary">45 Minutes</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Slot</span>
                  <span className="font-black text-primary">
                    {selectedSlot ? new Date(selectedSlot).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </span>
                </div>
                <div className="border-t border-border pt-5 flex justify-between items-center">
                  <span className="font-black text-primary uppercase text-xs tracking-widest">Total Cost</span>
                  <span className="font-black text-emerald-600 text-3xl">FREE</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 text-muted-foreground font-black uppercase text-xs tracking-widest hover:text-primary transition-all"
                >
                  Go Back
                </button>
                <button
                  onClick={handleBooking}
                  disabled={loading}
                  className="flex-[2] clay-btn-primary py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95"
                >
                  {loading ? 'Booking...' : 'Confirm Free Session'}
                </button>
              </div>
              <p className="mt-8 text-[9px] text-muted-foreground/50 uppercase font-black tracking-[0.2em]">Free during our launch phase 🎉</p>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }}
                className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
              >
                <CheckCircle className="w-14 h-14" />
              </motion.div>
              <h2 className="text-3xl font-black text-primary mb-2 tracking-tight">You're All Set!</h2>
              <p className="text-muted-foreground mb-10 font-medium">Booking confirmed with <span className="text-secondary font-bold">{counselor.user.name}</span>. Time to get started!</p>
              
              <div className="space-y-4">
                <button
                  onClick={() => navigate(`/session/chat/${bookingId}`)}
                  className="w-full clay-btn-primary bg-secondary hover:bg-secondary/90 py-5 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  <MessageSquare className="w-6 h-6" /> Start Chat
                </button>
                <button
                  onClick={() => navigate(`/session/video/${bookingId}`)}
                  className="w-full bg-accent text-accent-foreground py-5 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3 hover:bg-accent/90 transition-all active:scale-95"
                >
                  <Video className="w-6 h-6" /> Join Video Call
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-4 text-muted-foreground font-black uppercase text-xs tracking-widest hover:text-primary transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default BookingModal;
