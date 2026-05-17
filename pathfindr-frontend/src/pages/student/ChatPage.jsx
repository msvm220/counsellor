import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { Send, Smile, Paperclip, ChevronLeft, Video, Phone } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { motion } from 'framer-motion';

const ChatPage = () => {
  const { bookingId } = useParams();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [counselorName, setCounselorName] = useState('Your Counselor');
  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const typingTimeout = useRef(null);

  useEffect(() => {
    fetchHistory();

    const token = localStorage.getItem('token');
    
    socketRef.current = io(import.meta.env.VITE_API_URL.replace('/api', ''), {
      transports: ['websocket'],
      withCredentials: true,
      auth: {
        token: token
      }
    });

    socketRef.current.emit('join_chat', { bookingId });

    socketRef.current.on('new_message', (msg) => {
      // Only add if it's NOT from the current user (own messages added optimistically)
      if (msg.senderId !== user?.id) {
        setMessages((prev) => [...prev, msg]);
      }
      scrollToBottom();
    });

    socketRef.current.on('user_typing', ({ userName }) => {
      setTypingUser(userName);
      setIsTyping(true);
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setIsTyping(false), 3000);
    });

    return () => {
      socketRef.current?.emit('leave_chat', { bookingId });
      socketRef.current?.disconnect();
      clearTimeout(typingTimeout.current);
    };
  }, [bookingId]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/chat/history/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.data || []);
      // Also fetch counselor name from booking
      const bookingRes = await axios.get(`${import.meta.env.VITE_API_URL}/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (bookingRes.data.data?.counselorProfile?.user?.name) {
        setCounselorName(bookingRes.data.data.counselorProfile.user.name);
      }
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      console.error('Failed to fetch chat history:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current) return;

    // Optimistic update — add message to UI immediately
    const optimisticMsg = {
      id: `opt_${Date.now()}`,
      bookingId,
      senderId: user?.id,
      content: newMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    scrollToBottom();

    socketRef.current.emit('send_message', {
      bookingId,
      senderId: user?.id,
      content: newMessage,
      userName: user?.name,
    });

    setNewMessage('');
  };

  const handleTyping = () => {
    if (socketRef.current) {
      socketRef.current.emit('typing', { bookingId, userName: user?.name });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background font-sans text-foreground">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between shadow-lg z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-xl transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-white font-black shadow-lg">
              {counselorName[0]?.toUpperCase() || 'C'}
            </div>
            <div>
              <h2 className="font-black leading-none mb-1">{counselorName}</h2>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest">
                  {isTyping ? `${typingUser} is typing...` : 'Active Now'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            title="Voice Call (Coming Soon)"
            className="p-3 hover:bg-white/10 rounded-xl transition-all opacity-50 cursor-not-allowed"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate(`/session/video/${bookingId}`)}
            title="Join Video Call"
            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-xl font-bold text-sm hover:bg-accent/90 transition-all shadow-lg active:scale-95"
          >
            <Video className="w-4 h-4" />
            Join Video
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-bold text-muted-foreground">No messages yet.<br />Start the conversation!</p>
          </div>
        )}
        {messages.map((msg, idx) => {
          const isOwn = msg.senderId === user?.id;
          return (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              key={msg.id || idx}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-5 py-4 rounded-3xl shadow-sm ${
                  isOwn
                    ? 'bg-secondary text-white rounded-tr-none'
                    : 'clay-card rounded-tl-none !py-3 !px-5'
                }`}
              >
                <p className="font-medium leading-relaxed text-sm">{msg.content}</p>
                <div className={`text-[10px] mt-2 font-bold ${isOwn ? 'text-white/50 text-right' : 'text-muted-foreground'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background border-t border-border">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button className="p-3 text-muted-foreground hover:text-secondary transition-all rounded-xl hover:bg-muted">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="relative flex-grow">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="clay-input w-full px-6 py-4 rounded-2xl font-medium text-sm pr-12"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary transition-all">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="p-4 clay-btn-primary rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
