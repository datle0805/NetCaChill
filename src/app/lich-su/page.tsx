import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/types/movie';
import Link from 'next/link';

export default async function WatchHistoryPage() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/dang-nhap');
    }

    const { data: history } = await supabase
        .from('watch_history')
        .select('*')
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false });

    const movies: Movie[] = (history || []).map((item: any) => ({
        id: item.id,
        name: item.movie_name,
        slug: item.movie_slug,
        thumb_url: item.movie_thumb || '',
        poster_url: '',
        original_name: '',
        description: '',
        total_episodes: 0,
        current_episode: item.episode_name || '',
        time: '',
        quality: '',
        language: '',
        director: '',
        casts: '',
        category: [],
        year: 0
    }));

    return (
        <main className="min-h-screen bg-netflix-dark">
            <Navbar />

            <div className="px-4 pt-24 md:px-12 md:pt-32">
                <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-white md:text-5xl tracking-tighter">
                            Lịch sử xem
                        </h1>
                        <p className="mt-2 text-gray-500">Phim bạn đã xem gần đây</p>
                    </div>
                </header>

                {movies.length === 0 ? (
                    <div className="flex h-[50vh] flex-col items-center justify-center text-gray-500">
                        <div className="mb-6 rounded-full bg-white/5 p-8">
                            <svg className="h-12 w-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-xl font-medium">Bạn chưa xem phim nào</p>
                        <Link href="/" className="mt-4 text-netflix-red hover:underline">
                            Khám phá ngay
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-12 pb-32 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {movies.map((movie) => (
                            <div key={movie.slug} className="relative group">
                                <MovieCard movie={movie} />
                                {movie.current_episode && (
                                    <div className="absolute top-2 right-2 bg-netflix-red text-[10px] font-bold px-2 py-0.5 rounded shadow-lg pointer-events-none">
                                        {movie.current_episode}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
