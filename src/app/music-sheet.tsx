"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { M3BottomSheet } from "./bottom-sheet";
import type { MusicTrack } from "./config";

function fmt(s: number) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function MusicSheet({
  track,
  open,
  onOpenChange,
  onBack,
}: {
  track: MusicTrack | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onBack?: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);

  /* Reset / autoplay on track change */
  useEffect(() => {
    setPlaying(false);
    setCur(0);
    setDur(0);
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    if (track?.audio && open) {
      a.currentTime = 0;
      a.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  }, [track, open]);

  /* Pause when sheet closes */
  useEffect(() => {
    if (!open) {
      audioRef.current?.pause();
      setPlaying(false);
    }
  }, [open]);

  if (!track) return null;

  const initials = track.title.slice(0, 1).toUpperCase();
  const pct = dur > 0 ? (cur / dur) * 100 : 0;

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !dur) return;
    const r = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    a.currentTime = ratio * dur;
    setCur(a.currentTime);
  };

  return (
    <M3BottomSheet
      open={open}
      onClose={() => onOpenChange(false)}
      className="px-5 pt-2 pb-7"
    >
      {/* Back button */}
      {onBack && (
        <button
          type="button"
          aria-label="back to list"
          onClick={onBack}
          className="absolute top-3 left-3 grid h-8 w-8 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-white/[0.04] hover:text-on-surface"
        >
          <svg
            viewBox="0 0 24 24"
            width={16}
            height={16}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      <div className="flex flex-col items-center gap-4">
        {/* Album art */}
        <div className="relative h-44 w-44 overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-high shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
          {track.cover ? (
            <Image
              src={track.cover}
              alt={`${track.title} cover`}
              fill
              sizes="176px"
              className="object-cover"
            />
          ) : (
            <span className="grid h-full w-full place-items-center font-mono text-[42px] text-on-surface-variant">
              {initials}
            </span>
          )}
        </div>

        {/* Track info */}
        <div className="flex w-full flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <h3 className="name-grad font-mono text-[18px] font-semibold tracking-wide">
              {track.title}
            </h3>
            {track.tag && (
              <span className="m3-chip !text-[9.5px] !py-0 !px-1.5">
                {track.tag}
              </span>
            )}
          </div>
          <p className="mt-0.5 font-mono text-[11px] tracking-[0.18em] text-on-surface-variant">
            {track.artist}
          </p>
        </div>

        {/* Audio player (if audio src is available) */}
        {track.audio ? (
          <>
            <audio
              ref={audioRef}
              src={track.audio}
              preload="metadata"
              onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
              onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)}
              onEnded={() => {
                setPlaying(false);
                setCur(0);
              }}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />

            {/* MD3 progress bar */}
            <div className="flex w-full flex-col gap-1.5 px-1">
              <div className="progress-bar" onClick={seek}>
                <div className="progress-fill" style={{ width: `${pct}%` }} />
                <div className="progress-thumb" style={{ left: `${pct}%` }} />
              </div>
              <div className="flex justify-between font-mono text-[10px] tracking-[0.14em] text-on-surface-variant">
                <span>{fmt(cur)}</span>
                <span>{fmt(dur)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-5">
              {/* Restart */}
              <button
                type="button"
                aria-label="restart"
                onClick={() => {
                  const a = audioRef.current;
                  if (a) {
                    a.currentTime = 0;
                    setCur(0);
                  }
                }}
                className="grid h-9 w-9 place-items-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:text-on-surface"
              >
                <svg
                  viewBox="0 0 24 24"
                  width={14}
                  height={14}
                  fill="currentColor"
                >
                  <path d="M6 6h2v12H6zM9.5 12 20 6v12z" />
                </svg>
              </button>

              {/* Play / Pause — MD3 FAB style */}
              <button
                type="button"
                aria-label={playing ? "pause" : "play"}
                onClick={toggle}
                className="grid h-14 w-14 place-items-center rounded-full bg-primary text-on-primary shadow-lg transition-transform active:scale-95"
              >
                {playing ? (
                  <svg
                    viewBox="0 0 24 24"
                    width={20}
                    height={20}
                    fill="currentColor"
                  >
                    <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    width={22}
                    height={22}
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* External link */}
              <a
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="open external"
                className="grid h-9 w-9 place-items-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:text-on-surface"
              >
                <svg
                  viewBox="0 0 24 24"
                  width={14}
                  height={14}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 4h6v6" />
                  <path d="M20 4 10 14" />
                  <path d="M20 14v6H4V4h6" />
                </svg>
              </a>
            </div>
          </>
        ) : (
          /* No audio — show external link card */
          <a
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-card group relative grid w-full grid-cols-[36px_1fr_auto] items-center gap-3 overflow-hidden px-4 py-3 font-mono text-[13px] text-on-surface"
          >
            <span className="ico-box grid h-9 w-9 place-items-center rounded-lg border border-outline-variant">
              <svg
                viewBox="0 0 24 24"
                width={16}
                height={16}
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="text-left">
              <span className="block text-[12.5px] font-semibold tracking-wide">
                open externally
              </span>
              <span className="block text-[10px] tracking-[0.18em] text-on-surface-variant">
                no preview available
              </span>
            </span>
            <span className="text-on-surface-variant transition-all duration-300 group-hover:translate-x-1 group-hover:text-on-surface">
              ↗
            </span>
          </a>
        )}
      </div>
    </M3BottomSheet>
  );
}
