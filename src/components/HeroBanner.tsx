'use client';

import Image from 'next/image';
import { Play, Info } from 'lucide-react';
import { Movie } from '@/types/movie';
import Link from 'next/link';

interface HeroBannerProps {
    movie: Movie;
}

export default function HeroBanner({ movie }: HeroBannerProps) {
    if (!movie) return <div className="h-[95vh] w-full bg-netflix-dark animate-pulse" />;

    return (
        <div className="relative flex flex-col space-y-2 py-16 md:space-y-4 lg:h-[98vh] lg:justify-end lg:pb-32">
            {/* Background with cinematic zoom and overlay */}
            <div className="absolute top-0 left-0 -z-10 h-full w-full overflow-hidden">
                <Image
                    src={movie.poster_url || movie.thumb_url}
                    alt={movie.name}
                    fill
                    className="object-cover brightness-[0.6] transition-transform duration-[20s] ease-out hover:scale-110"
                    priority
                />
                <div className="absolute inset-0 hero-gradient-overlay" />
                <div className="absolute inset-x-0 bottom-0 h-48 banner-bottom-gradient" />
            </div>

            <div className="px-4 md:px-12 space-y-6 animate-fade-in translate-y-0 opacity-100 transition-all duration-1000">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-black/40 backdrop-blur-md">
                            <span className="text-xl font-black text-netflix-red italic">N</span>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">Series</span>
                    </div>

                    <h1 className="text-4xl font-black text-white drop-shadow-2xl md:text-6xl lg:text-8xl xl:max-w-5xl tracking-tighter leading-[0.9]">
                        {movie.name}
                    </h1>

                    <div className="flex items-center gap-4 text-sm font-bold text-white/90">
                        <span className="text-green-500 font-black">98% Match</span>
                        <span>{movie.year}</span>
                        <span className="border border-white/20 px-2 py-0.5 text-[10px] uppercase font-black tracking-widest bg-black/20 rounded-sm">
                            {movie.quality || 'HD'}
                        </span>
                        <span className="text-white/60">{movie.time || ''}</span>
                    </div>
                </div>

                <p className="max-w-xs text-sm text-shadow-lg text-gray-200/90 font-medium md:max-w-xl md:text-lg lg:max-w-3xl lg:text-xl line-clamp-3 leading-relaxed">
                    {movie.description}
                </p>

                <div className="flex items-center space-x-4 pt-6">
                    <Link
                        href={`/xem-phim/${movie.slug}/tap-1`}
                        className="flex items-center gap-x-3 rounded-md bg-white px-8 py-3 text-sm font-black text-black transition-all hover:bg-neutral-200 active:scale-95 shadow-2xl"
                    >
                        <Play className="h-6 w-6 text-black fill-current" />
                        Xem ngay
                    </Link>
                    <Link
                        href={`/phim/${movie.slug}`}
                        className="flex items-center gap-x-3 rounded-md bg-white/10 px-8 py-3 text-sm font-black text-white backdrop-blur-xl transition-all border border-white/10 hover:bg-white/20 active:scale-95 shadow-2xl"
                    >
                        <Info className="h-6 w-6 text-white" />
                        Thông tin
                    </Link>
                </div>
            </div>
        </div>
    );
}
