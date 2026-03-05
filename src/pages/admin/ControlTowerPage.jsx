import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveSessions } from '../../api/adminApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { Ear, AlertTriangle, RefreshCw, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const ControlTowerPage = () => {
    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState('');
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchSessions = async () => {
        setRefreshing(true);
        try {
            const data = await getActiveSessions();
            setSessions(data || []);
        } catch (err) {
            console.error("Failed to fetch sessions:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSessions();
        const interval = setInterval(fetchSessions, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleConnect = (e) => {
        e.preventDefault();
        if (!sessionId) return;
        navigate('/admin/helpdesk', { state: { sessionId } });
    };

    const activeAiCount = sessions.filter(s => s.status !== 'active_human').length;
    const humanCount = sessions.filter(s => s.status === 'active_human').length;

    if (loading) return <Loader fullScreen />;

    return (
        <div className="max-w-5xl mx-auto py-16 px-8 bg-white min-h-screen">
            <header className="mb-16 border-b-4 border-black pb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-display font-black text-black uppercase tracking-tighter flex items-center gap-5">
                        <div className="w-14 h-14 bg-black rounded-2xl grid place-items-center shadow-2xl">
                            <Ear size={32} className="text-white" />
                        </div>
                        Control Tower
                    </h1>
                    <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.4em] mt-4">Command & Signal Authorization Layer</p>
                </div>
                <button
                    onClick={fetchSessions}
                    disabled={refreshing}
                    className="p-4 bg-black text-white hover:bg-gray-800 rounded-2xl transition-all shadow-xl disabled:opacity-30"
                >
                    <RefreshCw size={24} className={refreshing ? 'animate-spin' : ''} />
                </button>
            </header>

            <div className="grid md:grid-cols-2 gap-10 mb-16">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="bg-white border-4 border-black rounded-[40px] p-10 shadow-[20px_20px_0px_rgba(0,0,0,0.05)] h-full">
                        <h2 className="text-[11px] font-black text-black uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <Shield size={18} /> Direct Intercept
                        </h2>
                        <form onSubmit={handleConnect} className="flex gap-4">
                            <input
                                type="text"
                                placeholder="UUID / SIGNAL_ID"
                                value={sessionId}
                                onChange={(e) => setSessionId(e.target.value)}
                                className="flex-1 bg-white border-4 border-black rounded-2xl p-5 text-black font-black text-xs placeholder:text-black/20 focus:outline-none focus:ring-12 focus:ring-black/5 transition-all uppercase tracking-widest"
                            />
                            <button type="submit" className="bg-black text-white px-8 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 shadow-xl transition-all">
                                Intercept
                            </button>
                        </form>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="bg-black border-4 border-black rounded-[40px] p-10 shadow-[20px_20px_0px_rgba(0,0,0,0.05)] h-full flex items-center justify-between text-white">
                        <div>
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">ACTIVE_AI_NODES</p>
                            <p className="text-6xl font-display font-black tracking-tighter">{activeAiCount}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2 italic">HUMAN_INTERVENTION</p>
                            <p className="text-6xl font-display font-black tracking-tighter opacity-100">{humanCount}</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <h2 className="text-[12px] font-black text-black uppercase tracking-[0.4em] mb-8 ml-2 flex items-center gap-3">
                <Zap size={18} /> Live Signal Streams
            </h2>

            <div className="space-y-6">
                {sessions.length === 0 && (
                    <div className="text-center py-24 text-black/10 border-4 border-dashed border-black/5 rounded-[40px]">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Signal Null Detected</p>
                    </div>
                )}

                {sessions.map((session, idx) => (
                    <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <div className="bg-white border-2 border-black rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-8 hover:shadow-[10px_10px_0px_#000] transition-all duration-300 group">
                            <div className="flex gap-6 items-center flex-1">
                                <div className={`w-4 h-4 rounded-full ${session.status === 'active_human' ? 'bg-black animate-pulse' : 'bg-gray-200'}`} />
                                <div className="flex-1">
                                    <p className="text-xl font-display font-black text-black uppercase tracking-tight group-hover:italic transition-all">
                                        {session.users?.full_name || session.users?.email || 'ANON_OBJECT'}
                                    </p>
                                    <p className="text-[9px] text-black/40 font-mono mt-1 uppercase tracking-widest">{session.id}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-black/20 uppercase tracking-widest">STREAM_INIT</p>
                                    <span className="text-[10px] font-black text-black uppercase tracking-widest">
                                        {new Date(session.created_at).toLocaleTimeString()}
                                    </span>
                                </div>
                                <button
                                    onClick={() => navigate('/admin/helpdesk', { state: { sessionId: session.id } })}
                                    className="px-10 py-4 bg-white border-2 border-black text-black rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all shadow-lg overflow-hidden relative group"
                                >
                                    <span className="relative z-10">Monitor</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ControlTowerPage;
