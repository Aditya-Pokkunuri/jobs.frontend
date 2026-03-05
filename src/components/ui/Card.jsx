import clsx from 'clsx';

const Card = ({ children, className, hover = false, ...props }) => {
    return (
        <div
            className={clsx(
                'bg-white rounded-2xl border border-black/5 premium-shadow',
                'p-6 relative overflow-hidden transition-all duration-300 ease-out',
                hover && 'hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
