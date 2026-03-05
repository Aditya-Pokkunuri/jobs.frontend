import { useState, useEffect } from 'react';
import { getMarketIntelligence } from '../../api/analyticsApi';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { TrendingUp, Users, DollarSign, Briefcase, Globe, Zap } from 'lucide-react';
import Loader from '../../components/ui/Loader';
import { motion } from 'framer-motion';

// Strictly Monochrome Palette
const COLORS = ['#000000', '#262626', '#404040', '#525252', '#737373'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border-2 border-black shadow-[4px_4px_0px_#000] px-4 py-3 text-black">
                <p className="font-display font-black text-xs mb-2 uppercase tracking-widest">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-[10px] font-bold uppercase tracking-widest">
                        {entry.name}: <span className="font-black">{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const MarketPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getMarketIntelligence();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch market stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <Loader fullScreen />;
    if (!stats) return <div className="p-8 text-center text-black font-black uppercase tracking-widest">Data Unavailable</div>;

    const { total_jobs, top_skills, salary_trends, top_companies, work_styles, experience_levels } = stats;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-8 py-12 space-y-12 bg-white"
        >
            <header className="pb-8 border-b-2 border-black">
                <h1 className="text-5xl font-display font-black text-black tracking-tighter uppercase mb-2">
                    Market Intelligence
                </h1>
                <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.4em]">
                    Ottobon Terminal / Real-time Signals
                </p>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={<Briefcase size={20} />} label="Total Inventory" value={total_jobs} delay={0} />
                <StatCard icon={<TrendingUp size={20} />} label="Core Strength" value={top_skills[0]?.name || "N/A"} sub={`${top_skills[0]?.count || 0} listings`} delay={0.05} />
                <StatCard icon={<DollarSign size={20} />} label="Comp Ceiling" value={`$${(salary_trends[0]?.avg_max / 1000).toFixed(0)}k`} sub={salary_trends[0]?.role || "N/A"} delay={0.1} />
                <StatCard icon={<Globe size={20} />} label="Remote Distribution" value={`${((work_styles?.find(w => w.name === 'Remote')?.value || 0) / total_jobs * 100).toFixed(0)}%`} sub="Global Network" delay={0.15} />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Skills Bar Chart */}
                <ChartCard title="Skill Inventory">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={top_skills} layout="vertical" margin={{ left: 40, right: 20 }}>
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#000000" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#404040" stopOpacity={1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="2 2" stroke="#000000" opacity={0.05} horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name" type="category" width={100}
                                tick={{ fontSize: 10, fill: '#000000', fontWeight: 900, textTransform: 'uppercase' }}
                                stroke="#000000" strokeOpacity={0.1}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#000', fillOpacity: 0.02 }} />
                            <Bar dataKey="count" fill="url(#barGradient)" radius={[0, 4, 4, 0]} barSize={16} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Salary Trends */}
                <ChartCard title="Capital Flow">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salary_trends}>
                            <CartesianGrid strokeDasharray="2 2" stroke="#000" opacity={0.05} vertical={false} />
                            <XAxis
                                dataKey="role"
                                tick={{ fontSize: 9, fill: '#000', fontWeight: 900 }}
                                interval={0} angle={-15} textAnchor="end" height={60}
                                stroke="#000" strokeOpacity={0.1}
                            />
                            <YAxis
                                tickFormatter={(val) => `$${val / 1000}k`}
                                stroke="#000" strokeOpacity={0.1}
                                tick={{ fontSize: 10, fill: '#000', fontWeight: 900 }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#000', fillOpacity: 0.02 }} />
                            <Bar dataKey="avg_max" fill="#000" radius={[4, 4, 0, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Work Style Pie */}
                <ChartCard title="Operational Model">
                    <div className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={work_styles} cx="50%" cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={90} fill="#000" dataKey="value"
                                    stroke="#FFFFFF" strokeWidth={4}
                                >
                                    {work_styles?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </ChartCard>

                {/* Experience Radar */}
                <ChartCard title="Experience Vector">
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={experience_levels}>
                            <PolarGrid stroke="#000" strokeOpacity={0.1} />
                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#000', fontWeight: 900 }} stroke="#000" strokeOpacity={0.1} />
                            <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke="transparent" tick={false} />
                            <Radar name="Density" dataKey="A" stroke="#000" strokeWidth={3} fill="#000" fillOpacity={0.1} />
                            <Tooltip content={<CustomTooltip />} />
                        </RadarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>
        </motion.div>
    );
};

const StatCard = ({ icon, label, value, sub, delay }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
        className="bg-white rounded-2xl border-2 border-black p-6 shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all duration-300 active:scale-[0.98]"
    >
        <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 bg-black text-white rounded-lg grid place-items-center">
                {icon}
            </div>
        </div>
        <div>
            <p className="text-[9px] font-black text-black/40 uppercase tracking-[0.2em] mb-1">{label}</p>
            <h3 className="font-display font-black text-2xl text-black leading-none uppercase tracking-tighter">{value}</h3>
            {sub && <p className="text-[10px] font-bold text-black opacity-60 mt-3 uppercase tracking-widest">{sub}</p>}
        </div>
    </motion.div>
);

const ChartCard = ({ title, children }) => (
    <motion.div
        className="bg-white rounded-2xl border-2 border-black p-8 shadow-[8px_8px_0px_rgba(0,0,0,0.05)]"
    >
        <h3 className="font-display font-black text-xs text-black uppercase tracking-[0.3em] mb-10 pb-4 border-b border-black/10">
            {title}
        </h3>
        {children}
    </motion.div>
);

export default MarketPage;
