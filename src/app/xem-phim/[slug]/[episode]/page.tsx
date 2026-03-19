import { movieService } from '@/lib/api/movie-service';
import Navbar from '@/components/Navbar';
import VideoPlayer from '@/components/VideoPlayer';
import Link from 'next/link';
import { ChevronLeft, List, Info, Play, Server } from 'lucide-react';
import { notFound } from 'next/navigation';

interface WatchPageProps {
    params: { slug: string; episode: string };
    searchParams: { server?: string };
}

export default async function WatchPage({ params, searchParams }: WatchPageProps) {
    const { slug, episode: episodeSlug } = await params;
    const { server: serverIndex = '0' } = await searchParams;

    let movie;
    try {
        movie = await movieService.getDetails(slug);
    } catch (error) {
        return notFound();
    }

    const sIdx = parseInt(serverIndex);
    const server = movie.episodes?.[sIdx] || movie.episodes?.[0];
    const episodes = server?.items || [];

    // Find episode across all servers if not found in current one
    let currentEpisode = episodes.find(ep => ep.slug === episodeSlug);

    if (!currentEpisode) {
        // Fallback 1: look in other servers
        for (let i = 0; i < movie.episodes.length; i++) {
            const ep = movie.episodes[i].items.find((e: any) => e.slug === episodeSlug);
            if (ep) {
                currentEpisode = ep;
                break;
            }
        }
    }

    // Fallback 2: If still not found and we have episodes, just take the first one
    if (!currentEpisode && episodes.length > 0) {
        currentEpisode = episodes[0];
    }

    if (!currentEpisode) return notFound();

    const currentEpIndex = episodes.indexOf(currentEpisode);
    const nextEpisode = episodes[currentEpIndex + 1];

    return (
        <main className="relative min-h-screen bg-netflix-black text-white">
            <Navbar />

            <div className="flex flex-col lg:h-screen lg:flex-row pt-20">
                {/* Main Immersive Area */}
                <div className="flex flex-1 flex-col p-4 md:p-8 lg:p-12 overflow-y-auto no-scrollbar">
                    {/* Back & Breadcrumbs */}
                    <div className="mb-6 flex items-center justify-between">
                        <Link
                            href={`/phim/${slug}`}
                            className="group flex items-center gap-3 text-white/60 transition-all hover:text-white"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition group-hover:bg-white/20">
                                <ChevronLeft className="h-6 w-6" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-widest">Chi tiết phim</span>
                        </Link>

                        <div className="flex items-center gap-4 text-xs font-bold text-white/40 uppercase tracking-tighter">
                            <span>Đang phát:</span>
                            <span className="text-netflix-red font-black">Tập {currentEpisode.name}</span>
                        </div>
                    </div>

                    {/* Video Container */}
                    <div className="relative overflow-hidden rounded-xl bg-black shadow-[0_0_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
                        <VideoPlayer
                            src={currentEpisode.m3u8}
                            movieData={{
                                name: movie.name,
                                slug: slug,
                                thumb: movie.thumb_url,
                                episodeName: `Tập ${currentEpisode.name}`,
                                episodeSlug: currentEpisode.slug
                            }}
                        />
                    </div>

                    {/* Server Selection */}
                    <div className="mt-8 flex flex-wrap gap-3">
                        {movie.episodes.map((srv: any, idx: number) => (
                            <Link
                                key={idx}
                                href={`/xem-phim/${slug}/${episodeSlug}?server=${idx}`}
                                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${idx === sIdx
                                    ? 'bg-netflix-red text-white shadow-lg'
                                    : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                                    }`}
                            >
                                <Server className="h-3 w-3" />
                                {srv.server_name || `Server ${idx + 1}`}
                            </Link>
                        ))}
                    </div>

                    {/* Title & Controls Below Player */}
                    <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black md:text-5xl tracking-tighter text-white">
                                {movie.name}
                            </h1>
                            <div className="flex items-center gap-3 text-sm font-bold text-gray-400">
                                <span className="text-green-500">Tập {currentEpisode.name}</span>
                                <span className="h-1 w-1 rounded-full bg-gray-600" />
                                <span className="italic">{movie.original_name}</span>
                            </div>
                        </div>

                        {nextEpisode && (
                            <Link
                                href={`/xem-phim/${slug}/${nextEpisode.slug}?server=${sIdx}`}
                                className="group flex items-center gap-4 rounded-lg bg-white px-8 py-4 text-black transition-all hover:bg-neutral-200 active:scale-95"
                            >
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Tập tiếp theo</span>
                                    <span className="text-lg font-black tracking-tight">Tập {nextEpisode.name}</span>
                                </div>
                                <Play className="h-8 w-8 fill-current" />
                            </Link>
                        )}
                    </div>

                    {/* Description Overlay */}
                    <div className="mt-12 max-w-4xl rounded-2xl bg-white/5 p-8 backdrop-blur-sm ring-1 ring-white/10">
                        <div className="flex items-center gap-3 mb-4">
                            <Info className="h-5 w-5 text-netflix-red" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Tóm tắt nội dung</h3>
                        </div>
                        <p className="text-lg leading-relaxed text-gray-400">
                            {movie.description}
                        </p>
                    </div>
                </div>

                {/* Sidebar Episode List - Fixed on LG */}
                <aside className="w-full lg:w-[400px] bg-netflix-dark/50 lg:h-full border-l border-white/5 backdrop-blur-3xl overflow-y-auto no-scrollbar">
                    <div className="p-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center gap-3 text-2xl font-black tracking-tighter text-white">
                                <List className="h-6 w-6 text-netflix-red" />
                                {server.server_name || 'Tất cả tập phim'}
                            </h2>
                            <span className="text-xs font-bold text-white/20 uppercase tracking-widest">
                                {episodes.length} Tập
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-1">
                            {episodes.map((ep, index) => (
                                <Link
                                    key={ep.slug}
                                    href={`/xem-phim/${slug}/${ep.slug}?server=${sIdx}`}
                                    className={`group relative flex flex-col gap-3 rounded-xl p-4 transition-all duration-300 ${ep.slug === episodeSlug
                                        ? 'bg-netflix-red/10 ring-2 ring-netflix-red'
                                        : 'bg-white/5 hover:bg-white/10 ring-1 ring-white/5'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`text-2xl font-black ${ep.slug === episodeSlug ? 'text-netflix-red' : 'text-white/20'}`}>
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        {ep.slug === episodeSlug && (
                                            <div className="flex gap-1">
                                                <span className="h-3 w-1 animate-pulse bg-netflix-red" />
                                                <span className="h-5 w-1 animate-pulse bg-netflix-red delay-75" />
                                                <span className="h-4 w-1 animate-pulse bg-netflix-red delay-150" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col">
                                        <span className={`text-sm font-black tracking-tight ${ep.slug === episodeSlug ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                                            Tập {ep.name}
                                        </span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                            HD • Vietsub
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
