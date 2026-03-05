import { motion } from 'framer-motion';

const ScoreGauge = ({ score = 0 }) => {
    const percentage = Math.round((score || 0) * 100);

    // Dynamic stroke styles based on score for monochrome differentiation
    const isHigh = percentage >= 70;
    const isMedium = percentage >= 50;
    const isLow = percentage < 50;

    return (
        <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
                {/* Background Circle */}
                <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#F0F0F0"
                    strokeWidth="16"
                    strokeLinecap="round"
                />

                {/* Score Progress - Monochrome High Contrast */}
                <motion.circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray="502"
                    strokeDashoffset="502"
                    initial={{ strokeDashoffset: 502 }}
                    animate={{ strokeDashoffset: 502 - (502 * percentage) / 100 }}
                    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                    transform="rotate(-90 100 100)"
                    style={{
                        opacity: isHigh ? 1 : isMedium ? 0.6 : 0.3,
                        filter: isHigh ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' : 'none'
                    }}
                />

                {/* Score Ticks Refined */}
                {isHigh && (
                    <circle
                        cx="100"
                        cy="100"
                        r="66"
                        fill="none"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeDasharray="2 6"
                        opacity="0.1"
                    />
                )}
            </svg>

            <div style={{ position: 'absolute', textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    style={{
                        fontSize: '3.5rem',
                        fontWeight: 900,
                        color: '#000000',
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '-0.05em'
                    }}
                >
                    {percentage}
                </motion.div>
                <div style={{
                    fontSize: '0.6rem',
                    color: '#000000',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3em',
                    marginTop: '-4px'
                }}>Match IQ</div>
            </div>
        </div>
    );
};

export default ScoreGauge;
