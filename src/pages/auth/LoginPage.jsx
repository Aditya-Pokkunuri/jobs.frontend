import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../../api/authApi';
import { Briefcase, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await signIn(email, password);
            navigate('/jobs');
        } catch (err) {
            setError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-white">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md bg-white rounded-[32px] border-4 border-black p-12 shadow-[16px_16px_0px_#000]"
            >
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-black rounded-3xl grid place-items-center mx-auto mb-8 shadow-2xl">
                        <Briefcase size={32} className="text-white" />
                    </div>
                    <h1 className="font-display text-4xl font-black text-black tracking-tight">Sign In</h1>
                    <p className="text-sm font-medium text-black/40 mt-3 tracking-wide">Welcome back to Ottobon Jobs</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-black/70 mb-3 ml-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-6 py-4 bg-white border-2 border-black rounded-2xl text-black font-medium text-sm placeholder:text-gray-300 focus:outline-none focus:ring-8 focus:ring-black/5 transition-all duration-300"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-black/70 mb-3 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-6 py-4 pr-14 bg-white border-2 border-black rounded-2xl text-black font-medium text-sm placeholder:text-gray-300 focus:outline-none focus:ring-8 focus:ring-black/5 transition-all duration-300"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black transition-colors p-1"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm font-semibold text-red-600 bg-red-50 border-2 border-red-200 p-4 rounded-xl text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-5 rounded-2xl font-bold text-sm tracking-wide hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 disabled:opacity-30 shadow-2xl mt-4"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="flex flex-col items-center gap-4 mt-12 pb-2">
                    <p className="text-xs font-medium text-black/40">
                        Don't have an account?
                    </p>
                    <Link to="/register" className="text-sm font-bold text-black border-b-2 border-black hover:pb-1 transition-all">
                        Create Account
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
