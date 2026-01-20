'use client'

import { useEffect, useRef, useState } from 'react'
import { upsertPlaybackPosition } from '@/lib/db/progress'
import Script from 'next/script'

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void
        YT: any
    }
}

export function YouTubePlayer({
    videoId,
    lessonId,
    initialPosition = 0
}: {
    videoId: string
    lessonId: string
    initialPosition?: number
}) {
    const playerRef = useRef<any>(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
        // If API is already loaded
        if (window.YT && window.YT.Player) {
            initPlayer()
        } else {
            // Setup callback for when API loads
            window.onYouTubeIframeAPIReady = () => {
                initPlayer()
            }
        }

        return () => {
            playerRef.current?.destroy()
        }
    }, [videoId])

    const initPlayer = () => {
        // Prevent double initialization
        if (playerRef.current) return

        playerRef.current = new window.YT.Player('youtube-player', {
            videoId,
            width: '100%',
            height: '100%',
            playerVars: {
                start: initialPosition,
                autoplay: 0,
                modestbranding: 1,
                rel: 0
            },
            events: {
                onReady: () => setReady(true),
            },
        })
    }

    // Save progress every 10 seconds
    useEffect(() => {
        if (!ready) return

        const interval = setInterval(async () => {
            const currentTime = playerRef.current?.getCurrentTime()
            if (currentTime) {
                await upsertPlaybackPosition(lessonId, currentTime)
            }
        }, 10000)

        return () => clearInterval(interval)
    }, [ready, lessonId])

    return (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
            <Script src="https://www.youtube.com/iframe_api" strategy="afterInteractive" />

            <div id="youtube-player" className="w-full h-full" />

            {!ready && (
                <div className="absolute inset-0 flex items-center justify-center text-white/50">
                    Loading Player...
                </div>
            )}
        </div>
    )
}
