"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  downloadable?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  thumbnailUrl,
  title,
  className = "",
  width = "100%",
  height = 400,
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  onProgress,
  onComplete,
  downloadable = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isYouTube, setIsYouTube] = useState(false);
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState("");

  // Check if it's a YouTube URL and convert to embed URL
  useEffect(() => {
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      setIsYouTube(true);
      const videoId = extractYouTubeId(videoUrl);
      if (videoId) {
        setYoutubeEmbedUrl(`https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&controls=${controls ? 1 : 0}`);
      }
    } else {
      setIsYouTube(false);
    }
  }, [videoUrl, autoPlay, muted, loop, controls]);

  // Extract YouTube video ID
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Handle time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      
      if (onProgress && total > 0) {
        const progress = (current / total) * 100;
        onProgress(progress);
      }
    }
  };

  // Handle video end
  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (onComplete) {
      onComplete();
    }
  };

  // Handle loaded metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  // Handle download
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = title || 'video';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format time
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle mouse movement for controls visibility
  const handleMouseMove = () => {
    setShowControls(true);
    setTimeout(() => setShowControls(false), 3000);
  };

  // YouTube iframe component
  if (isYouTube && youtubeEmbedUrl) {
    return (
      <div 
        className={`relative ${className}`}
        style={{ width, height }}
        onMouseMove={handleMouseMove}
      >
        <iframe
          src={youtubeEmbedUrl}
          title={title || "YouTube video"}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg"
        />
        {downloadable && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
        )}
      </div>
    );
  }

  // Custom video player
  return (
    <div 
      className={`relative group ${className}`}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        className="w-full h-full object-cover rounded-lg"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnd}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
      />
      
      {/* Custom Controls */}
      {controls && (
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {/* Progress Bar */}
          <div 
            className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-4"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-200"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              {/* Time */}
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              
              {/* Volume */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Download */}
              {downloadable && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  className="text-white hover:bg-white/20"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              
              {/* Settings */}
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Settings className="h-4 w-4" />
              </Button>
              
              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Title overlay */}
      {title && (
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-md text-sm">
          {title}
        </div>
      )}
    </div>
  );
};
