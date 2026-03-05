import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getActiveSessions, getSessionDetails, sendAdminMessage } from '../../api/adminApi';
import { Bot, User, MessageSquare, Clock, Shield, Zap, CheckCircle, ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../../api/client';

const HelpDeskPage = () => {
    const location = useLocation();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSessionId, setSelectedSessionId] = useState(
        location.state?.sessionId || null
    );

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const data = await getActiveSessions();
                setSessions(data || []);
            } catch (err) {
                console.error('Failed to fetch sessions:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
        const interval = setInterval(fetchSessions, 15000); // refresh list every 15s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-black tracking-tight text-black">Help Desk Monitor</h1>
                    <p className="text-sm text-gray-500 mt-1">View and intercept live chat sessions.</p>
                </div>
                <Link to="/admin/tower" className="flex items-center gap-2 text-sm font-bold text-black/50 hover:text-black transition-colors">
                    <ArrowLeft size={16} /> Control Tower
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
                {/* Sessions list */}
                <div className="col-span-1 bg-white border-2 border-black rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b-2 border-black bg-gray-50 flex items-center gap-2">
                        <MessageSquare size={16} />
                        <span className="text-xs font-black uppercase tracking-widest">Active Sessions</span>
                    </div>
                    <div className="overflow-y-auto flex-1 p-3 space-y-2">
                        {loading && <p className="text-xs text-gray-400 p-4 animate-pulse">Loading...</p>}
                        {!loading && sessions.length === 0 && (
                            <p className="text-xs text-gray-400 text-center p-8">No active sessions.</p>
                        )}
                        {sessions.map(session => {
                            const isSelected = session.id === selectedSessionId;
                            return (
                                <button
                                    key={session.id}
                                    onClick={() => setSelectedSessionId(session.id)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isSelected
                                        ? 'bg-black text-white border-black'
                                        : 'border-transparent hover:border-black/10 hover:bg-black/5'
                                        }`}
                                >
                                    <div className="text-xs font-bold truncate">
                                        {session.users?.full_name || session.users?.email || 'Anonymous'}
                                    </div>
                                    <div className={`text-[10px] mt-1 flex items-center gap-1.5 ${isSelected ? 'opacity-50' : 'text-gray-400'}`}>
                                        <Clock size={10} />
                                        {session.created_at ? new Date(session.created_at).toLocaleTimeString() : '—'}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Chat viewer */}
                <div className="col-span-1 lg:col-span-2">
                    {selectedSessionId
                        ? <AdminChatViewer sessionId={selectedSessionId} />
                        : (
                            <div className="h-full border-2 border-dashed border-black/10 rounded-2xl grid place-items-center text-center p-12">
                                <div>
                                    <Shield size={48} className="text-black/10 mx-auto mb-4" />
                                    <p className="text-sm font-medium text-black/40">Select a session to monitor</p>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};


// ── Admin Chat Viewer ──────────────────────────────────────────

const AdminChatViewer = ({ sessionId }) => {
    const [messages, setMessages] = useState([]);
    const [intercepted, setIntercepted] = useState(false);
    const [intercepting, setIntercepting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    // Poll session details instead of WebSocket to avoid disconnecting the seeker
    useEffect(() => {
        let isMounted = true;

        const fetchDetails = async () => {
            try {
                const session = await getSessionDetails(sessionId);
                if (!isMounted) return;

                let log = session.conversation_log || [];
                if (typeof log === 'string') {
                    try { log = JSON.parse(log); } catch { log = []; }
                }
                setMessages(log);

                // If expert system notification exists, mark intercepted
                if (log.some(m => m.role === 'system' && m.content.includes('expert'))) {
                    setIntercepted(true);
                }
            } catch (err) {
                console.error('Failed to fetch session details:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchDetails();
        const interval = setInterval(fetchDetails, 3000); // 3-second polling

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [sessionId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleIntercept = async () => {
        setIntercepting(true);
        try {
            await api.post(`/admin/sessions/${sessionId}/intercept`);
            setIntercepted(true);
        } catch (err) {
            console.error('Intercept failed:', err);
        } finally {
            setIntercepting(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || sending) return;

        const text = inputValue.trim();
        setInputValue('');
        setSending(true);

        // Optimistic update
        setMessages(prev => [...prev, {
            role: 'admin',
            content: text,
            timestamp: new Date().toISOString()
        }]);

        try {
            await sendAdminMessage(sessionId, text);
        } catch (err) {
            console.error('Failed to send admin message:', err);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-white border-2 border-black rounded-2xl overflow-hidden flex flex-col h-full min-h-[500px]">
            {/* Header */}
            <div className="px-6 py-4 border-b-2 border-black bg-gray-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest text-black/60">
                        Live Polling
                    </span>
                    <span className="text-xs font-mono text-black/30">{sessionId.slice(0, 12)}...</span>
                </div>
                <button
                    onClick={handleIntercept}
                    disabled={intercepted || intercepting}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${intercepted
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-black text-white hover:bg-gray-800 shadow-lg'
                        }`}
                >
                    {intercepted
                        ? <><CheckCircle size={14} /> Expert Joined</>
                        : <><Zap size={14} /> {intercepting ? 'Joining...' : 'Intercept'}</>
                    }
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                {loading && messages.length === 0 && (
                    <div className="h-full grid place-items-center text-black/20 text-xs font-medium text-center">
                        Loading chat history...
                    </div>
                )}
                {!loading && messages.length === 0 && (
                    <div className="h-full grid place-items-center text-black/20 text-xs font-medium text-center">
                        Waiting for messages...
                    </div>
                )}
                {messages.map((msg, idx) => {
                    const isUser = msg.role === 'user';
                    const isSystem = msg.role === 'system';
                    const isAdmin = msg.role === 'admin';

                    if (isSystem) {
                        return (
                            <div key={idx} className="flex justify-center">
                                <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-full flex items-center gap-2">
                                    <Shield size={12} /> {msg.content}
                                </span>
                            </div>
                        );
                    }

                    return (
                        <div key={idx} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-lg grid place-items-center shrink-0 border-2 text-sm ${isUser
                                ? 'bg-black border-black text-white'
                                : isAdmin
                                    ? 'bg-indigo-600 border-indigo-600 text-white'
                                    : 'bg-gray-100 border-transparent text-black'
                                }`}>
                                {isUser ? <User size={14} /> : isAdmin ? <Shield size={14} /> : <Bot size={14} />}
                            </div>
                            <div className={`max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
                                <div className={`p-4 rounded-2xl text-xs leading-relaxed ${isUser
                                    ? 'bg-black text-white rounded-tr-sm'
                                    : isAdmin
                                        ? 'bg-indigo-50 border-2 border-indigo-200 text-indigo-900 rounded-tl-sm shadow-[4px_4px_0px_#4f46e5]'
                                        : 'bg-white border-2 border-black text-black rounded-tl-sm shadow-[4px_4px_0px_#000]'
                                    }`}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                </div>
                                <div className="text-[10px] text-gray-400 mt-1 px-1">
                                    {isUser ? 'User' : isAdmin ? 'You' : 'Coach'} · {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form (Only if intercepted) */}
            {intercepted && (
                <div className="p-4 border-t-2 border-black bg-gray-50 flex items-center gap-3 shrink-0">
                    <form onSubmit={handleSend} className="flex-1 flex gap-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type a message to the seeker..."
                            className="flex-1 bg-white border-2 border-black rounded-xl px-4 py-3 text-xs font-bold text-black placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-black/10 transition-all"
                            disabled={sending}
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || sending}
                            className="bg-black text-white px-6 py-3 rounded-xl flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 transition-all font-bold text-xs"
                        >
                            {sending ? '...' : <Send size={16} />}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default HelpDeskPage;
