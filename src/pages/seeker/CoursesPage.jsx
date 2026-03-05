import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const CoursesPage = () => {
    return (
        <div className="max-w-2xl mx-auto py-16 px-6 bg-white">
            {/* Page Header */}
            <header className="mb-16 border-b-4 border-black pb-8">
                <h1 className="text-4xl font-display font-black text-black uppercase tracking-tighter">
                    Your Learning Path
                </h1>
                <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.4em] mt-2">
                    Exclusive cohorts and upskilling resources to bridge your gaps.
                </p>
            </header>

            {/* Flagship Course Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group bg-white border-2 border-black rounded-3xl overflow-hidden shadow-[8px_8px_0px_#000] hover:-translate-y-1 transition-transform duration-300"
            >
                {/* Top Zone — Hero Gradient */}
                <div className="h-40 bg-gradient-to-br from-[#0A2540] to-[#635BFF] p-6 relative overflow-hidden">
                    {/* Radial glow overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.12),transparent_70%)]" />

                    {/* Live Cohort Badge */}
                    <div className="relative inline-flex items-center gap-2 bg-white/20 text-white text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-lg backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                        </span>
                        Live Cohort
                    </div>
                </div>

                {/* Bottom Zone — Content */}
                <div className="p-8 bg-white">
                    <h2 className="text-xl font-black text-black uppercase tracking-tight">
                        AI Native Full Stack Developer
                    </h2>
                    <p className="text-sm text-black/60 mt-3 leading-relaxed">
                        Master modern full-stack development by building AI-native applications.
                        Learn React, FastAPI, LLM integrations, and Hexagonal Architecture.
                    </p>

                    {/* CTA Button */}
                    <a
                        href="https://learn.ottobon.in/course/ai-native-fullstack-developer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 w-full py-3 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] border-2 border-black hover:shadow-[4px_4px_0px_#000] transition-all duration-300 flex justify-center items-center gap-2 group-hover:scale-[1.02]"
                    >
                        Enroll Now
                        <ExternalLink size={14} />
                    </a>
                </div>
            </motion.div>

            {/* Footer hint */}
            <div className="mt-10 text-center">
                <p className="text-[9px] font-black text-black/20 uppercase tracking-[0.3em]">
                    More cohorts dropping soon.
                </p>
            </div>
        </div>
    );
};

export default CoursesPage;
