import clsx from 'clsx';

const Badge = ({ children, variant = 'default', className, ...props }) => {
    const variants = {
        default: 'bg-white text-black border-2 border-black shadow-[2px_2px_0px_#000]',
        accent: 'bg-black text-white border-2 border-black',
        success: 'bg-black text-white border-2 border-black font-black italic',
        warning: 'bg-white text-black border-2 border-black font-bold border-dashed',
        danger: 'bg-white text-black border-4 border-black font-black uppercase tracking-tighter',
    };

    return (
        <span
            className={clsx(
                'inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest leading-none',
                variants[variant] || variants.default,
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export default Badge;
