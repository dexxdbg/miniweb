"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { pad } from "@/lib/utils";
import type { MusicTrack } from "./config";

function fmt(s: number) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${pad(r)}`;
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

  // reset / autoplay on track change
  useEffect(() => {
    setPlaying(false);
    setCur(0);
    setDur(0);
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    if (track?.audio && open) {
      a.currentTime = 0;
      // try autoplay; ignore errors (browser policy)
      a.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  }, [track, open]);

  // pause when sheet closes
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="border-[var(--color-line)] bg-[var(--color-panel)] px-5 pt-6 pb-7 text-foreground sm:mx-auto sm:max-w-[480px] sm:rounded-t-[18px]"
      >
        {/* drag handle */}
        <div className="mx-auto -mt-2 mb-3 h-1 w-10 rounded-full bg-[var(--color-line-2)]" />

        {onBack && (
          <button
            type="button"
            aria-label="back to list"
            onClick={onBack}
            className="absolute top-3 left-3 grid h-8 w-8 place-items-center rounded-full text-[var(--color-ink-dim)] transition-colors hover:bg-white/[0.04] hover:text-foreground"
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
          <div className="relative h-44 w-44 overflow-hidden rounded-2xl border border-[var(--color-line-2)] bg-gradient-to-b from-[#1c1c1c] to-[#0e0e0e] shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
            {track.cover ? (
              <Image
                src={track.cover}
                alt={`${track.title} cover`}
                fill
                sizes="176px"
                className="object-cover"
              />
            ) : (
              <span className="grid h-full w-full place-items-center font-mono text-[42px] text-[var(--color-ink-dim)]">
                {initials}
              </span>
            )}
          </div>

          <div className="flex w-full flex-col items-center text-center">
            <div className="flex items-center gap-2">
              <SheetTitle className="name-grad font-mono text-[18px] font-semibold tracking-wide">
                {track.title}
              </SheetTitle>
              {track.tag && (
                <Badge
                  variant="outline"
                  className="rounded-full border-[var(--color-line-2)] bg-white/[0.02] px-1.5 py-0 font-mono text-[9.5px] font-normal tracking-[0.14em] text-[var(--color-ink-dim)]"
                >
                  {track.tag}
                </Badge>
              )}
            </div>
            <SheetDescription className="mt-0.5 font-mono text-[11px] tracking-[0.18em] text-[var(--color-ink-mute)]">
              {track.artist}
            </SheetDescription>
          </div>

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

              <div className="flex w-full flex-col gap-1.5 px-1">
                <div
                  onClick={seek}
                  className="group/bar relative h-1.5 cursor-pointer rounded-full bg-[var(--color-line-2)]"
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-foreground"
                    style={{ width: `${pct}%` }}
                  />
                  <div
                    className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground opacity-0 transition-opacity group-hover/bar:opacity-100"
                    style={{ left: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between font-mono text-[10px] tracking-[0.14em] text-[var(--color-ink-mute)]">
                  <span>{fmt(cur)}</span>
                  <span>{fmt(dur)}</span>
                </div>
              </div>

              <div className="flex items-center gap-5">
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
                  className="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-line-2)] text-[var(--color-ink-dim)] transition-colors hover:text-foreground"
                >
                  <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor">
                    <path d="M6 6h2v12H6zM9.5 12 20 6v12z" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label={playing ? "pause" : "play"}
                  onClick={toggle}
                  className="grid h-14 w-14 place-items-center rounded-full bg-foreground text-background shadow-lg transition-transform active:scale-95"
                >
                  {playing ? (
                    <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor">
                      <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
                <a
                  href={track.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="open external"
                  className="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-line-2)] text-[var(--color-ink-dim)] transition-colors hover:text-foreground"
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
            <a
              href={track.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-card group relative grid w-full grid-cols-[36px_1fr_auto] items-center gap-3 overflow-hidden rounded-xl border border-[var(--color-line)] px-4 py-3 font-mono text-[13px] text-foreground"
            >
              <span className="ico-box grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-line-2)]">
                <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="text-left">
                <span className="block text-[12.5px] font-semibold tracking-wide">
                  open externally
                </span>
                <span className="block text-[10px] tracking-[0.18em] text-[var(--color-ink-mute)]">
                  no preview available
                </span>
              </span>
              <span className="text-[var(--color-ink-mute)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-foreground">
                ↗
              </span>
            </a>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
