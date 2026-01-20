import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center gap-2 text-sm mb-6">
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    {item.href ? (
                        <Link
                            href={item.href}
                            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                            {item.label}
                        </span>
                    )}
                    {index < items.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                </div>
            ))}
        </nav>
    );
}
