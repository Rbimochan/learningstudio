
import React from 'react';
import { Loader2, X } from 'lucide-react';

export const Logo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <linearGradient id="logo-v" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="logo-h" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
        </defs>
        {/* Stylized L vertical segment */}
        <path
            d="M26 12C38 12 48 22 48 34V66H26V12Z"
            fill="url(#logo-v)"
        />
        {/* Stylized L horizontal segment */}
        <path
            d="M30 70H88V90H48C36 90 26 80 26 68L30 70Z"
            fill="url(#logo-h)"
        />
    </svg>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger',
    size?: 'sm' | 'md' | 'lg',
    isLoading?: boolean
}> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading,
    className = '',
    disabled,
    ...props
}) => {
        const variants = {
            primary: 'brand-gradient text-white hover:brightness-110 shadow-xl shadow-blue-500/20 active:scale-95',
            secondary: 'bg-white dark:bg-white/10 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/15 active:scale-95 border dark:border-white/5',
            outline: 'border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5',
            ghost: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5',
            danger: 'bg-rose-500 text-white hover:bg-rose-600'
        };

        const sizes = {
            sm: 'px-4 py-2 text-xs rounded-lg',
            md: 'px-6 py-3 text-sm rounded-xl',
            lg: 'px-8 py-4 text-base rounded-2xl'
        };

        return (
            <button
                disabled={disabled || isLoading}
                className={`
        inline-flex items-center justify-center font-bold tracking-tight transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
                {...props}
            >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {children}
            </button>
        );
    };

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }> = ({ label, error, className = '', ...props }) => (
    <div className="w-full space-y-2">
        {label && <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</label>}
        <input
            className={`
        w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50
        text-slate-900 dark:text-slate-100 placeholder:text-slate-500 
        focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all
        ${error ? 'border-rose-500' : ''} ${className}
      `}
            {...props}
        />
        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#0a0f20] w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border dark:border-white/10">
                <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <h2 className="text-2xl font-black dark:text-white tracking-tight">{title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-500 transition-colors"><X size={28} /></button>
                </div>
                <div className="p-8 max-h-[80vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const ProgressBar: React.FC<{ total: number; completed: number; size?: 'sm' | 'md' | 'lg' }> = ({ total, completed, size = 'md' }) => {
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    const h = { sm: 'h-1.5', md: 'h-3', lg: 'h-5' }[size];

    return (
        <div className="w-full space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] dark:text-slate-500">
                <span>Mastery Progress</span>
                <span className="text-blue-500">{percentage}%</span>
            </div>
            <div className={`w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden ${h} border dark:border-white/5`}>
                <div
                    className={`h-full brand-gradient transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
