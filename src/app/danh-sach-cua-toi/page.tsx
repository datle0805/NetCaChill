import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/types/movie';

export default async function MyListPage() {
    const supabase = await createServerSupabaseClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/dang-nhap');
    }

    const { data: favorites, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });

    // Transform database records into Movie objects
    const movies: Movie[] = (favorites || []).map((fav: any) => ({
        id: fav.id, // we might need the original api id, but for display this works
        name: fav.movie_name,
        slug: fav.movie_slug,
        thumb_url: fav.movie_thumb || '',
        poster_url: '',
        original_name: '',
        description: '',
        total_episodes: 0,
        current_episode: '',
        time: '',
        quality: '',
        language: '',
        director: '',
        casts: '',
        category: [],
        year: fav.movie_year
    }));

    return (
        <main className="min-h-screen bg-netflix-dark">
            <Navbar />

            <div className="px-4 pt-24 md:px-12 md:pt-32">
                <header className="mb-12">
                    <h1 className="text-3xl font-black text-white md:text-5xl tracking-tighter">
                        Danh sách của tôi
                    </h1>
                </header>

                {movies.length === 0 ? (
                    <div className="flex h-[50vh] flex-col items-center justify-center text-gray-500">
                        <div className="mb-6 rounded-full bg-white/5 p-8">
                            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <p className="text-xl font-medium">Danh sách của bạn đang trống</p>
                        <p className="mt-2 text-sm">Thêm phim bằng cách nhấn vào biểu tượng dấu cộng trên trang thông tin phim.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-12 pb-32 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {movies.map((movie) => (
                            <MovieCard key={movie.slug} movie={movie} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
