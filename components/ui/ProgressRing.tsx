interface ProgressRingProps {
    progress: number; // 0-100
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export function ProgressRing({ progress, size = 'md', showLabel = true }: ProgressRingProps) {
    const sizes = {
        sm: { width: 40, stroke: 3, fontSize: 'text-xs' },
        md: { width: 60, stroke: 4, fontSize: 'text-sm' },
        lg: { width: 80, stroke: 5, fontSize: 'text-base' }
    };

    const { width, stroke, fontSize } = sizes[size];
    const radius = (width - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={width} height={width} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={width / 2}
                    cy={width / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={stroke}
                    className="text-slate-200 dark:text-slate-700"
                />
                {/* Progress circle */}
                <circle
                    cx={width / 2}
                    cy={width / 2}
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-300"
                />
            </svg>
            {showLabel && (
                <span className={`absolute ${fontSize} font-semibold text-slate-700 dark:text-slate-300`}>
                    {Math.round(progress)}%
                </span>
            )}
        </div>
    );
}

interface ProgressBarProps {
    progress: number; // 0-100
    showLabel?: boolean;
    height?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ progress, showLabel = true, height = 'md' }: ProgressBarProps) {
    const heights = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3'
    };

    return (
        <div className="w-full">
            <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ${heights[height]}`}>
                <div
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </div>
            {showLabel && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {Math.round(progress)}% complete
                </p>
            )}
        </div>
    );
}
