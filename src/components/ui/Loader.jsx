import { Loader2 } from 'lucide-react';

const Loader = ({ fullScreen = false }) => {
    if (fullScreen) {
        return (
            <div style={{
                position: 'fixed',
                inset: 0,
                background: '#FFFFFF',
                display: 'grid',
                placeItems: 'center',
                zIndex: 100
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Loader2 size={48} color="#000000" style={{ animation: 'spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite' }} />
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            border: '2px solid #F0F0F0',
                            borderRadius: '50%',
                            opacity: 0.5
                        }} />
                    </div>
                    <p style={{
                        color: '#000000',
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        letterSpacing: '0.4em',
                        textTransform: 'uppercase',
                        marginLeft: '0.4em'
                    }}>Initializing</p>
                </div>
                <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Loader2 size={32} color="#000000" style={{ animation: 'spin 1s linear infinite' }} />
            <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

export default Loader;
