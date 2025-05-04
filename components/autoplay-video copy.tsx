"use client";
import { cn } from "@/lib/utils";
import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ClockIcon,
  HeartIcon,
  PauseCircleIcon,
  PictureInPicture,
  PlayCircleIcon,
  Volume2,
  VolumeOff,
} from "lucide-react";
import { formatTime } from "@/utils/utils";
import { debounce } from "lodash";

type Props = {
  src: string;
  isLiked?: boolean;
  setIsLiked: (liked: boolean) => void;
};

type Heart = {
  x: number;
  y: number;
  id: string;
  rotation: number;
  scale: number;
  opacity: number;
};

interface ControlButtonProps {
  onClick: () => void;
  Icon: React.ElementType;
  size?: string;
  bgColor?: string;
}

const ControlButton = React.memo(
  ({
    onClick,
    Icon,
    size = "w-8 h-8",
    bgColor = "bg-black",
  }: ControlButtonProps) => (
    <motion.div
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 100 }}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onClick();
      }}
      className={`${bgColor} ${size} group rounded-full p-2 flex bg-opacity-25 hover:bg-opacity-100 items-center justify-center transition-opacity duration-300 ease-in-out cursor-pointer pointer-events-auto`}
    >
      <Icon className="w-full h-full text-white group-hover:text-white" />
    </motion.div>
  )
);

ControlButton.displayName = "ControlButton";

