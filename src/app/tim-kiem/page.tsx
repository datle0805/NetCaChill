'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { movieService } from '@/lib/api/movie-service';
import { Movie } from '@/types/movie';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            setLoading(true);
            try {
                const results = await movieService.search(query);
                setMovies(results.items);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (!query) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-gray-500">
                <p className="text-xl font-medium">Nhập tên phim để tìm kiếm</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 pb-20 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="space-y-3">
                        <div className="aspect-video w-full animate-pulse rounded-md bg-netflix-gray" />
                        <div className="h-4 w-3/4 animate-pulse rounded bg-netflix-gray" />
                    </div>
                ))}
            </div>
        );
    }

    if (movies.length === 0) {
        return (
            <div className="flex h-[60vh] flex-col items-center justify-center text-gray-400">
                <p className="text-xl font-black">Không tìm thấy kết quả nào cho "{query}"</p>
                <p className="mt-2 text-sm text-gray-500">Thử tìm kiếm với từ khóa khác như tên phim, đạo diễn hoặc diễn viên.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-32">
            <h2 className="text-xl font-bold text-gray-400">
                Kết quả tìm kiếm cho: <span className="text-white">"{query}"</span>
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <main className="min-h-screen bg-netflix-dark">
            <Navbar />
            <div className="px-4 pt-24 md:px-12 md:pt-32">
                <Suspense fallback={
                    <div className="flex h-[60vh] items-center justify-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-netflix-red" />
                    </div>
                }>
                    <SearchResults />
                </Suspense>
            </div>
        </main>
    );
}
