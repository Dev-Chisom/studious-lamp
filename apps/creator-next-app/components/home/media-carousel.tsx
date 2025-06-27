"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MediaItem {
  url: string
  type: "image" | "video"
  id?: string
  name?: string
  file?: File
}

interface MediaCarouselProps {
  mediaItems: MediaItem[]
  currentIndex: number
  isPlaying: boolean
  onUpdateCurrentIndex: (index: number) => void
  onPlay: () => void
  onPause: () => void
  onVideoLoaded?: (event: Event, index: number) => void
}

export default function MediaCarousel({
  mediaItems,
  currentIndex,
  isPlaying,
  onUpdateCurrentIndex,
  onPlay,
  onPause,
  onVideoLoaded,
}: MediaCarouselProps) {
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null)

  const currentMedia = mediaItems[currentIndex]

  const goToPrevious = () => {
    if (currentIndex > 0) {
      onUpdateCurrentIndex(currentIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentIndex < mediaItems.length - 1) {
      onUpdateCurrentIndex(currentIndex + 1)
    }
  }

  const togglePlayPause = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause()
        onPause()
      } else {
        videoRef.play()
        onPlay()
      }
    }
  }

  const handleVideoLoaded = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    if (onVideoLoaded) {
      onVideoLoaded(event.nativeEvent, currentIndex)
    }
  }

  if (!currentMedia) return null

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Navigation Arrows */}
      {mediaItems.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full"
            onClick={goToNext}
            disabled={currentIndex === mediaItems.length - 1}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Media Content */}
      <div className="w-full h-full flex items-center justify-center">
        {currentMedia.type === "image" ? (
          <img
            src={currentMedia.url || "/placeholder.svg"}
            alt={currentMedia.name || "Media"}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="relative">
            <video
              ref={setVideoRef}
              src={currentMedia.url}
              className="max-w-full max-h-full object-contain"
              controls
              onLoadedData={handleVideoLoaded}
              onPlay={onPlay}
              onPause={onPause}
            />

            {/* Custom Play/Pause Button Overlay */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-full w-16 h-16"
              onClick={togglePlayPause}
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </Button>
          </div>
        )}
      </div>

      {/* Media Counter */}
      {mediaItems.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {mediaItems.length}
        </div>
      )}
    </div>
  )
}
