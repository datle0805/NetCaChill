'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/');
            router.refresh();
        }
    };

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center bg-black px-4 overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1574267433382-4b27fccad99c?q=80&w=2000&auto=format&fit=crop"
                    className="h-full w-full object-cover opacity-30"
                    alt="background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-block transform transition-transform hover:scale-110 active:scale-95">
                        <h1 className="text-4xl font-black tracking-tighter text-netflix-red">
                            NETCACHILL
                        </h1>
                    </Link>
                </div>

                <div className="glass-card rounded-lg p-8 md:p-12">
                    <h2 className="mb-8 text-3xl font-black text-white">Đăng nhập</h2>

                    {error && (
                        <div className="mb-6 flex items-center gap-3 rounded bg-orange-700/20 p-4 text-sm text-orange-400 ring-1 ring-orange-400/30">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    className="w-full rounded bg-neutral-800/80 p-4 pl-12 text-white outline-none ring-1 ring-white/10 transition-all focus:bg-neutral-700 focus:ring-netflix-red"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="password"
                                    placeholder="Mật khẩu"
                                    required
                                    className="w-full rounded bg-neutral-800/80 p-4 pl-12 text-white outline-none ring-1 ring-white/10 transition-all focus:bg-neutral-700 focus:ring-netflix-red"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded bg-netflix-red py-4 text-lg font-black text-white transition-all hover:bg-red-700 active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </button>

                        <div className="flex items-center justify-between text-sm text-gray-400">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="accent-netflix-red" />
                                Ghi nhớ tôi
                            </label>
                            <Link href="#" className="hover:underline">Quên mật khẩu?</Link>
                        </div>
                    </form>

                    <div className="mt-12 pt-8 border-t border-white/5 text-gray-400">
                        Bạn mới tham gia NetCaChill?{' '}
                        <Link href="/dang-ky" className="font-bold text-white hover:underline">
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
