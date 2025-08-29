"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
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
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getVideoUrl, isYouTubeUrl } from "@/lib/video-utils";
import { getAuthHeaders, API_BASE } from "@/lib/api";

// Extract YouTube ID function
const extractYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Auto-fix function for problematic videos
const attemptVideoAutoFix = async (
  videoSrc: string
): Promise<{
  success: boolean;
  fixedUrl?: string;
  error?: string;
}> => {
  try {
    console.log("🔧 Attempting to auto-fix video:", videoSrc);

    // Extract the original MinIO URL from proxy URL
    const urlParams = new URLSearchParams(videoSrc.split("?")[1]);
    const originalUrl = urlParams.get("url");

    if (!originalUrl) {
      throw new Error("Could not extract original video URL");
    }

    console.log("🔧 Original video URL:", originalUrl);

    // Call the video validation and fix API
    const response = await fetch(`${API_BASE}/video-validate-and-fix`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ videoUrl: originalUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Video fix API failed");
    }

    const result = await response.json();
    console.log("🔧 Video fix result:", result);

    if (result.status === "fixed" && result.fixedUrl) {
      // Return the proxy URL for the fixed video
      const fixedProxyUrl = `/api/video-proxy?url=${encodeURIComponent(result.fixedUrl)}`;
      return {
        success: true,
        fixedUrl: fixedProxyUrl,
      };
    } else if (result.status === "valid") {
      // Video was already valid, the issue might be elsewhere
      return {
        success: false,
        error: "Video appears to be valid but still has playback issues",
      };
    } else {
      return {
        success: false,
        error: result.message || "Unknown fix result",
      };
    }
  } catch (error) {
    console.error("🔧 Video auto-fix error:", error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
};

interface ModernVideoPlayerProps {
  src: string;
  title?: string;
  onProgress?: (progress: number) => void;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  className?: string;
  autoPlay?: boolean;
  showControls?: boolean;
}

export const ModernVideoPlayer: React.FC<ModernVideoPlayerProps> = ({
  src,
  title,
  onProgress,
  onTimeUpdate,
  onEnded,
  onPlay,
  onPause,
  className,
  autoPlay = false,
  showControls = true,
}) => {
  const isYouTube = isYouTubeUrl(src);
  let videoSrc = isYouTube ? src : getVideoUrl(src);

  // Fallback: If getVideoUrl didn't convert MinIO URL to proxy, force it
  if (!isYouTube && videoSrc && !videoSrc.includes("/api/video-proxy")) {
    if (
      videoSrc.includes("127.0.0.1:9000") ||
      videoSrc.includes("localhost:9000")
    ) {
      console.warn(
        "🎥 ModernVideoPlayer - getVideoUrl didn't convert MinIO URL, forcing proxy..."
      );
      videoSrc = `/api/video-proxy?url=${encodeURIComponent(videoSrc)}`;
    }
  }

  const youTubeId = isYouTube ? extractYouTubeId(src) : null;

  console.log("🎥 ModernVideoPlayer - Initializing with:", {
    originalSrc: src,
    processedSrc: videoSrc,
    isYouTube,
    youTubeId,
    title: title === "aaaaaaaaaaaaaa" ? "⚠️ CORRUPTED_TITLE" : title,
    isMinIOOriginal:
      src && (src.includes("127.0.0.1:9000") || src.includes("localhost:9000")),
    isProxyProcessed: videoSrc && videoSrc.includes("/api/video-proxy"),
    urlConversionWorked: src !== videoSrc,
    isCorruptedData:
      title === "aaaaaaaaaaaaaa" || (title && title.match(/^a+$/)),
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const waitingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControlsOverlay, setShowControlsOverlay] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Auto-hide controls
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hideControlsAfterDelay = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControlsOverlay(false);
      }
    }, 3000);
  }, [isPlaying]);

  const showControlsTemporarily = useCallback(() => {
    setShowControlsOverlay(true);
    hideControlsAfterDelay();
  }, [hideControlsAfterDelay]);

  // Format time helper
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Video event handlers
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);

      // Update buffered
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const bufferedPercent = (bufferedEnd / video.duration) * 100;
        setBuffered(bufferedPercent);
      }

      // Call progress callback
      if (onTimeUpdate) {
        onTimeUpdate(video.currentTime);
      }

      if (onProgress && video.duration > 0) {
        const progress = video.currentTime / video.duration;
        onProgress(progress);
      }
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    hideControlsAfterDelay();
    if (onPlay) onPlay();
  };

  const handlePause = () => {
    setIsPlaying(false);
    setShowControlsOverlay(true);
    if (onPause) onPause();
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setShowControlsOverlay(true);
    if (onEnded) onEnded();
  };

  const handleError = (e?: Event) => {
    const video = videoRef.current;
    if (!video) {
      console.warn(
        "🎥 ModernVideoPlayer - Error event but no video element available"
      );
      setError("Error al inicializar el reproductor de video");
      setIsLoading(false);
      return;
    }

    // Comprehensive error logging with defensive checks
    const errorDetails = {
      // Basic video info
      src: video?.src || "No src",
      originalSrc: src || "No original src",
      title: title || "No title",
      isYouTube,

      // Video element state (with fallbacks)
      networkState: video?.networkState ?? -1,
      readyState: video?.readyState ?? -1,
      currentTime: video?.currentTime ?? 0,
      duration: video?.duration ?? 0,
      paused: video?.paused ?? true,
      ended: video?.ended ?? false,

      // Error information
      hasError: !!video?.error,
      errorCode: video?.error?.code || null,
      errorMessage: video?.error?.message || null,

      // Network states (for debugging)
      networkStateText:
        video?.networkState !== undefined
          ? [
              "NETWORK_EMPTY",
              "NETWORK_IDLE",
              "NETWORK_LOADING",
              "NETWORK_NO_SOURCE",
            ][video.networkState] || "UNKNOWN"
          : "NO_NETWORK_STATE",

      readyStateText:
        video?.readyState !== undefined
          ? [
              "HAVE_NOTHING",
              "HAVE_METADATA",
              "HAVE_CURRENT_DATA",
              "HAVE_FUTURE_DATA",
              "HAVE_ENOUGH_DATA",
            ][video.readyState] || "UNKNOWN"
          : "NO_READY_STATE",

      // Event details
      eventType: e?.type || "unknown",
      eventTarget: e?.target ? "video_element" : "no_target",
      timestamp: new Date().toISOString(),

      // Additional debugging info
      videoElementExists: !!video,
      videoRefExists: !!videoRef.current,
    };

    console.error("🎥 ModernVideoPlayer - Video error occurred:", errorDetails);

    let errorMessage = "Error al cargar el video";
    let shouldRetry = false;

    if (video.error && video.error.code !== undefined) {
      // We have a specific MediaError
      switch (video.error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = "Reproducción cancelada por el usuario";
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = "Error de conexión al cargar el video";
          shouldRetry = true;
          break;
        case MediaError.MEDIA_ERR_DECODE:
          // Enhanced decode error handling with timing information
          const currentTime = video?.currentTime ?? 0;
          const isEarlyError = currentTime < 5; // Error in first 5 seconds
          const isMidPlaybackError = currentTime >= 3; // Error after some playback

          console.log("🎥 ModernVideoPlayer - Decode error detected:", {
            currentTime,
            videoExists: !!video,
            videoSrc: video?.src || videoSrc,
            hasBuffered: video?.buffered ? video.buffered.length > 0 : false,
            isCorruptedData: title === "aaaaaaaaaaaaaa",
            isDevelopmentMode: process.env.NODE_ENV === "development",
            filename: video?.src?.split("/").pop()?.split("?")[0] || "unknown",
          });

          // Check for corrupted lesson data
          const isCorruptedLesson =
            title === "aaaaaaaaaaaaaa" || (title && title.match(/^a+$/));

          if (isCorruptedLesson) {
            errorMessage =
              "Error de decodificación del video. El archivo puede estar corrupto o usar un codec no compatible.\n\n⚠️ DATOS CORRUPTOS DETECTADOS: Los datos de la lección parecen estar corruptos (título: 'aaaaaaaaaaaaaa'). Esto sugiere un problema con la base de datos o el proceso de creación de la lección.";
          } else if (isMidPlaybackError) {
            errorMessage =
              "Error de decodificación del video. El archivo puede estar corrupto o usar un codec no compatible.\n\nEste error ocurrió durante la reproducción, lo que sugiere problemas con la codificación del video o buffering.";
          } else {
            errorMessage =
              "Error de decodificación del video. El archivo puede estar corrupto o usar un codec no compatible.\n\nEste error ocurrió temprano en la reproducción (a los " +
              currentTime.toFixed(1) +
              " segundos).";
          }

          console.error(
            "🎥 ModernVideoPlayer - Decode error timing analysis:",
            {
              currentTime: currentTime || 0,
              isEarlyError,
              isMidPlaybackError,
              videoSrc: video?.src || videoSrc || "No source",
              videoFormat: video?.src
                ? video.src.includes(".webm")
                  ? "WebM"
                  : video.src.includes(".mp4")
                    ? "MP4"
                    : "Unknown"
                : "No format detected",
              hasBufferedData: video?.buffered
                ? video.buffered.length > 0
                : false,
              bufferedEnd:
                video?.buffered?.length > 0
                  ? (() => {
                      try {
                        return video.buffered.end(0);
                      } catch (e) {
                        return 0;
                      }
                    })()
                  : 0,
              duration: video?.duration || 0,
              readyState: video?.readyState || 0,
              networkState: video?.networkState || 0,
              errorCode: video?.error?.code || "No error code",
              errorMessage: video?.error?.message || "No error message",
            }
          );
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage =
            "Formato de video no soportado o archivo no encontrado";
          shouldRetry = true;
          break;
        default:
          errorMessage = `Error desconocido (${video.error.code}): ${video.error.message || "Sin detalles"}`;
      }
    } else {
      // No specific error code - analyze video state
      console.warn(
        "🎥 ModernVideoPlayer - No specific error code, analyzing video state..."
      );

      if (video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        errorMessage = "No se pudo encontrar la fuente del video";
        shouldRetry = true;
      } else if (video.networkState === HTMLMediaElement.NETWORK_EMPTY) {
        errorMessage = "Error de inicialización del video";
        shouldRetry = true;
      } else if (video.readyState === HTMLMediaElement.HAVE_NOTHING) {
        errorMessage = "No se pudo cargar ningún dato del video";
        shouldRetry = true;
      } else {
        // Generic network/loading error
        errorMessage = "Error desconocido durante la carga del video";
        shouldRetry = true;
      }
    }

    // Auto-retry logic for MinIO URLs
    const isMinIODirect =
      video.src &&
      (video.src.includes("127.0.0.1:9000") ||
        video.src.includes("localhost:9000"));

    const isDecodeError = video.error?.code === MediaError.MEDIA_ERR_DECODE;

    // If it's a decode error with direct MinIO access, force proxy immediately
    if (isDecodeError && isMinIODirect) {
      console.log(
        "🎥 ModernVideoPlayer - Decode error with direct MinIO access, forcing proxy..."
      );
      const proxyUrl = `/api/video-proxy?url=${encodeURIComponent(video.src)}`;
      console.log(
        "🎥 ModernVideoPlayer - Switching to proxy for decode error:",
        proxyUrl
      );

      video.src = proxyUrl;
      video.load();
      return; // Don't show error yet, give proxy a chance
    }

    // If it's a decode error with proxy, try to fix the video
    const isUsingProxy = video?.src?.includes("/api/video-proxy") || false;
    if (isDecodeError && isUsingProxy && shouldRetry && video?.src) {
      console.log(
        "🎥 ModernVideoPlayer - Decode error with proxy, attempting video fix..."
      );

      // Try to call the video fix API
      const urlParts = video.src.split("?");
      const originalUrl =
        urlParts.length > 1
          ? new URLSearchParams(urlParts[1])?.get("url")
          : null;
      if (originalUrl) {
        attemptVideoAutoFix(video.src)
          .then((fixResult) => {
            if (fixResult.success && fixResult.fixedUrl) {
              console.log(
                "🎥 ModernVideoPlayer - Video fix successful, reloading..."
              );
              video.src = fixResult.fixedUrl;
              video.load();
              return;
            } else {
              console.warn(
                "🎥 ModernVideoPlayer - Video fix failed:",
                fixResult.error
              );
              setError(errorMessage);
              setIsLoading(false);
            }
          })
          .catch((fixError) => {
            console.error("🎥 ModernVideoPlayer - Video fix error:", fixError);
            setError(errorMessage);
            setIsLoading(false);
          });
        return; // Don't show error yet, give fix a chance
      }
    }

    // Standard retry logic for other errors
    if (shouldRetry && video.src && !video.src.includes("/api/video-proxy")) {
      console.log("🎥 ModernVideoPlayer - Attempting to use proxy URL...");
      const proxyUrl = `/api/video-proxy?url=${encodeURIComponent(video.src)}`;
      console.log("🎥 ModernVideoPlayer - Switching to proxy:", proxyUrl);

      // Try proxy URL
      video.src = proxyUrl;
      video.load();
      return; // Don't show error yet
    }

    setError(errorMessage);
    setIsLoading(false);
  };

  const handleCanPlay = () => {
    setIsLoading(false);

    // Clear waiting timeout since video can play now
    if (waitingTimeoutRef.current) {
      clearTimeout(waitingTimeoutRef.current);
      waitingTimeoutRef.current = null;
    }
  };

  const handleWaiting = () => {
    setIsLoading(true);

    // Set up timeout to detect extended waiting (common with large files)
    const video = videoRef.current;
    if (video) {
      console.log(
        "🎥 ModernVideoPlayer - Video waiting, setting up timeout for extended wait detection"
      );

      // Clear any existing timeout
      if (waitingTimeoutRef.current) {
        clearTimeout(waitingTimeoutRef.current);
      }

      // Set timeout for 3 seconds
      waitingTimeoutRef.current = setTimeout(() => {
        handleWaitingExtended();
      }, 3000);
    }
  };

  const handleCanPlayThrough = () => {
    setIsLoading(false);

    // Clear waiting timeout since video can play through now
    if (waitingTimeoutRef.current) {
      clearTimeout(waitingTimeoutRef.current);
      waitingTimeoutRef.current = null;
    }
  };

  const handleStalled = () => {
    const video = videoRef.current;
    console.warn("🎥 ModernVideoPlayer - Video stalled, network may be slow", {
      currentTime: video?.currentTime || 0,
      buffered: video?.buffered?.length || 0,
      readyState: video?.readyState || 0,
      networkState: video?.networkState || 0,
    });
    setIsLoading(true);

    // If video stalls after some playback, it might be a streaming issue for large files
    if (video && video.currentTime > 1) {
      console.warn(
        "🎥 ModernVideoPlayer - Video stalled after playback started, potential streaming issue for large files"
      );

      // Check if this might be a large file streaming issue
      if (video.currentTime > 1 && video.currentTime < 5) {
        console.log(
          "🎥 ModernVideoPlayer - Early stall detected, might be large file streaming issue"
        );
      }
    }
  };

  const handleSuspend = () => {
    console.log("🎥 ModernVideoPlayer - Video loading suspended");
  };

  const handleAbort = () => {
    console.warn("🎥 ModernVideoPlayer - Video loading aborted");
    setError("Carga del video interrumpida");
  };

  // Additional handler for seeking errors that can cause decode issues
  const handleSeeked = () => {
    const video = videoRef.current;
    if (video) {
      console.log("🎥 ModernVideoPlayer - Video seeked to:", video.currentTime);

      // Check if seeking caused any issues
      if (video.error) {
        console.error(
          "🎥 ModernVideoPlayer - Error after seeking:",
          video.error
        );
        handleError();
      }
    }
  };

  const handleLoadStart = () => {
    console.log("🎥 ModernVideoPlayer - Load started");
    setError(null);
    setIsLoading(true);
  };

  const handleProgress = () => {
    const video = videoRef.current;
    if (!video) return;

    console.log("🎥 ModernVideoPlayer - Loading progress:", {
      buffered:
        video.buffered.length > 0
          ? `${video.buffered.end(0)}/${video.duration}`
          : "0",
      networkState: video.networkState,
      readyState: video.readyState,
    });
  };

  const handleEmptied = () => {
    console.warn(
      "🎥 ModernVideoPlayer - Video emptied (network error or media reset)"
    );
  };

  // Add handler for when video stops progressing (common with large files)
  const handleWaitingExtended = () => {
    const video = videoRef.current;
    if (video) {
      console.warn("🎥 ModernVideoPlayer - Extended waiting detected:", {
        currentTime: video.currentTime,
        bufferedEnd: video.buffered.length > 0 ? video.buffered.end(0) : 0,
        readyState: video.readyState,
        networkState: video.networkState,
      });

      // If video has been waiting for too long and we have some buffer, try to resume
      if (video.currentTime > 1 && video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(0);
        const gap = bufferedEnd - video.currentTime;

        console.log(`🎥 ModernVideoPlayer - Buffer gap: ${gap.toFixed(2)}s`);

        if (gap > 0.5) {
          console.log(
            "🎥 ModernVideoPlayer - Sufficient buffer available, trying to resume playback"
          );
          // Small delay then try to play
          setTimeout(() => {
            if (video.paused && !video.ended) {
              video.play().catch((e) => console.warn("Resume play failed:", e));
            }
          }, 100);
        }
      }
    }
  };

  // Control functions
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video || duration === 0) return;

    const newTime = (value[0] / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0] / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(video.currentTime + 10, duration);
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(video.currentTime - 10, 0);
  };

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSettings(false);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Effects
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isYouTube) return;

    // Add stability check for development environment
    if (process.env.NODE_ENV === "development") {
      console.log("🎥 ModernVideoPlayer - Setting up video events (dev mode)");

      // Small delay to let HMR settle
      const setupTimeout = setTimeout(() => {
        if (!videoRef.current) {
          console.warn(
            "🎥 ModernVideoPlayer - Video ref lost during HMR, skipping event setup"
          );
          return;
        }
        setupVideoEvents();
      }, 100);

      return () => {
        clearTimeout(setupTimeout);
        cleanupVideoEvents();
      };
    } else {
      setupVideoEvents();
      return cleanupVideoEvents;
    }

    function setupVideoEvents() {
      const video = videoRef.current;
      if (!video) return;

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      video.addEventListener("ended", handleEnded);
      video.addEventListener("error", handleError);
      video.addEventListener("canplay", handleCanPlay);
      video.addEventListener("waiting", handleWaiting);
      video.addEventListener("canplaythrough", handleCanPlayThrough);
      video.addEventListener("stalled", handleStalled);
      video.addEventListener("suspend", handleSuspend);
      video.addEventListener("abort", handleAbort);
      video.addEventListener("loadstart", handleLoadStart);
      video.addEventListener("progress", handleProgress);
      video.addEventListener("emptied", handleEmptied);
      video.addEventListener("seeked", handleSeeked);
    }

    function cleanupVideoEvents() {
      const video = videoRef.current;
      if (!video) return;

      // Clear timeouts
      if (waitingTimeoutRef.current) {
        clearTimeout(waitingTimeoutRef.current);
        waitingTimeoutRef.current = null;
      }

      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("error", handleError);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
      video.removeEventListener("stalled", handleStalled);
      video.removeEventListener("suspend", handleSuspend);
      video.removeEventListener("abort", handleAbort);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("emptied", handleEmptied);
      video.removeEventListener("seeked", handleSeeked);
    }
  }, [isYouTube]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Validate video source
  if (!src || (!isYouTube && !videoSrc)) {
    return (
      <div
        className={cn(
          "relative bg-black flex items-center justify-center h-full min-h-[400px]",
          className
        )}
      >
        <div className="text-center text-white">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Video no disponible</h3>
          <p className="text-gray-400">
            No se pudo cargar el contenido del video
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className={cn(
          "relative bg-black flex items-center justify-center h-full min-h-[400px]",
          className
        )}
      >
        <div className="text-center text-white max-w-md mx-auto p-6">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold mb-2">Error de reproducción</h3>
          <p className="text-gray-300 mb-4 text-sm leading-relaxed">{error}</p>

          {/* Troubleshooting info */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-4 text-xs text-gray-400">
            <h4 className="text-white font-medium mb-2">
              Información técnica:
            </h4>
            <div className="space-y-1 text-left">
              <p>
                Video:{" "}
                {title && title !== "aaaaaaaaaaaaaa" && title.length > 0
                  ? title
                  : "Sin título disponible"}
              </p>
              <p>
                Fuente:{" "}
                {videoSrc
                  ? videoSrc.includes("/api/video-proxy")
                    ? "Proxy MinIO"
                    : videoSrc.includes("127.0.0.1:9000") ||
                        videoSrc.includes("localhost:9000")
                      ? "Directo MinIO (⚠️ Debería usar proxy)"
                      : "Otro servidor"
                  : "No definida"}
              </p>
              <p>Formato: {isYouTube ? "YouTube" : "Video archivo"}</p>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => {
                setError(null);
                setIsLoading(true);
                const video = videoRef.current;
                if (video) {
                  // Try to reload with proxy if not already using it
                  if (!video.src.includes("/api/video-proxy") && !isYouTube) {
                    const proxyUrl = `/api/video-proxy?url=${encodeURIComponent(src)}`;
                    console.log(
                      "🎥 ModernVideoPlayer - Retry with proxy:",
                      proxyUrl
                    );
                    video.src = proxyUrl;
                  }
                  video.load();
                }
              }}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>

            {!isYouTube && (
              <Button
                variant="outline"
                className="bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30"
                onClick={() => {
                  // Force proxy URL
                  setError(null);
                  setIsLoading(true);
                  const video = videoRef.current;
                  if (video) {
                    const proxyUrl = `/api/video-proxy?url=${encodeURIComponent(src)}`;
                    console.log(
                      "🎥 ModernVideoPlayer - Force proxy:",
                      proxyUrl
                    );
                    video.src = proxyUrl;
                    video.load();
                  }
                }}
              >
                🔧 Usar Proxy
              </Button>
            )}

            {/* Manual fix button for decode errors */}
            {error && error.includes("decodificación") && !isYouTube && (
              <Button
                variant="outline"
                className="bg-orange-500/10 border-orange-500/20 text-orange-300 hover:bg-orange-500/20"
                onClick={async () => {
                  setError(null);
                  setIsLoading(true);

                  try {
                    console.log("🔧 Manual video fix triggered");
                    const fixResult = await attemptVideoAutoFix(videoSrc);

                    if (fixResult.success && fixResult.fixedUrl) {
                      console.log("🔧 Manual video fix successful");
                      if (videoRef.current) {
                        videoRef.current.src = fixResult.fixedUrl;
                        videoRef.current.load();
                      }
                    } else {
                      console.error(
                        "🔧 Manual video fix failed:",
                        fixResult.error
                      );
                      setError(
                        `Error al reparar video: ${fixResult.error || "No se pudo reparar el video automáticamente"}`
                      );
                      setIsLoading(false);
                    }
                  } catch (fixError) {
                    console.error("🔧 Manual video fix error:", fixError);
                    setError(
                      `Error al reparar video: ${(fixError as Error).message}`
                    );
                    setIsLoading(false);
                  }
                }}
              >
                🔧 Reparar Video
              </Button>
            )}

            {/* Special button for corrupted lesson data */}
            {error && error.includes("DATOS CORRUPTOS") && (
              <Button
                variant="outline"
                className="bg-red-500/10 border-red-500/20 text-red-300 hover:bg-red-500/20"
                onClick={() => {
                  alert(
                    "🚨 PROBLEMA DETECTADO: Datos de lección corruptos\n\n" +
                      "El título de la lección muestra 'aaaaaaaaaaaaaa', lo que indica datos corruptos.\n\n" +
                      "SOLUCIONES RECOMENDADAS:\n" +
                      "1. Ve al panel de administración\n" +
                      "2. Edita esta lección y corrige el título/descripción\n" +
                      "3. Reemplaza el video con un archivo nuevo\n" +
                      "4. Si el problema persiste, verifica la base de datos\n\n" +
                      "CAUSA POSIBLE:\n" +
                      "- Error durante la creación de la lección\n" +
                      "- Problema con el formulario de administración\n" +
                      "- Corrupción de datos en la base de datos"
                  );
                }}
              >
                ⚠️ Datos Corruptos - Ver Guía
              </Button>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Si el problema persiste, contacta al administrador del curso.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative bg-black group h-full min-h-[400px] overflow-hidden rounded-lg",
        className
      )}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => {
        if (isPlaying) {
          setShowControlsOverlay(false);
        }
      }}
      onClick={showControlsTemporarily}
    >
      {/* Video Element */}
      {isYouTube && youTubeId ? (
        <iframe
          src={`https://www.youtube.com/embed/${youTubeId}?enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}&autoplay=${autoPlay ? 1 : 0}&controls=${showControls ? 1 : 0}`}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title || "Video"}
          onLoad={() => setIsLoading(false)}
        />
      ) : (
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover"
          preload="auto"
          playsInline
          crossOrigin="anonymous"
          autoPlay={autoPlay}
          onDoubleClick={toggleFullscreen}
        />
      )}

      {/* Loading Overlay */}
      {isLoading && !isYouTube && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center text-white">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <p className="text-sm">Cargando video...</p>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      {!isYouTube && showControls && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 transition-opacity duration-300",
            showControlsOverlay
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          )}
        >
          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium text-lg truncate">
                {title || "Video"}
              </h3>
              <div className="flex items-center gap-2">
                {/* Settings Menu */}
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
                    <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-md rounded-lg p-2 min-w-[150px] border border-white/20">
                      <div className="text-white text-sm font-medium mb-2">
                        Velocidad
                      </div>
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => changePlaybackRate(rate)}
                          className={cn(
                            "w-full text-left px-3 py-1 rounded text-sm hover:bg-white/20 transition-colors",
                            playbackRate === rate
                              ? "text-blue-400"
                              : "text-white"
                          )}
                        >
                          {rate === 1 ? "Normal" : `${rate}x`}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

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

          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="lg"
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-md border border-white/30 text-white hover:bg-black/70 hover:scale-110 transition-all duration-200"
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="space-y-3">
              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="relative">
                  {/* Buffer Bar */}
                  <div className="absolute inset-0 bg-white/20 rounded-full h-1">
                    <div
                      className="bg-white/40 h-full rounded-full transition-all duration-300"
                      style={{ width: `${buffered}%` }}
                    />
                  </div>

                  {/* Progress Slider */}
                  <Slider
                    value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
                    onValueChange={handleSeek}
                    max={100}
                    step={0.1}
                    className="relative z-10"
                  />
                </div>

                <div className="flex justify-between text-xs text-white/80">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipBackward}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

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

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={skipForward}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>

                  <div className="w-20">
                    <Slider
                      value={[isMuted ? 0 : volume * 100]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                    />
                  </div>

                  <span className="text-xs text-white/80 w-8">
                    {Math.round(isMuted ? 0 : volume * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click to show controls when hidden */}
      {!showControlsOverlay && !isYouTube && (
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={showControlsTemporarily}
        />
      )}
    </div>
  );
};
