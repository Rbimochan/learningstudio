export default function WorkspaceNotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#050a14]">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 dark:bg-blue-950/20 rounded-2xl flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-blue-600 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                        Page Not Found
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>
                <a
                    href="/paths"
                    className="inline-block px-8 py-4 brand-gradient text-white font-bold rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all"
                >
                    Return to Learning Paths
                </a>
            </div>
        </div>
    );
}
