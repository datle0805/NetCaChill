'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Maximize, Minimize, Volume2, VolumeX, Play, Pause, RotateCcw, RotateCw, Settings, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface VideoPlayerProps {
    src: string;
    movieData?: {
        name: string;
        slug: string;
        thumb: string;
        episodeName?: string;
        episodeSlug?: string;
    };
    onProgress?: (progress: number) => void;
    initialProgress?: number;
}

export default function VideoPlayer({ src, movieData, onProgress, initialProgress = 0 }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isBuffering, setIsBuffering] = useState(false);
    const [useProxy, setUseProxy] = useState(false);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let hls: Hls;

        const initPlayer = () => {
            // Check if URL needs proxy based on domain or previous failure
            const needsProxy = src.includes('phimmoi') || src.includes('sing') || useProxy;
            const finalSrc = needsProxy ? `/api/video-proxy?url=${encodeURIComponent(src)}` : src;

            if (Hls.isSupported()) {
                hls = new Hls({
                    capLevelToPlayerSize: true,
                    autoStartLoad: true,
                    startPosition: initialProgress > 0 ? initialProgress : -1,
                    xhrSetup: (xhr) => {
                        // Headers like Referer cannot be set here in browser
                        xhr.withCredentials = false;
                    }
                });
                hls.loadSource(finalSrc);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    setIsLoading(false);
                });
                hls.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                if (!useProxy && !needsProxy) {
                                    console.warn('Network error, attempting proxy...');
                                    setUseProxy(true);
                                } else {
                                    hls.startLoad();
                                }
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                hls.recoverMediaError();
                                break;
                            default:
                                hls.destroy();
                                break;
                        }
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = finalSrc;
                video.addEventListener('loadedmetadata', () => {
                    if (initialProgress > 0) {
                        video.currentTime = initialProgress;
                    }
                    setIsLoading(false);
                });
            }
        };

        initPlayer();

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [src, initialProgress, useProxy]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleWaiting = () => setIsBuffering(true);
        const handlePlaying = () => setIsBuffering(false);
        const handleEnded = () => {
            setIsPlaying(false);
            if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
            saveProgress(duration); // Save as complete
        };

        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('waiting', handleWaiting);
        video.addEventListener('playing', handlePlaying);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('waiting', handleWaiting);
            video.removeEventListener('playing', handlePlaying);
            video.removeEventListener('ended', handleEnded);
        };
    }, [duration]);

    // Save progress periodically
    useEffect(() => {
        if (isPlaying && movieData) {
            saveIntervalRef.current = setInterval(() => {
                if (videoRef.current) {
                    saveProgress(videoRef.current.currentTime);
                }
            }, 30000); // Save every 30 seconds
        } else {
            if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
        }

        return () => {
            if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
        };
    }, [isPlaying, movieData]);

    const saveProgress = async (time: number) => {
        if (!movieData) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase.from('watch_history').upsert({
            user_id: user.id,
            movie_slug: movieData.slug,
            movie_name: movieData.name,
            movie_thumb: movieData.thumb,
            episode_slug: movieData.episodeSlug,
            episode_name: movieData.episodeName,
            progress: time,
            watched_at: new Date().toISOString()
        }, { onConflict: 'user_id,movie_slug,episode_slug' });
    };

    useEffect(() => {
        const handleMouseMove = () => {
            setShowControls(true);
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
            controlsTimeoutRef.current = setTimeout(() => {
                if (isPlaying) {
                    setShowControls(false);
                }
            }, 3000);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isPlaying]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            if (onProgress) {
                onProgress(videoRef.current.currentTime);
            }
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return '0:00';
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);

        if (hours > 0) {
            return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = Number(e.target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const toggleFullscreen = () => {
        const player = videoRef.current?.parentElement;
        if (!player) return;

        if (!document.fullscreenElement) {
            player.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <div className="group relative aspect-video w-full overflow-hidden bg-black shadow-2xl ring-1 ring-white/10 select-none">
            <video
                ref={videoRef}
                className="h-full w-full cursor-pointer"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                onClick={togglePlay}
                playsInline
            />

            {/* Loading/Buffering State */}
            {(isLoading || isBuffering) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                    <Loader2 className="h-12 w-12 animate-spin text-netflix-red" />
                </div>
            )}

            {/* Custom Controls */}
            <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-4 pb-4 pt-12 transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Progress Bar */}
                <div className="absolute inset-x-0 top-0 h-1.5 cursor-pointer bg-white/20 px-4 group/progress">
                    <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="absolute inset-x-0 top-0 h-full w-full cursor-pointer opacity-0 z-10"
                    />
                    <div className="absolute left-0 top-0 h-full bg-netflix-red transition-all" style={{ width: `${(currentTime / (duration || 1)) * 100}%` }} />
                    <div
                        className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-netflix-red opacity-0 transition-opacity group-hover/progress:opacity-100 shadow-lg shadow-red-900/50"
                        style={{ left: `calc(${(currentTime / (duration || 1)) * 100}% - 8px)` }}
                    />
                </div>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-6">
                        <button onClick={togglePlay} className="text-white transition hover:scale-110 active:scale-90" title={isPlaying ? 'Tạm dừng' : 'Phát'}>
                            {isPlaying ? <Pause className="fill-current h-7 w-7" /> : <Play className="fill-current h-7 w-7" />}
                        </button>

                        <div className="flex items-center gap-4">
                            <button onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)} className="text-white/80 hover:text-white transition" title="Lùi 10 giây">
                                <RotateCcw className="h-6 w-6" />
                            </button>
                            <button onClick={() => videoRef.current && (videoRef.current.currentTime += 10)} className="text-white/80 hover:text-white transition" title="Tiến 10 giây">
                                <RotateCw className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 group/volume">
                            <button onClick={() => setIsMuted(!isMuted)} className="text-white transition hover:scale-110">
                                {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                            </button>
                            <input
                                type="range"
                                min="0" max="1" step="0.1"
                                value={isMuted ? 0 : volume}
                                onChange={(e) => {
                                    setVolume(Number(e.target.value));
                                    setIsMuted(false);
                                }}
                                className="w-0 overflow-hidden transition-all group-hover/volume:w-20 accent-netflix-red cursor-pointer"
                            />
                        </div>

                        <div className="text-xs font-bold text-white/80 tabular-nums">
                            {formatTime(currentTime)} <span className="mx-1 opacity-40">/</span> {formatTime(duration)}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:block">
                            <p className="text-sm font-medium text-white/90">
                                {movieData?.name} {movieData?.episodeName && ` - ${movieData.episodeName}`}
                            </p>
                        </div>
                        <button className="text-white/80 hover:text-white transition">
                            <Settings className="h-6 w-6" />
                        </button>
                        <button onClick={toggleFullscreen} className="text-white transition hover:scale-110">
                            {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
