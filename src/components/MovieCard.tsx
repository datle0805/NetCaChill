'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/movie';

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    return (
        <div className="group/card relative h-28 min-w-[150px] cursor-pointer transition-netflix md:h-36 md:min-w-[240px] hover:z-[100]">
            <Link href={`/phim/${movie.slug}`}>
                <div className="relative h-full w-full overflow-hidden rounded-md shadow-lg transition-transform duration-300 group-hover/card:opacity-0">
                    <Image
                        src={movie.thumb_url}
                        alt={movie.name}
                        className="rounded-md object-cover"
                        fill
                        sizes="(max-width: 768px) 150px, 240px"
                    />
                </div>
            </Link>

            {/* Hover Information Panel - The "Pop-out" Card */}
            <div className="invisible absolute top-0 left-0 z-50 w-full scale-100 opacity-0 transition-all duration-300 group-hover/card:visible group-hover/card:scale-115 group-hover/card:opacity-100 md:group-hover/card:-translate-y-[15%]">
                <Link href={`/phim/${movie.slug}`}>
                    <div className="relative h-28 w-full overflow-hidden rounded-t-lg shadow-2xl md:h-36">
                        <Image
                            src={movie.thumb_url}
                            alt={movie.name}
                            className="object-cover"
                            fill
                            sizes="240px"
                        />
                        {/* Play indicator overlay - minimal */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                                <div className="ml-1 h-0 w-0 border-y-[8px] border-y-transparent border-l-[12px] border-l-white" />
                            </div>
                        </div>
                    </div>
                </Link>

                <div className="absolute z-10 w-full rounded-b-lg glass p-4 shadow-2xl backdrop-blur-3xl border-t-2 border-netflix-red">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-green-400 tracking-tight">98% Match</span>
                            <span className="text-white text-xs opacity-60">{movie.year || '2024'}</span>
                            <span className="rounded border border-white/40 px-1.5 py-0.5 text-[8px] font-black text-white uppercase tracking-widest">
                                {movie.quality || 'HD'}
                            </span>
                        </div>

                        <h3 className="line-clamp-1 text-sm font-black text-white tracking-tight md:text-base">
                            {movie.name}
                        </h3>

                        <div className="flex flex-wrap gap-1 items-center">
                            <p className="text-[10px] text-gray-400 font-medium">
                                {movie.language || 'Phụ đề'}
                            </p>
                            <span className="h-1 w-1 rounded-full bg-gray-600 mx-1" />
                            <p className="text-[10px] text-netflix-red font-bold">
                                {movie.category?.[0]?.list?.[0]?.name || 'Phim mới'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
