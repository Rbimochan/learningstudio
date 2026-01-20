
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Logo, Input, Button } from '@/components/ui/Components'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const supabase = createSupabaseBrowserClient()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(false)

        const { error: signupError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })

        if (signupError) {
            console.error('Signup error:', signupError.message)
            setError(signupError.message)
            setLoading(false)
        } else {
            console.log('Signup successful')
            setSuccess(true)
            setLoading(false)
            // Note: If email confirmation is required in Supabase, user will need to check email
            // If confirmation is disabled, they can proceed to login immediately
        }
    }

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
                    <h1 className="text-4xl font-black tracking-tight dark:text-white">Join the Studio</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Start your learning journey today</p>
                </div>

                <div className="bg-white dark:bg-[#0a0f20]/60 backdrop-blur-2xl p-10 rounded-[48px] border border-slate-200 dark:border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
                    <form onSubmit={handleSignup} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Create Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl font-medium">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl space-y-2">
                                <p className="font-bold text-base">Account created successfully! 🎉</p>
                                <p className="text-sm">Check your email for the confirmation link, then <a href="/login" className="underline font-bold">sign in here</a>.</p>
                            </div>
                        )}

                        <Button type="submit" size="lg" className="w-full text-lg py-5 shadow-2xl" isLoading={loading}>
                            Create Account
                        </Button>
                    </form>
                </div>

                <p className="text-center text-base text-slate-500 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link href="/login" className="font-bold text-blue-600 hover:text-blue-500 hover:underline underline-offset-4">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}
