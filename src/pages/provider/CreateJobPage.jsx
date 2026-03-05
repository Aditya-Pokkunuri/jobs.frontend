import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../../api/jobsApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Briefcase, Info, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const CreateJobPage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [skillsInput, setSkillsInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const skillsRequired = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

        try {
            await createJob({
                title,
                description_raw: description,
                skills_required: skillsRequired
            });
            navigate('/provider/listings');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'OBJECT_CREATION_FAILED');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-16 px-6 bg-white">
            <header className="mb-16 border-b-4 border-black pb-8">
                <h1 className="text-4xl font-display font-black text-black uppercase tracking-tighter">Publish Requirement</h1>
                <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.4em] mt-2">Inject New Job Object into Network</p>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white border-4 border-black rounded-[40px] p-12 shadow-[20px_20px_0px_#000]"
            >
                <form onSubmit={handleSubmit} className="space-y-10">
                    {error && (
                        <div className="bg-black text-white p-5 rounded-2xl border-2 border-black text-[10px] font-black uppercase tracking-widest text-center italic">
                            EXCEPTION: {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4 ml-1">Requirement Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-white border-2 border-black rounded-2xl p-5 text-black font-bold text-sm placeholder:text-gray-300 focus:outline-none focus:ring-8 focus:ring-black/5 transition-all uppercase tracking-widest"
                            placeholder="e.g. SYSTEMS_ARCHITECT"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4 ml-1">Intelligence Parameters / Description</label>
                        <textarea
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={8}
                            className="w-full bg-white border-2 border-black rounded-2xl p-6 text-black font-medium text-sm placeholder:text-gray-300 focus:outline-none focus:ring-8 focus:ring-black/5 transition-all uppercase tracking-wider leading-relaxed"
                            placeholder="Define the scope, expectations, and logic requirements..."
                        />
                        <p className="text-[9px] font-black text-black/30 mt-3 flex items-center gap-2 uppercase tracking-widest">
                            <Info size={14} /> Min_Char_Threshold: 20
                        </p>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-4 ml-1">Required Scalars / Skills</label>
                        <input
                            type="text"
                            value={skillsInput}
                            onChange={(e) => setSkillsInput(e.target.value)}
                            className="w-full bg-white border-2 border-black rounded-2xl p-5 text-black font-bold text-sm placeholder:text-gray-300 focus:outline-none focus:ring-8 focus:ring-black/5 transition-all uppercase tracking-widest"
                            placeholder="NODE, RUST, TYPESCRIPT (COMMA_SEP)"
                        />
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-6 rounded-2xl font-display font-black text-[11px] uppercase tracking-[0.3em] hover:bg-gray-800 transition-all flex items-center justify-center gap-4 shadow-2xl disabled:opacity-30 active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <Sparkles size={20} className="animate-pulse" />
                                    TRANSMITTING_SYSTEM_OBJECT...
                                </>
                            ) : (
                                <>
                                    <Briefcase size={20} />
                                    Publish Requirement
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateJobPage;
