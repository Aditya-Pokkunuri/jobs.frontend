import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
        >
            <h1 className="text-[12rem] font-display font-black text-black leading-none tracking-tighter mb-4">404</h1>
            <div className="w-16 h-2 bg-black mx-auto mb-10" />

            <p className="text-sm font-black text-black uppercase tracking-[0.4em] mb-12 opacity-40">
                Segment Fault / Resource Not Found
            </p>

            <Link
                to="/"
                className="inline-block bg-black text-white px-10 py-4 rounded-2xl font-display font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-2xl active:scale-[0.98]"
            >
                Return to Base
            </Link>
        </motion.div>
    </div>
);

export default NotFoundPage;
