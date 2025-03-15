import { useRef, useState, useEffect } from 'react'

interface UseVideoHoverOptions {
  autoPlay?: boolean
  continuePlayback?: boolean
  reverseOnEnd?: boolean
}

export const useVideoHover = (options: UseVideoHoverOptions = {}) => {
  const {
    autoPlay = false,
    continuePlayback = false,
    reverseOnEnd = false
  } = options

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isReversed, setIsReversed] = useState(false)
  const lastPlaybackRateRef = useRef(1)
  const playAttemptedRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      if (autoPlay && !playAttemptedRef.current) {
        video.play().catch(console.error)
        playAttemptedRef.current = true
      }
    }

    const handleEnded = () => {
      if (reverseOnEnd) {
        setIsReversed(true)
        video.playbackRate = -1
        video.play().catch(console.error)
      } else if (continuePlayback) {
        video.currentTime = 0
        video.play().catch(console.error)
      }
    }

    const handleTimeUpdate = () => {
      if (!video) return

      if (isReversed && video.currentTime <= 0.1) {
        setIsReversed(false)
        video.playbackRate = 1
        if (continuePlayback) {
          video.play().catch(console.error)
        } else {
          video.pause()
        }
      }
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [autoPlay, continuePlayback, reverseOnEnd, isReversed])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isHovering) {
      lastPlaybackRateRef.current = video.playbackRate
      video.play().catch(console.error)
    } else {
      video.pause()
      // Don't reset currentTime to 0 when mouse leaves
      // This allows the video to resume from where it left off when hovered again
    }
  }, [isHovering, continuePlayback])

  return {
    videoRef,
    isHovering,
    setIsHovering,
    isReversed
  }
}