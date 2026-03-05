import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className,
    disabled,
    ...props
}) => {

    const getStyle = () => {
        let style = {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            border: 'none',
            outline: 'none',
            opacity: disabled || isLoading ? 0.3 : 1,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            ...props.style
        };

        // Size
        if (size === 'sm') {
            style.padding = '0.5rem 1rem';
            style.fontSize = '0.65rem';
            style.borderRadius = '8px';
        } else if (size === 'md') {
            style.padding = '0.75rem 1.5rem';
            style.fontSize = '0.75rem';
            style.borderRadius = '12px';
        } else {
            style.padding = '1rem 2rem';
            style.fontSize = '0.875rem';
            style.borderRadius = '16px';
        }

        // Variant - Monochrome Pivot
        if (variant === 'primary') {
            style.background = '#000000';
            style.color = '#FFFFFF';
            style.boxShadow = '0 10px 20px -10px rgba(0, 0, 0, 0.3)';
        } else if (variant === 'secondary') {
            style.background = '#FFFFFF';
            style.color = '#000000';
            style.border = '2px solid #000000';
        } else if (variant === 'ghost') {
            style.background = 'transparent';
            style.color = '#000000';
            style.border = '2px solid transparent';
            style.letterSpacing = '0.2em';
        } else if (variant === 'danger') {
            style.background = '#000000';
            style.color = '#FFFFFF';
            style.border = '2px solid #000000';
            style.opacity = '0.8';
        }

        return style;
    };

    return (
        <button
            className={clsx(className, "hover:scale-[1.02] active:scale-[0.98]")}
            style={getStyle()}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 size={16} style={{ marginRight: '0.75rem', animation: 'spin 1s linear infinite' }} />}
            <span className="relative z-10">{children}</span>
        </button>
    );
};

export default Button;
