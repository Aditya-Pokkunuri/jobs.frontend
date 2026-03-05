import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProviderJobs } from '../../api/jobsApi';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { Briefcase, Eye, PlusCircle, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const MyListingsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const data = await getProviderJobs();
                setJobs(data);
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) return <Loader fullScreen />;

    return (
        <div className="max-w-6xl mx-auto py-16 px-8 bg-white">
            <div className="flex justify-between items-end mb-16 border-b-4 border-black pb-8">
                <div>
                    <h1 className="text-4xl font-display font-black text-black uppercase tracking-tighter">Requirement Center</h1>
                    <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.4em] mt-2">Active Network Injections</p>
                </div>
                <Link to="/provider/create">
                    <button className="bg-black text-white px-8 py-4 rounded-xl font-display font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gray-800 transition-all flex items-center gap-3 shadow-2xl">
                        <PlusCircle size={20} /> Inject New Signal
                    </button>
                </Link>
            </div>

            {jobs.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-24 bg-white rounded-[40px] border-4 border-dashed border-black/10 shadow-inner"
                >
                    <Briefcase size={80} className="mx-auto text-black/5 mb-8" />
                    <h3 className="text-2xl font-black text-black/20 uppercase tracking-tighter mb-4">Zero Signal History</h3>
                    <p className="text-[10px] font-black text-black/10 uppercase tracking-[0.3em] mb-12">No requirements found in the local node.</p>
                    <Link to="/provider/create">
                        <button className="bg-black text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-gray-800 transition-all">
                            Initialize Signal
                        </button>
                    </Link>
                </motion.div>
            ) : (
                <div className="grid gap-8">
                    {jobs.map((job, idx) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <div className="bg-white rounded-[32px] border-4 border-black p-8 flex flex-col md:flex-row justify-between items-center gap-8 hover:shadow-[12px_12px_0px_#000] transition-all duration-500 group">
                                <div className="flex-1 w-full">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-2 h-6 bg-black" />
                                        <h3 className="text-3xl font-display font-black text-black uppercase tracking-tighter group-hover:italic transition-all">{job.title}</h3>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-black/40 uppercase tracking-widest mb-6">
                                        <span className="flex items-center gap-2">
                                            <Clock size={14} />
                                            SYNC_DATE: {new Date(job.created_at).toLocaleDateString()}
                                        </span>
                                        <div className="w-1 h-1 bg-black/20 rounded-full" />
                                        <span className="flex items-center gap-2 text-black italic">
                                            <Zap size={14} />
                                            STATUS: {job.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        {job.skills_required?.slice(0, 5).map((skill, idx) => (
                                            <span key={idx} className="px-4 py-2 bg-black text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <Link to={`/jobs/${job.id}`} className="w-full md:w-auto">
                                    <button className="w-full md:w-auto bg-white border-4 border-black text-black px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all transition-all duration-300 shadow-xl flex items-center justify-center gap-3">
                                        <Eye size={20} /> View Stream
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyListingsPage;
