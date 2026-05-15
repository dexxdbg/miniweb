"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { M3BottomSheet } from "./bottom-sheet";
import type { MusicTrack } from "./config";

function fmt(s: number) {
  if (!isFinite(s) || s < 0) s = 0;
  return `${Math.floor(s / 60)}:${Math.floor(s % 60)
    .toString()
    .padStart(2, "0")}`;
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

  useEffect(() => {
    if (!open) {
      audioRef.current?.pause();
      setPlaying(false);
    }
  }, [open]);

  if (!track) return null;

  const initials = track.title[0].toUpperCase();
  const pct = dur > 0 ? (cur / dur) * 100 : 0;

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused)
      a.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    else {
      a.pause();
      setPlaying(false);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !dur) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime =
      Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * dur;
    setCur(a.currentTime);
  };

  return (
    <M3BottomSheet
      open={open}
      onClose={() => onOpenChange(false)}
      className="relative px-6 pt-2 pb-8"
    >
      {/* ── Back button ── */}
      {onBack && (
        <button
          type="button"
          aria-label="back to list"
          onClick={onBack}
          className="absolute top-0 left-4 h-9 w-9 rounded-full flex items-center justify-center transition-colors"
          style={{ color: "var(--md-sys-color-on-surface-variant)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "rgba(202,196,208,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "";
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={18}
            height={18}
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

      <div className="flex flex-col items-center gap-5">
        {/* ── Album art ── */}
        <div
          className="relative h-48 w-48 overflow-hidden flex items-center justify-center flex-shrink-0"
          style={{
            borderRadius: "24px",
            background: "var(--md-sys-color-surface-container-highest)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)",
          }}
        >
          {track.cover ? (
            <Image
              src={track.cover}
              alt={`${track.title} cover`}
              fill
              sizes="192px"
              className="object-cover"
            />
          ) : (
            <span
              className="text-[52px] font-medium select-none"
              style={{ color: "var(--md-sys-color-on-surface-variant)" }}
            >
              {initials}
            </span>
          )}
        </div>

        {/* ── Track info ── */}
        <div className="w-full flex flex-col items-center text-center gap-0.5">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <h3
              className="text-[22px] font-medium leading-snug"
              style={{ color: "var(--md-sys-color-on-surface)" }}
            >
              {track.title}
            </h3>
            {track.tag && (
              <span className="m3-chip !h-auto !py-0.5 !text-[10px]">
                {track.tag}
              </span>
            )}
          </div>
          <p
            className="text-[14px]"
            style={{ color: "var(--md-sys-color-on-surface-variant)" }}
          >
            {track.artist}
          </p>
        </div>

        {/* ── Audio player ── */}
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

            {/* Progress */}
            <div className="w-full flex flex-col gap-1.5">
              <div className="progress-bar" onClick={seek}>
                <div className="progress-fill" style={{ width: `${pct}%` }} />
                <div className="progress-thumb" style={{ left: `${pct}%` }} />
              </div>
              <div
                className="flex justify-between font-mono text-[11px]"
                style={{ color: "var(--md-sys-color-on-surface-variant)" }}
              >
                <span>{fmt(cur)}</span>
                <span>{fmt(dur)}</span>
              </div>
            </div>

            {/* Controls — restart | FAB | external */}
            <div className="flex items-center gap-6">
              {/* Restart — Standard icon button */}
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
                className="h-10 w-10 rounded-full flex items-center justify-center transition-colors"
                style={{ color: "var(--md-sys-color-on-surface-variant)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "rgba(202,196,208,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "";
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width={20}
                  height={20}
                  fill="currentColor"
                >
                  <path d="M6 6h2v12H6zM9.5 12 20 6v12z" />
                </svg>
              </button>

              {/* Play/Pause — MD3 FAB (large) */}
              <button
                type="button"
                aria-label={playing ? "pause" : "play"}
                onClick={toggle}
                className="h-16 w-16 rounded-[18px] flex items-center justify-center shadow-lg transition-transform active:scale-95"
                style={{
                  background: "var(--md-sys-color-primary-container)",
                  color: "var(--md-sys-color-on-primary-container)",
                }}
              >
                {playing ? (
                  <svg
                    viewBox="0 0 24 24"
                    width={26}
                    height={26}
                    fill="currentColor"
                  >
                    <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    width={28}
                    height={28}
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* External link — Standard icon button */}
              <a
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="open in external app"
                className="h-10 w-10 rounded-full flex items-center justify-center transition-colors"
                style={{ color: "var(--md-sys-color-on-surface-variant)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(202,196,208,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "";
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width={18}
                  height={18}
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
          /* No audio — MD3 link card */
          <a
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl"
            style={{
              background: "var(--md-sys-color-secondary-container)",
              color: "var(--md-sys-color-on-secondary-container)",
              textDecoration: "none",
            }}
          >
            <span className="flex-shrink-0">
              <svg
                viewBox="0 0 24 24"
                width={20}
                height={20}
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="flex-1 text-left">
              <span className="block text-[14px] font-medium">
                open externally
              </span>
              <span className="block text-[12px] opacity-75">
                no preview available
              </span>
            </span>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="currentColor">
              <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </a>
        )}
      </div>
    </M3BottomSheet>
  );
}
