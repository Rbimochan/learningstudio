
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Button, Input, Logo } from '../../../components/ui/Components';
import { Github } from 'lucide-react';
import Link from 'next/link';


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMSG, setErrorMSG] = useState('');
    const router = useRouter();
    const supabase = createSupabaseBrowserClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMSG('');

        // Production/Real Supabase auth
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('Login error:', error.message);
            setErrorMSG(error.message);
            setIsLoading(false);
        } else {
            console.log('Login successful, redirecting to /paths');
            router.replace('/paths');
        }
    };

    const handleOAuth = async (provider: 'github' | 'google') => {
        await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${location.origin}/auth/callback`
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#050a14]">
            {/* Abstract Background Element */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] brand-gradient blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] brand-gradient blur-[120px] rounded-full opacity-50"></div>
            </div>

            <div className="w-full max-w-md space-y-10 relative z-10 animate-in zoom-in-95 duration-700">
                <div className="text-center space-y-3">
                    <div className="w-24 h-24 bg-slate-950 rounded-[40px] flex items-center justify-center mx-auto shadow-[0_20px_50px_rgba(59,130,246,0.3)] mb-8 p-5 border border-white/10">
                        <Logo size={64} />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight dark:text-white">Forge Your Future</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Continue your learning legacy</p>
                </div>

                <div className="bg-white dark:bg-[#0a0f20]/60 backdrop-blur-2xl p-10 rounded-[48px] border border-slate-200 dark:border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Professional Email"
                            type="email"
                            placeholder="alex@learningstudio.ai"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Access Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />

                        {errorMSG && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium">
                                {errorMSG}
                            </div>
                        )}

                        <div className="flex items-center justify-between text-sm font-bold">
                            <label className="flex items-center gap-3 cursor-pointer text-slate-500 dark:text-slate-400">
                                <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-300 dark:border-white/10 dark:bg-slate-900 text-blue-600 focus:ring-blue-500" />
                                Stay logged in
                            </label>
                            <Link href="#" className="text-blue-500 hover:text-blue-400 transition-colors">Recover Password</Link>
                        </div>
                        <Button type="submit" size="lg" className="w-full text-lg py-5 shadow-2xl" isLoading={isLoading}>Initialize Access</Button>
                    </form>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-white/5"></div></div>
                        <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] font-black"><span className="bg-white dark:bg-[#0a1226] px-4 text-slate-400 dark:text-slate-500">SSO Provider</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => handleOAuth('github')} className="flex items-center justify-center gap-3 px-6 py-4 border border-slate-100 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-sm font-bold text-slate-700 dark:text-slate-300 active:scale-95">
                            <Github size={20} /> GitHub
                        </button>
                        <button onClick={() => handleOAuth('google')} className="flex items-center justify-center gap-3 px-6 py-4 border border-slate-100 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-sm font-bold text-slate-700 dark:text-slate-300 active:scale-95">
                            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" /> Google
                        </button>
                    </div>

                </div>

                <p className="text-center text-base text-slate-500 dark:text-slate-400">
                    New to the studio? <Link href="/signup" className="text-blue-500 font-bold hover:underline underline-offset-4">Apply for Access</Link>
                </p>
            </div>
        </div>
    );
}
