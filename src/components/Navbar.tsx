'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Bell, User, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);

        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            subscription.unsubscribe();
        };
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push('/');
        router.refresh();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery)}`);
            setShowSearch(false);
        }
    };

    return (
        <nav className={`fixed top-0 z-[100] w-full transition-all duration-500 ${isScrolled ? 'bg-[#141414] shadow-2xl py-2' : 'bg-transparent nav-gradient py-4'}`}>
            <div className="flex items-center justify-between px-4 md:px-12">
                <div className="flex items-center space-x-2 md:space-x-10">
                    <Link href="/" className="transition-transform active:scale-95">
                        <h1 className="text-2xl font-black tracking-tighter text-netflix-red md:text-3xl selection:bg-white selection:text-red-600">
                            NETCACHILL
                        </h1>
                    </Link>

                    <ul className="hidden space-x-6 md:flex">
                        <li><Link href="/" className="nav-link">Trang chủ</Link></li>
                        <li><Link href="/danh-sach/phim-bo" className="nav-link">Phim bộ</Link></li>
                        <li><Link href="/danh-sach/phim-le" className="nav-link">Phim lẻ</Link></li>
                        <li><Link href="/the-loai/hoat-hinh" className="nav-link">Hoạt hình</Link></li>
                        {user && <li><Link href="/danh-sach-cua-toi" className="nav-link">Danh sách</Link></li>}
                    </ul>
                </div>

                <div className="flex items-center space-x-5 text-sm">
                    <div className="flex items-center">
                        {showSearch ? (
                            <form onSubmit={handleSearch} className="group relative flex items-center transition-all duration-300">
                                <input
                                    type="text"
                                    placeholder="Tên phim, thể loại..."
                                    autoFocus
                                    className="rounded bg-black/80 border border-white/20 px-4 py-1.5 pl-10 text-white outline-none w-40 md:w-64 focus:border-white transition-all shadow-inner"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onBlur={() => !searchQuery && setShowSearch(false)}
                                />
                                <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                            </form>
                        ) : (
                            <button
                                onClick={() => setShowSearch(true)}
                                className="p-1 transition-transform hover:scale-110 active:scale-90"
                            >
                                <Search className="h-6 w-6 text-white cursor-pointer" />
                            </button>
                        )}
                    </div>

                    <button className="hidden p-1 transition-transform hover:scale-110 active:scale-90 lg:block">
                        <Bell className="h-6 w-6 text-white cursor-pointer" />
                    </button>

                    {user ? (
                        <div className="group relative">
                            <button className="flex items-center gap-1 p-1 transition-transform hover:scale-105 active:scale-95">
                                <div className="h-8 w-8 overflow-hidden rounded bg-netflix-red flex items-center justify-center">
                                    <User className="h-5 w-5 text-white" />
                                </div>
                            </button>

                            <div className="invisible absolute right-0 top-10 w-56 origin-top-right rounded-md border border-white/10 bg-black/95 p-2 opacity-0 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                                <div className="mb-2 border-b border-white/10 px-4 py-3">
                                    <p className="text-[10px] uppercase text-gray-500">Người dùng</p>
                                    <p className="truncate text-sm font-medium text-white">{user.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <Link href="/tai-khoan" className="flex items-center gap-3 rounded-md px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white">
                                        <User className="h-4 w-4" /> Tài khoản
                                    </Link>
                                    <Link href="/lich-su" className="flex items-center gap-3 rounded-md px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Lịch sử xem
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-500"
                                    >
                                        <LogOut className="h-4 w-4" /> Đăng xuất
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link
                            href="/dang-nhap"
                            className="rounded bg-netflix-red px-5 py-2 text-sm font-bold text-white transition-all hover:bg-red-700 active:scale-95 shadow-lg shadow-red-900/20"
                        >
                            Đăng nhập
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
