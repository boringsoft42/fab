"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  RotateCcw,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getVideoUrl } from "@/lib/utils/video-utils";

interface VideoPlayerProps {
  src: string;
  title?: string;
  onProgress?: (progress: number) => void;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  onProgress,
  onTimeUpdate,
  onEnded,
  className,
}) => {
  const videoSrc = getVideoUrl(src);

  console.log("🎥 VideoPlayer - Original src:", src);
  console.log("🎥 VideoPlayer - Processed videoSrc:", videoSrc);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Estados del reproductor
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de UI
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Control de visibilidad de controles
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;

      setCurrentTime(current);

      if (total > 0) {
        const progress = (current / total) * 100;
        onProgress?.(progress);
        onTimeUpdate?.(current);
      }
    }
  }, [onProgress, onTimeUpdate, videoSrc]);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      console.log("🎥 VideoPlayer - Metadata loaded successfully");
      console.log("🎥 VideoPlayer - Duration:", videoRef.current.duration);
      console.log(
        "🎥 VideoPlayer - Video dimensions:",
        videoRef.current.videoWidth,
        "x",
        videoRef.current.videoHeight
      );

      setDuration(videoRef.current.duration);
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [videoSrc]); // Dependencia en videoSrc para que se ejecute cuando cambia

  const handleProgress = useCallback(() => {
    if (videoRef.current && videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(
        videoRef.current.buffered.length - 1
      );
      const duration = videoRef.current.duration;
      setBuffered((bufferedEnd / duration) * 100);
    }
  }, [videoSrc]);

  const handleSeek = useCallback(
    (value: number[]) => {
      if (videoRef.current) {
        const newTime = (value[0] / 100) * duration;
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    },
    [duration]
  );

  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const skipTime = useCallback((seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  }, []);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  }, []);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying]);

  // Resetear estados cuando cambia la fuente del video
  useEffect(() => {
    setIsLoading(true);
    setIsInitialLoading(true);
    setError(null);
    setCurrentTime(0);
    setDuration(0);
    setBuffered(0);
    setIsPlaying(false);
    setShowControls(true);

    // Forzar recarga del video element
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);

  // Event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };
    const handleError = (e: Event) => {
      const video = e.target as HTMLVideoElement;
      const error = video.error;

      console.error("🎥 VideoPlayer - Error event triggered:", error);
      console.error("🎥 VideoPlayer - Video src:", video.src);
      console.error("🎥 VideoPlayer - Video networkState:", video.networkState);
      console.error("🎥 VideoPlayer - Video readyState:", video.readyState);

      let errorMessage = "Error al cargar el video";
      if (error) {
        switch (error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = "La reproducción del video fue cancelada";
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = "Error de red al cargar el video";
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = "Error al decodificar el video";
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = "El formato de video no es compatible";
            break;
          default:
            errorMessage = `Error de video (código: ${error.code})`;
        }
      }

      setError(errorMessage);
      setIsLoading(false);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("error", handleError);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("progress", handleProgress);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("progress", handleProgress);
    };
  }, [
    handleTimeUpdate,
    handleLoadedMetadata,
    handleProgress,
    onEnded,
    videoSrc,
  ]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipTime(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          skipTime(10);
          break;
        case "ArrowUp":
          e.preventDefault();
          handleVolumeChange([Math.min(100, volume * 100 + 10)]);
          break;
        case "ArrowDown":
          e.preventDefault();
          handleVolumeChange([Math.max(0, volume * 100 - 10)]);
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "m":
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    togglePlay,
    skipTime,
    handleVolumeChange,
    volume,
    toggleFullscreen,
    toggleMute,
  ]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [src]); // Limpiar timeout cuando cambia la fuente

  // Early returns after all hooks
  if (!src || !videoSrc) {
    return (
      <div
        className={cn(
          "bg-gradient-to-br from-gray-900 to-black flex items-center justify-center",
          className
        )}
      >
        <div className="text-white text-center p-8">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-gray-600 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Video No Disponible</h3>
          <p className="text-gray-300 mb-4">
            No se pudo cargar el contenido de video
          </p>
        </div>
      </div>
    );
  }

  // Early returns after all hooks
  if (error) {
    return (
      <div
        className={cn(
          "bg-gradient-to-br from-gray-900 to-black flex items-center justify-center",
          className
        )}
      >
        <div className="text-white text-center p-8">
          <div className="mb-6">
            <div className="relative">
              <div className="w-16 h-16 mx-auto bg-orange-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 animate-ping bg-orange-400 rounded-full opacity-20"></div>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Error al Cargar Video</h3>
          <p className="text-gray-300 mb-4">
            No se pudo cargar el contenido multimedia
          </p>

          {/* Botón de reintento */}
          <Button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              setIsInitialLoading(true);
              // Forzar recarga del video
              if (videoRef.current) {
                videoRef.current.load();
              }
            }}
            className="bg-white text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative bg-black group h-full min-h-[400px]", className)}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoSrc}
        key={videoSrc} // Forzar re-render cuando cambia la fuente
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          isInitialLoading ? "opacity-0" : "opacity-100"
        )}
        preload="metadata"
        playsInline
        onDoubleClick={toggleFullscreen}
      />

      {/* Initial Loading Overlay */}
      {isInitialLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-purple-400"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-purple-300 opacity-30"></div>
            </div>
            <div className="space-y-3">
              <h3 className="text-white font-semibold text-lg">
                Preparando Video
              </h3>
              <p className="text-purple-200 text-sm">
                Cargando contenido multimedia...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Buffering Overlay */}
      {isLoading && !isInitialLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-gray-600 border-t-purple-500 mb-3"></div>
            <p className="text-white text-sm font-medium">Cargando...</p>
          </div>
        </div>
      )}

      {/* Play Button Overlay */}
      {!isPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Button
            onClick={togglePlay}
            size="lg"
            className="bg-white/30 backdrop-blur-md hover:bg-white/40 text-white border border-white/40 transition-all duration-200 shadow-xl"
          >
            <Play className="h-8 w-8 ml-1" />
          </Button>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 transition-opacity duration-300 backdrop-blur-md z-10",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Progress Bar */}
        <div className="relative mb-4">
          <Slider
            value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
            onValueChange={handleSeek}
            max={100}
            step={0.1}
            className="w-full"
          />
          {/* Buffered Progress */}
          <div
            className="absolute top-1/2 left-0 h-1 bg-white/30 rounded-full transition-all duration-300"
            style={{ width: `${buffered}%`, transform: "translateY(-50%)" }}
          />
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            {/* Skip Back/Forward */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => skipTime(-10)}
              className="text-white hover:bg-white/20"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => skipTime(10)}
              className="text-white hover:bg-white/20"
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            {/* Volume Control */}
            <div className="relative flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                onMouseEnter={() => setShowVolumeSlider(true)}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>

              {showVolumeSlider && (
                <div
                  className="absolute bottom-full left-0 mb-2 p-2 bg-black/80 rounded"
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    orientation="vertical"
                    className="h-20"
                  />
                </div>
              )}
            </div>

            {/* Time Display */}
            <div className="text-white text-sm ml-4">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Playback Rate */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="text-white hover:bg-white/20"
              >
                <Settings className="h-4 w-4" />
              </Button>

              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 p-2 bg-black/80 rounded min-w-[120px]">
                  <div className="text-white text-xs mb-2">Velocidad</div>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => {
                        handlePlaybackRateChange(rate);
                        setShowSettings(false);
                      }}
                      className={cn(
                        "block w-full text-left px-2 py-1 text-sm text-white hover:bg-white/20 rounded",
                        playbackRate === rate && "bg-white/20"
                      )}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Title Overlay */}
      {title && (
        <div className="absolute top-4 left-4 right-4">
          <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 inline-block">
            <h2 className="text-white text-lg font-semibold drop-shadow-lg">
              {title}
            </h2>
          </div>
        </div>
      )}
    </div>
  );
};
