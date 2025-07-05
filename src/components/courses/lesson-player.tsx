&ldquo;use client&rdquo;;

import { useState, useRef, useEffect } from &ldquo;react&rdquo;;
import { Lesson } from &ldquo;@/types/courses&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Slider } from &ldquo;@/components/ui/slider&rdquo;;
import { Card, CardContent } from &ldquo;@/components/ui/card&rdquo;;
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  RotateCcw,
  RotateCw,
  CheckCircle2,
} from &ldquo;lucide-react&rdquo;;
import { formatDuration } from &ldquo;date-fns&rdquo;;

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete: () => void;
}

export const LessonPlayer = ({ lesson, onComplete }: LessonPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setIsCompleted(true);
    };

    video.addEventListener(&ldquo;timeupdate&rdquo;, updateTime);
    video.addEventListener(&ldquo;loadedmetadata&rdquo;, updateDuration);
    video.addEventListener(&ldquo;ended&rdquo;, handleEnded);

    return () => {
      video.removeEventListener(&ldquo;timeupdate&rdquo;, updateTime);
      video.removeEventListener(&ldquo;loadedmetadata&rdquo;, updateDuration);
      video.removeEventListener(&ldquo;ended&rdquo;, handleEnded);
    };
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const percentage = (currentTime / duration) * 100;
      setWatchedPercentage(percentage);

      // Mark as completed when 90% watched
      if (percentage >= 90 && !isCompleted) {
        setIsCompleted(true);
      }
    }
  }, [currentTime, duration, isCompleted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

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

  const changePlaybackRate = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, &ldquo;0&rdquo;)}`;
  };

  return (
    <div className=&ldquo;max-w-4xl mx-auto&rdquo;>
      {/* Video Player */}
      <Card className=&ldquo;mb-6&rdquo;>
        <CardContent className=&ldquo;p-0&rdquo;>
          <div
            className=&ldquo;relative bg-black rounded-lg overflow-hidden group&rdquo;
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            <video
              ref={videoRef}
              className=&ldquo;w-full aspect-video&rdquo;
              poster={lesson.content.video?.thumbnails?.[0]}
              onClick={togglePlay}
            >
              <source src={lesson.content.video?.url} type=&ldquo;video/mp4&rdquo; />
              {lesson.content.video?.subtitles?.map((subtitle) => (
                <track
                  key={subtitle.language}
                  src={subtitle.url}
                  kind=&ldquo;subtitles&rdquo;
                  srcLang={subtitle.language}
                  label={
                    subtitle.language === &ldquo;es&rdquo; ? &ldquo;Español&rdquo; : subtitle.language
                  }
                />
              ))}
            </video>

            {/* Video Controls Overlay */}
            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity ${showControls ? &ldquo;opacity-100&rdquo; : &ldquo;opacity-0&rdquo;}`}
            >
              {/* Progress Bar */}
              <div className=&ldquo;mb-4&rdquo;>
                <Slider
                  value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
                  onValueChange={handleSeek}
                  max={100}
                  step={0.1}
                  className=&ldquo;w-full&rdquo;
                />
                <div className=&ldquo;flex justify-between text-xs text-white mt-1&rdquo;>
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className=&ldquo;flex items-center justify-between&rdquo;>
                <div className=&ldquo;flex items-center gap-2&rdquo;>
                  <Button
                    variant=&ldquo;ghost&rdquo;
                    size=&ldquo;sm&rdquo;
                    onClick={skipBackward}
                    className=&ldquo;text-white hover:bg-white/20&rdquo;
                  >
                    <RotateCcw className=&ldquo;h-4 w-4&rdquo; />
                  </Button>

                  <Button
                    variant=&ldquo;ghost&rdquo;
                    size=&ldquo;sm&rdquo;
                    onClick={togglePlay}
                    className=&ldquo;text-white hover:bg-white/20&rdquo;
                  >
                    {isPlaying ? (
                      <Pause className=&ldquo;h-5 w-5&rdquo; />
                    ) : (
                      <Play className=&ldquo;h-5 w-5&rdquo; />
                    )}
                  </Button>

                  <Button
                    variant=&ldquo;ghost&rdquo;
                    size=&ldquo;sm&rdquo;
                    onClick={skipForward}
                    className=&ldquo;text-white hover:bg-white/20&rdquo;
                  >
                    <RotateCw className=&ldquo;h-4 w-4&rdquo; />
                  </Button>

                  <div className=&ldquo;flex items-center gap-2 ml-4&rdquo;>
                    <Button
                      variant=&ldquo;ghost&rdquo;
                      size=&ldquo;sm&rdquo;
                      onClick={toggleMute}
                      className=&ldquo;text-white hover:bg-white/20&rdquo;
                    >
                      {isMuted ? (
                        <VolumeX className=&ldquo;h-4 w-4&rdquo; />
                      ) : (
                        <Volume2 className=&ldquo;h-4 w-4&rdquo; />
                      )}
                    </Button>
                    <Slider
                      value={[isMuted ? 0 : volume * 100]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      className=&ldquo;w-16&rdquo;
                    />
                  </div>
                </div>

                <div className=&ldquo;flex items-center gap-2&rdquo;>
                  {/* Playback Speed */}
                  <select
                    value={playbackRate}
                    onChange={(e) => changePlaybackRate(Number(e.target.value))}
                    className=&ldquo;bg-transparent text-white text-sm border border-white/20 rounded px-2 py-1&rdquo;
                  >
                    <option value={0.5} className=&ldquo;text-black&rdquo;>
                      0.5x
                    </option>
                    <option value={0.75} className=&ldquo;text-black&rdquo;>
                      0.75x
                    </option>
                    <option value={1} className=&ldquo;text-black&rdquo;>
                      1x
                    </option>
                    <option value={1.25} className=&ldquo;text-black&rdquo;>
                      1.25x
                    </option>
                    <option value={1.5} className=&ldquo;text-black&rdquo;>
                      1.5x
                    </option>
                    <option value={2} className=&ldquo;text-black&rdquo;>
                      2x
                    </option>
                  </select>

                  <Button
                    variant=&ldquo;ghost&rdquo;
                    size=&ldquo;sm&rdquo;
                    onClick={toggleFullscreen}
                    className=&ldquo;text-white hover:bg-white/20&rdquo;
                  >
                    <Maximize className=&ldquo;h-4 w-4&rdquo; />
                  </Button>
                </div>
              </div>
            </div>

            {/* Play Button Overlay (when paused) */}
            {!isPlaying && (
              <div className=&ldquo;absolute inset-0 flex items-center justify-center&rdquo;>
                <Button
                  onClick={togglePlay}
                  size=&ldquo;lg&rdquo;
                  className=&ldquo;rounded-full h-16 w-16 bg-white/20 hover:bg-white/30 text-white&rdquo;
                >
                  <Play className=&ldquo;h-8 w-8 fill-current&rdquo; />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lesson Info and Progress */}
      <div className=&ldquo;space-y-6&rdquo;>
        <Card>
          <CardContent className=&ldquo;p-6&rdquo;>
            <div className=&ldquo;flex items-start justify-between mb-4&rdquo;>
              <div>
                <h2 className=&ldquo;text-xl font-semibold mb-2&rdquo;>{lesson.title}</h2>
                {lesson.description && (
                  <p className=&ldquo;text-muted-foreground&rdquo;>{lesson.description}</p>
                )}
              </div>
              <div className=&ldquo;text-right&rdquo;>
                <div className=&ldquo;text-2xl font-bold text-blue-600&rdquo;>
                  {Math.round(watchedPercentage)}%
                </div>
                <div className=&ldquo;text-sm text-muted-foreground&rdquo;>Progreso</div>
              </div>
            </div>

            <div className=&ldquo;space-y-4&rdquo;>
              <div>
                <div className=&ldquo;flex justify-between text-sm mb-2&rdquo;>
                  <span>Progreso de la lección</span>
                  <span>{Math.round(watchedPercentage)}%</span>
                </div>
                <div className=&ldquo;w-full bg-gray-200 rounded-full h-2&rdquo;>
                  <div
                    className=&ldquo;bg-blue-600 h-2 rounded-full transition-all duration-300&rdquo;
                    style={{ width: `${watchedPercentage}%` }}
                  ></div>
                </div>
              </div>

              {(isCompleted || watchedPercentage >= 90) && (
                <Button
                  onClick={onComplete}
                  className=&ldquo;w-full&rdquo;
                  disabled={isCompleted}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className=&ldquo;h-4 w-4 mr-2&rdquo; />
                      Lección completada
                    </>
                  ) : (
                    &ldquo;Marcar como completada&rdquo;
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Content */}
        {lesson.content.text && (
          <Card>
            <CardHeader>
              <h3 className=&ldquo;text-lg font-semibold&rdquo;>Información adicional</h3>
            </CardHeader>
            <CardContent>
              <div className=&ldquo;prose max-w-none&rdquo;>
                <p>{lesson.content.text}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attachments */}
        {lesson.attachments && lesson.attachments.length > 0 && (
          <Card>
            <CardHeader>
              <h3 className=&ldquo;text-lg font-semibold&rdquo;>Recursos descargables</h3>
            </CardHeader>
            <CardContent>
              <div className=&ldquo;space-y-2&rdquo;>
                {lesson.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className=&ldquo;flex items-center justify-between p-3 bg-muted rounded-lg&rdquo;
                  >
                    <div className=&ldquo;flex items-center gap-3&rdquo;>
                      <div className=&ldquo;p-2 bg-blue-100 rounded&rdquo;>
                        <svg
                          className=&ldquo;h-4 w-4 text-blue-600&rdquo;
                          fill=&ldquo;currentColor&rdquo;
                          viewBox=&ldquo;0 0 20 20&rdquo;
                        >
                          <path
                            fillRule=&ldquo;evenodd&rdquo;
                            d=&ldquo;M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z&rdquo;
                            clipRule=&ldquo;evenodd&rdquo;
                          />
                        </svg>
                      </div>
                      <div>
                        <div className=&ldquo;font-medium&rdquo;>{attachment.name}</div>
                        <div className=&ldquo;text-sm text-muted-foreground&rdquo;>
                          {attachment.type} •{&ldquo; &rdquo;}
                          {(attachment.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <Button variant=&ldquo;outline&rdquo; size=&ldquo;sm&rdquo; asChild>
                      <a href={attachment.url} download>
                        <svg
                          className=&ldquo;h-4 w-4 mr-2&rdquo;
                          fill=&ldquo;currentColor&rdquo;
                          viewBox=&ldquo;0 0 20 20&rdquo;
                        >
                          <path
                            fillRule=&ldquo;evenodd&rdquo;
                            d=&ldquo;M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z&rdquo;
                            clipRule=&ldquo;evenodd&rdquo;
                          />
                        </svg>
                        Descargar
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