const AutoPlayVideo = ({ src, isLiked, setIsLiked }: Props) => {
  const videoRef = createRef<HTMLVideoElement>();
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [videoState, setVideoState] = useState({
    progress: 0,
    currentTime: 0,
    duration: 0,
  });
  const [isUserControlled, setIsUserControlled] = useState(false);
  const [audioPool, setAudioPool] = useState<HTMLAudioElement[]>([]);
  const [audioIndex, setAudioIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Debounced hover handlers
  const debouncedSetHovered = useMemo(
    () => debounce((value: boolean) => setIsHovered(value), 100),
    []
  );

  // Initialize audio pool
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pool = Array.from(
        { length: 3 },
        () => new Audio("/sfx/reactionsfx.mp3")
      );
      setAudioPool(pool);
      return () => {
        pool.forEach((audio) => {
          audio.pause();
          audio.currentTime = 0;
        });
      };
    }
  }, []);

  const addHeart = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (hearts.length > 10) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newHearts: Heart[] = [];
      Array.from({ length: 2 }).forEach((_, index) => {
        const rotation = Math.random() * 30 - 15 + index * 2;
        const id = `likeHeart-${Math.random().toString(36).substring(2, 9)}-${index}`;
        const scale = 1.5 - index * 0.1;
        const opacity = 1 - index * 0.2;

        newHearts.push({
          x,
          y: y - index * 50,
          rotation,
          id,
          scale,
          opacity,
        });
      });
      setIsLiked(true);
      setHearts((prev) => [...prev, ...newHearts].slice(-10));
      if (audioPool.length > 0) {
        const audio = audioPool[audioIndex];
        audio
          .play()
          .catch((err) => console.warn("Audio playback failed:", err));
        setAudioIndex((prev) => (prev + 1) % audioPool.length);
      }
    },
    [hearts.length, setIsLiked, audioPool, audioIndex]
  );

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setPlaying(false);
    } else {
      video.play().catch((err) => console.warn("Manual play failed:", err));
      setPlaying(true);
    }
    setIsUserControlled(true);
  }, [isPlaying, videoRef]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const toggleZoom = useCallback(() => {
    if (document.pictureInPictureEnabled) {
      videoRef.current?.requestPictureInPicture();
    }
  }, [videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Sync video state with actual playback
    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      // Attempt to play when video is ready, if not user-controlled
      if (!isUserControlled) {
        video.play().catch((err) => console.warn("Initial play failed:", err));
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);

    let rafId: number;
    let lastUpdate = 0;

    const updateProgress = (timestamp: number) => {
      if (timestamp - lastUpdate < 500) {
        rafId = requestAnimationFrame(updateProgress);
        return;
      }

      const vidCurrentTime = video.currentTime;
      const vidDuration = video.duration || 1;
      setVideoState({
        progress: (vidCurrentTime / vidDuration) * 100,
        currentTime: vidCurrentTime,
        duration: vidDuration,
      });
      lastUpdate = timestamp;
      rafId = requestAnimationFrame(updateProgress);
    };

    rafId = requestAnimationFrame(updateProgress);

    // Debounced observer callback
    const handleIntersection = debounce(
      ([entry]: IntersectionObserverEntry[]) => {
        if (!isUserControlled && !isLoading) {
          if (entry.isIntersecting) {
            video
              .play()
              .catch((err) => console.warn("Observer play failed:", err));
          } else {
            video.pause();
            video.currentTime = 0;
          }
        }
      },
      200
    );

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.4,
    });

    observer.observe(video);

    // Attempt initial play on mount if in view
    if (!isUserControlled) {
      video.play().catch((err) => console.warn("Mount play failed:", err));
    }

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
      handleIntersection.cancel();
    };
  }, [videoRef, isUserControlled, isLoading]);

  // Sync muted state
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = isMuted;
    }
  }, [isMuted, videoRef]);

  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden w-full h-96 relative bg-background-3"
      )}
      onDoubleClick={addHeart}
      onMouseEnter={() => debouncedSetHovered(true)}
      onMouseLeave={() => debouncedSetHovered(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        preload="auto"
        loop
        muted={isMuted}
        src={src}
      >
        Your browser does not support the video tag.
      </video>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <AnimatePresence>
        {hearts.map((heart, index) => {
          const animationDuration = Math.max(0.1, 0.5 - index * 0.08);
          return (
            <motion.div
              key={heart.id}
              initial={{
                opacity: 0,
                scale: 0,
                y: 0,
                rotate: heart.rotation,
              }}
              animate={{
                opacity: heart.opacity,
                scale: heart.scale,
                y: -75,
                rotate: heart.rotation,
              }}
              exit={{
                opacity: 0,
                scale: heart.scale + 0.3,
                y: "100%",
                transition: { duration: 0.3 },
              }}
              transition={{
                duration: animationDuration,
                ease: "easeOut",
              }}
              style={{
                position: "absolute",
                left: heart.x,
                top: heart.y,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
              onAnimationComplete={() =>
                setHearts((prev) => prev.filter((h) => h.id !== heart.id))
              }
            >
              <HeartIcon
                className={cn("text-destructive fill-destructive", {
                  "w-10 h-10": heart.scale > 0.5,
                  "w-6 h-6": heart.scale <= 0.5,
                })}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div className="absolute top-5 left-5 p-2 bg-black bg-opacity-50 ring-opacity-50 rounded-full text-sm ring-2 ring-primary flex items-center gap-2">
        <ClockIcon className="w-5 h-5" />
        <span>{formatTime(videoState.currentTime)}</span>
        <span className="text-muted-foreground"> / </span>
        <span>{formatTime(videoState.duration)}</span>
      </div>

      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-0 right-0 p-2 gap-2 flex flex-col inset-0 items-end justify-end"
        >
          <ControlButton Icon={PictureInPicture} onClick={toggleZoom} />
          <ControlButton
            onClick={togglePlay}
            Icon={isPlaying ? PauseCircleIcon : PlayCircleIcon}
          />
          <ControlButton
            onClick={toggleMute}
            Icon={isMuted ? VolumeOff : Volume2}
          />
          <div className="relative w-full bg-black h-2 rounded-full bg-opacity-50">
            <motion.div
              animate={{ width: `${videoState.progress}%` }}
              transition={{ type: "spring", stiffness: 100 }}
              className="bg-primary pointer-events-none h-full rounded-full shadow absolute top-1/2 -translate-y-1/2 left-0"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AutoPlayVideo;
