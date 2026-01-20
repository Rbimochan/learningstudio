export default function WorkspaceLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#050a14]">
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                    Loading your workspace...
                </p>
            </div>
        </div>
    );
}
