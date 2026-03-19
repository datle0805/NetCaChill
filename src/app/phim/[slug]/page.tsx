import Image from 'next/image';
import Link from 'next/link';
import { Play, Plus, ThumbsUp, ChevronLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import MovieRow from '@/components/MovieRow';
import { movieService } from '@/lib/api/movie-service';
import { notFound } from 'next/navigation';

export default async function MovieDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = await params;

    let movie;
    try {
        movie = await movieService.getDetails(slug);
    } catch (error) {
        return notFound();
    }

    const relatedMovies = await movieService.getTrending();

    return (
        <main className="relative min-h-screen bg-netflix-dark">
            <Navbar />

            {/* Cinematic Hero Backdrop */}
            <div className="relative h-[60vh] w-full md:h-[85vh]">
                <Image
                    src={movie.poster_url || movie.thumb_url}
                    alt={movie.name}
                    fill
                    className="object-cover brightness-50"
                    priority
                />
                <div className="absolute inset-0 hero-gradient-overlay" />
                <div className="absolute inset-x-0 bottom-0 h-48 banner-bottom-gradient" />

                {/* Back Button */}
                <Link
                    href="/"
                    className="absolute top-24 left-4 z-10 flex items-center gap-2 text-white/70 transition hover:text-white md:left-12"
                >
                    <ChevronLeft className="h-6 w-6" /> Quay lại
                </Link>
            </div>

            <div className="relative -mt-48 px-4 md:px-12 lg:-mt-72">
                <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
                    {/* Main Content */}
                    <div className="flex-1 space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-black text-white md:text-6xl lg:text-7xl tracking-tighter">
                                {movie.name}
                            </h1>
                            <div className="flex items-center gap-4 text-sm font-bold text-green-400">
                                <span>98% Trùng khớp</span>
                                <span className="text-white">{movie.year}</span>
                                <span className="border border-white/40 px-2 py-0.5 text-xs text-white uppercase">{movie.quality}</span>
                                <span className="text-white">{movie.time}</span>
                            </div>
                        </div>

                        <p className="max-w-4xl text-lg leading-relaxed text-gray-300 md:text-xl selection:bg-netflix-red">
                            {movie.description}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link
                                href={`/xem-phim/${movie.slug}/${movie.episodes?.[0]?.items?.[0]?.slug || 'full'}`}
                                className="flex items-center gap-2 rounded bg-white px-10 py-3 text-lg font-bold text-black transition-all hover:bg-neutral-200 active:scale-95 shadow-xl"
                            >
                                <Play className="fill-current" /> Xem ngay
                            </Link>
                            <button className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 bg-black/40 text-white backdrop-blur-md transition-all hover:border-white active:scale-95">
                                <Plus />
                            </button>
                            <button className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 bg-black/40 text-white backdrop-blur-md transition-all hover:border-white active:scale-95">
                                <ThumbsUp />
                            </button>
                        </div>
                    </div>

                    {/* Sidebar Meta Info */}
                    <div className="w-full lg:w-1/4 space-y-6 text-sm md:text-base">
                        <div className="glass rounded-xl p-6 space-y-4">
                            <h3 className="text-gray-500 font-bold uppercase tracking-widest text-xs">Thông tin phim</h3>
                            <div className="space-y-3">
                                <p><span className="text-gray-400">Diễn viên:</span> <br /> <span className="text-white">{movie.casts || 'N/A'}</span></p>
                                <p><span className="text-gray-400">Đạo diễn:</span> <br /> <span className="text-white">{movie.director || 'N/A'}</span></p>
                                <p><span className="text-gray-400">Quốc gia:</span> <br /> <span className="text-white">{movie.country?.[0]?.name || 'N/A'}</span></p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Episode List Section */}
                <div className="mt-20 space-y-6">
                    <div className="flex items-center justify-between border-l-4 border-netflix-red pl-4">
                        <h2 className="text-2xl font-black text-white md:text-3xl">Danh sách tập phim</h2>
                        <span className="text-gray-500 text-sm font-bold uppercase tracking-widest">
                            {movie.episodes?.[0]?.items?.length || 0} tập
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
                        {movie.episodes?.[0]?.items?.map((ep) => (
                            <Link
                                key={ep.slug}
                                href={`/xem-phim/${movie.slug}/${ep.slug}`}
                                className="flex items-center justify-center rounded-md bg-netflix-gray border border-white/5 py-3 text-sm font-bold text-gray-300 transition-all hover:bg-netflix-red hover:text-white hover:scale-105 active:scale-95 shadow-lg"
                            >
                                Tập {ep.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Similar Content Section */}
                <div className="mt-24 pb-20">
                    <MovieRow title="Nội dung tương tự" movies={relatedMovies.items.slice(0, 12)} />
                </div>
            </div>
        </main>
    );
}
