'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '@/types/movie';
import MovieCard from './MovieCard';

interface MovieRowProps {
    title: string;
    movies: Movie[];
}

export default function MovieRow({ title, movies }: MovieRowProps) {
    const rowRef = useRef<HTMLDivElement>(null);
    const [isMoved, setIsMoved] = useState(false);

    const handleClick = (direction: 'left' | 'right') => {
        setIsMoved(true);
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    if (!movies || movies.length === 0) return null;

    return (
        <div className="group/section relative space-y-4 px-4 md:px-12 py-4 transition-all duration-300 hover:z-50">
            <div className="flex items-center justify-between">
                <h2 className="cursor-pointer text-xl font-black text-gray-200 transition-colors duration-300 hover:text-white md:text-3xl tracking-tighter">
                    {title}
                </h2>
                <button className="text-xs font-black uppercase tracking-widest text-netflix-red opacity-0 transition-opacity duration-300 group-hover/section:opacity-100 hover:underline">
                    Xem tất cả
                </button>
            </div>

            <div className="relative group/row lg:-mx-2">
                {/* Navigation Overlays */}
                <button
                    className={`absolute top-0 bottom-0 left-0 z-40 flex w-12 cursor-pointer items-center justify-center bg-black/40 text-white opacity-0 transition-all duration-300 hover:bg-black/70 group-hover/row:opacity-100 disabled:hidden ${!isMoved ? 'hidden' : ''
                        } rounded-r-md`}
                    onClick={() => handleClick('left')}
                >
                    <ChevronLeft className="h-10 w-10 transition-transform duration-300 hover:scale-125" />
                </button>

                <div
                    ref={rowRef}
                    className="no-scrollbar flex items-center space-x-2 overflow-x-scroll scroll-smooth py-6 md:space-x-4 md:px-2"
                >
                    {movies.map((movie) => (
                        <MovieCard key={movie.slug} movie={movie} />
                    ))}
                </div>

                <button
                    className="absolute top-0 bottom-0 right-0 z-40 flex w-12 cursor-pointer items-center justify-center bg-black/40 text-white opacity-0 transition-all duration-300 hover:bg-black/70 group-hover/row:opacity-100 rounded-l-md"
                    onClick={() => handleClick('right')}
                >
                    <ChevronRight className="h-10 w-10 transition-transform duration-300 hover:scale-125" />
                </button>
            </div>
        </div>
    );
}
