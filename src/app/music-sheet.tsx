"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import type { MusicTrack } from "./config";

function formatTime(seconds: number) {
  const safe = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  return `${Math.floor(safe / 60)}:${Math.floor(safe % 60).toString().padStart(2, "0")}`;
}

export function MusicSheet({
  track,
  open,
  onOpenChange,
  onBack,
}: {
  track: MusicTrack | null;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onBack?: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    audio?.pause();
    const reset = window.setTimeout(() => {
      setPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      if (audio && track?.audio && open) {
        audio.currentTime = 0;
        audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    }, 0);

    return () => window.clearTimeout(reset);
  }, [track, open]);

  if (!track) return null;

  function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else {
      audio.pause();
      setPlaying(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="player-sheet">
        <div className="sheet-rule" />
        <div className="player-grid">
          <div className="player-art">
            {track.cover ? (
              <Image src={track.cover} alt={`${track.title} cover`} fill sizes="240px" className="cover-image" />
            ) : (
              <span>{track.title.slice(0, 1).toUpperCase()}</span>
            )}
            <small>PLAYING / 01</small>
          </div>

          <div className="player-copy">
            <SheetDescription>Now playing</SheetDescription>
            <SheetTitle>{track.title}</SheetTitle>
            <p>{track.artist}</p>
            {track.tag && <span className="track-tag">{track.tag}</span>}

            {track.audio ? (
              <>
                <audio
                  ref={audioRef}
                  src={track.audio}
                  preload="metadata"
                  onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
                  onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                  onEnded={() => {
                    setPlaying(false);
                    setCurrentTime(0);
                  }}
                  onPause={() => setPlaying(false)}
                  onPlay={() => setPlaying(true)}
                />
              </>
            ) : null}
          </div>

          <div className="player-controls">
            {track.audio && (
              <div className="timeline">
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={Math.min(currentTime, duration || 0)}
                  aria-label="Track position"
                  aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                  onChange={(event) => {
                    const audio = audioRef.current;
                    if (!audio) return;
                    const nextTime = Number(event.currentTarget.value);
                    audio.currentTime = nextTime;
                    setCurrentTime(nextTime);
                  }}
                />
                <div><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
              </div>
            )}
            <div className="player-actions">
              {onBack && <button type="button" onClick={onBack}>← list</button>}
              {track.audio ? (
                <button className="primary-play" type="button" onClick={togglePlayback}>{playing ? "pause Ⅱ" : "play ♪"}</button>
              ) : (
                <a className="primary-play" href={track.url} target="_blank" rel="noopener noreferrer">open ↗</a>
              )}
              {track.audio && <a href={track.url} target="_blank" rel="noopener noreferrer">source ↗</a>}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
