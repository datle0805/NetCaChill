'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username,
                },
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
            setTimeout(() => {
                router.push('/dang-nhap');
            }, 3000);
        }
    };

    if (success) {
        return (
            <main className="relative flex min-h-screen flex-col items-center justify-center bg-black px-4 overflow-hidden">
                <div className="relative z-10 w-full max-w-md text-center bg-white/5 backdrop-blur-xl p-12 rounded-2xl ring-1 ring-white/10">
                    <div className="mb-6 flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 ring-4 ring-green-500/50">
                            <CheckCircle2 className="h-10 w-10 text-green-500" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4">Đăng ký thành công!</h2>
                    <p className="text-gray-400">Chúng tôi đã gửi link xác nhận đến email của bạn. Vui lòng kiểm tra hộp thư.</p>
                    <div className="mt-8">
                        <p className="text-xs text-netflix-red font-bold uppercase tracking-widest animate-pulse">
                            Đang chuyển hướng đến trang đăng nhập...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center bg-black px-4 overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1574267433382-4b27fccad99c?q=80&w=2000&auto=format&fit=crop"
                    className="h-full w-full object-cover opacity-20"
                    alt="background"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
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
                    <h2 className="mb-8 text-3xl font-black text-white">Đăng ký</h2>

                    {error && (
                        <div className="mb-6 flex items-center gap-3 rounded bg-orange-700/20 p-4 text-sm text-orange-400 ring-1 ring-orange-400/30">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-2">
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Tên người dùng"
                                    required
                                    className="w-full rounded bg-neutral-800/80 p-4 pl-12 text-white outline-none ring-1 ring-white/10 transition-all focus:bg-neutral-700 focus:ring-netflix-red"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

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
                            {loading ? 'Đang tải...' : 'Bắt đầu ngay'}
                        </button>

                        <p className="text-xs text-gray-500 px-2">
                            Bằng cách đăng ký, bạn đồng ý với Điều khoản sử dụng và Chính sách bảo mật của chúng tôi.
                        </p>
                    </form>

                    <div className="mt-12 pt-8 border-t border-white/5 text-gray-400">
                        Đã có tài khoản?{' '}
                        <Link href="/dang-nhap" className="font-bold text-white hover:underline">
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
