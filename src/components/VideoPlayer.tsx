import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCcw, RotateCw, Settings, ShieldCheck, AlertCircle } from 'lucide-react';
import { Movie } from '../types';

interface VideoPlayerProps {
  movie: Movie;
  onEnded?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, onEnded }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide controls after idle
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  // Video event handlers
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(e => {
        console.warn('Playback prevented:', e);
      });
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setErrorMsg(null);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMute = !isMuted;
    setIsMuted(newMute);
    videoRef.current.muted = newMute;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => console.error(err));
      setIsFullscreen(false);
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + seconds));
    }
  };

  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          togglePlay();
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipTime(10);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted]);

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl group select-none"
    >
      {/* HTML5 Video element */}
      <video
        ref={videoRef}
        src={movie.video_url}
        poster={movie.banner_url || movie.poster_url}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => { setIsBuffering(false); setIsPlaying(true); }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => { setIsPlaying(false); if (onEnded) onEnded(); }}
        onError={() => setErrorMsg('Video stream currently unavailable or format not supported by browser codec.')}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Buffering Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error Fallback */}
      {errorMsg && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 p-6 text-center z-20">
          <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Stream Error</h3>
          <p className="text-xs text-zinc-400 max-w-md mb-4">{errorMsg}</p>
          <a
            href={movie.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-lg text-xs"
          >
            Open Source Link Directly
          </a>
        </div>
      )}

      {/* Big Play Button Overlay on Pause */}
      {!isPlaying && !errorMsg && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 flex items-center justify-center pl-1 shadow-2xl shadow-amber-500/50 hover:scale-110 transition-all">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current" />
          </div>
        </div>
      )}

      {/* License transparency tag overlay */}
      <div className={`absolute top-4 left-4 z-10 transition-opacity duration-300 pointer-events-none ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        <div className="px-3 py-1 rounded-md bg-zinc-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[11px] font-medium flex items-center gap-1.5 shadow-lg">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{movie.license_type || 'Verified Legal Open Stream'}</span>
        </div>
      </div>

      {/* Custom Player Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent px-4 py-3 sm:px-6 sm:py-4 transition-opacity duration-300 flex flex-col gap-2 z-10 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Scrubber / Progress bar */}
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-zinc-700 hover:h-2.5 rounded-lg appearance-none cursor-pointer accent-amber-500 transition-all"
            aria-label="Video timeline scrubber"
          />
        </div>

        {/* Control Buttons row */}
        <div className="flex items-center justify-between gap-2 text-white">
          {/* Left: Play, Skip, Volume, Time */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 hover:text-amber-400 rounded-lg hover:bg-white/10 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <button
              onClick={() => skipTime(-10)}
              className="p-1.5 hover:text-amber-400 rounded-lg hover:bg-white/10 transition-colors"
              title="Rewind 10 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => skipTime(10)}
              className="p-1.5 hover:text-amber-400 rounded-lg hover:bg-white/10 transition-colors"
              title="Forward 10 seconds"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={toggleMute}
                className="p-1.5 hover:text-amber-400 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-amber-400" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-20 h-1 bg-zinc-600 rounded-lg appearance-none cursor-pointer accent-amber-400"
                aria-label="Volume slider"
              />
            </div>

            {/* Timestamp */}
            <div className="text-xs text-zinc-300 font-mono hidden sm:block">
              <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Quality, Speed, Fullscreen */}
          <div className="flex items-center gap-2">
            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-zinc-800/80 rounded-md px-1.5 py-0.5 text-xs text-zinc-300">
              {[1, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => changeSpeed(rate)}
                  className={`px-1.5 py-0.5 rounded text-[11px] ${
                    playbackRate === rate ? 'bg-amber-500 text-zinc-950 font-bold' : 'hover:text-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:text-amber-400 rounded-lg hover:bg-white/10 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
