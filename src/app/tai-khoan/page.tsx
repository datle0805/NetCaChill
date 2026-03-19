import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { User, Mail, Calendar, ShieldCheck } from 'lucide-react';

export default async function AccountPage() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/dang-nhap');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    const createdAt = new Date(user.created_at || '').toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <main className="min-h-screen bg-netflix-dark">
            <Navbar />

            <div className="mx-auto max-w-4xl px-4 pt-24 md:pt-32">
                <header className="mb-12 border-b border-white/10 pb-8">
                    <h1 className="text-3xl font-black text-white md:text-5xl tracking-tighter">
                        Tài khoản
                    </h1>
                </header>

                <div className="grid gap-8 md:grid-cols-3">
                    <div className="md:col-span-1">
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-white/5 p-8 border border-white/10">
                            <div className="relative h-24 w-24 overflow-hidden rounded-full bg-netflix-red flex items-center justify-center mb-4">
                                <User className="h-12 w-12 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-white truncate w-full text-center">
                                {profile?.username || 'Thành viên'}
                            </h2>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="rounded-2xl bg-white/5 p-6 border border-white/10">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-netflix-red" /> Chi tiết hồ sơ
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Mail className="h-4 w-4" />
                                        <span className="text-sm">Email</span>
                                    </div>
                                    <span className="text-sm text-white font-medium">{user.email}</span>
                                </div>

                                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <User className="h-4 w-4" />
                                        <span className="text-sm">Tên người dùng</span>
                                    </div>
                                    <span className="text-sm text-white font-medium">{profile?.username || 'Chưa thiết lập'}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <Calendar className="h-4 w-4" />
                                        <span className="text-sm">Ngày tham gia</span>
                                    </div>
                                    <span className="text-sm text-white font-medium">{createdAt}</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-white/5 p-6 border border-white/10">
                            <h3 className="text-lg font-bold text-white mb-4">Cài đặt</h3>
                            <button className="w-full rounded-lg bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/20">
                                Đổi mật khẩu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
