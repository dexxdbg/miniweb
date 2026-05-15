"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { siteConfig } from "./config";
import type { MusicTrack } from "./config";
import musicGenerated from "./music.generated.json";
import { MusicSheet } from "./music-sheet";
import { Icons, isIconKey } from "./icons";
import { M3BottomSheet } from "./bottom-sheet";
import { Divider } from "actify";
import { Avatar } from "actify";

/* ─── helpers ─── */
function pad(n: number) {
  return String(n).padStart(2, "0");
}
function buildHash(s: string) {
  return Math.abs([...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 999)
    .toString()
    .padStart(3, "0");
}
function renderIcon(icon?: string) {
  if (!icon) {
    const I = Icons.link;
    return <I width={18} height={18} />;
  }
  if (isIconKey(icon)) {
    const I = Icons[icon];
    return <I width={18} height={18} />;
  }
  return <span className="text-[15px] leading-none">{icon}</span>;
}

/** Material Design 3 chevron-right icon */
function ChevronRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="currentColor"
      aria-hidden
    >
      <path d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  );
}

/* ─── Page ─── */
export default function Page() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("--:--:--");
  const [mounted, setMounted] = useState(false);
  const [activeTrack, setActiveTrack] = useState<MusicTrack | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  const c = siteConfig;
  const musicTracks: MusicTrack[] = [
    ...((musicGenerated as { tracks: MusicTrack[] }).tracks ?? []),
    ...(c.music ?? []),
  ];

  const initials = (
    c.initials ||
    c.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2) ||
    "?"
  ).toUpperCase();
  const build = buildHash(c.name);

  const showHeader = c.showHeader !== false;
  const showFooter = c.showFooter !== false;
  const showProfile = c.showProfile !== false;
  const showAvatar = showProfile && c.showAvatar !== false;
  const showName = showProfile && c.showName !== false;
  const showBio = showProfile && c.showBio !== false && !!c.bio;
  const showTags =
    showProfile && c.showTags !== false && !!c.tags && c.tags.length > 0;
  const profileVisible = showAvatar || showName || showBio || showTags;

  /* Clock */
  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const d = new Date();
      setTime(
        `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* Subtle perspective tilt following the cursor */
  useEffect(() => {
    if (!mounted) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const el = cardRef.current;
        if (!el) {
          raf = 0;
          return;
        }
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / r.width;
        const y = (e.clientY - r.top - r.height / 2) / r.height;
        // Keep tilt subtle — max ±1.5 deg for M3 feel
        el.style.transform = `perspective(1400px) rotateX(${(-y * 1.5).toFixed(2)}deg) rotateY(${(x * 1.5).toFixed(2)}deg)`;
        raf = 0;
      });
    };
    const onLeave = () => {
      if (cardRef.current) cardRef.current.style.transform = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [mounted]);

  return (
    /* Page — M3 background with subtle primary-tinted radial at top */
    <div className="m3-page-bg flex flex-col items-center justify-center px-4 py-12">
      {/* ══ Profile card ══════════════════════════════════════════════════════ */}
      <div
        ref={cardRef}
        className="m3-profile-card w-full max-w-[432px] px-6 pb-6 pt-5"
      >
        {/* ── Status bar ───────────────────────────────────────────────────── */}
        {showHeader && (
          <>
            <div className="flex items-center justify-between mb-4">
              {/* Online indicator */}
              <div className="flex items-center gap-2">
                <span
                  className="m3-pulse h-[9px] w-[9px] rounded-full flex-shrink-0"
                  style={{ background: "var(--md-sys-color-tertiary)" }}
                />
                <span
                  className="text-[11px] font-medium tracking-[0.1em] uppercase"
                  style={{ color: "var(--md-sys-color-on-surface-variant)" }}
                >
                  online
                </span>
              </div>
              {/* Live clock */}
              <span
                className="font-mono text-[11px]"
                style={{ color: "var(--md-sys-color-on-surface-variant)" }}
                suppressHydrationWarning
              >
                {time}
              </span>
            </div>
            <Divider />
          </>
        )}

        {/* ── Profile section ──────────────────────────────────────────────── */}
        {profileVisible && (
          <section
            className={`flex flex-col items-center text-center ${showHeader ? "pt-5" : "pt-2"} pb-4`}
          >
            {/* Avatar with primary-coloured ring */}
            {showAvatar && (
              <div
                className="mb-4 rounded-full p-[2.5px]"
                style={{ background: "var(--md-sys-color-primary)" }}
              >
                <div
                  className="h-[83px] w-[83px] rounded-full overflow-hidden flex items-center justify-center"
                  style={{
                    background: "var(--md-sys-color-surface-container)",
                  }}
                >
                  {c.avatar ? (
                    <Avatar
                      src={c.avatar}
                      alt={c.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span
                      className="text-[30px] font-medium select-none"
                      style={{
                        color: "var(--md-sys-color-on-primary-container)",
                      }}
                    >
                      {initials}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Name — Headline Medium */}
            {showName && (
              <h1
                className="text-[26px] font-light tracking-tight leading-tight"
                style={{ color: "var(--md-sys-color-on-surface)" }}
              >
                {c.name}
              </h1>
            )}

            {/* Bio — Body Medium */}
            {showBio && (
              <p
                className="mt-1.5 text-[14px] leading-[1.43] max-w-[34ch]"
                style={{ color: "var(--md-sys-color-on-surface-variant)" }}
              >
                {c.bio}
              </p>
            )}

            {/* Tags — MD3 Assist Chips */}
            {showTags && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {c.tags!.map((t) => (
                  <span key={t} className="m3-chip">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Navigation ───────────────────────────────────────────────────── */}
        <nav className="flex flex-col gap-2.5 mt-1">
          {/* Now-Playing bar — secondary-container */}
          {musicTracks.length > 0 &&
            (() => {
              const featured =
                musicTracks.find((t) => t.featured) ?? musicTracks[0];
              return (
                <>
                  <button
                    type="button"
                    onClick={() => setListOpen(true)}
                    className="m3-now-playing link-in w-full flex items-center gap-3 px-4 py-3"
                    style={{ animationDelay: "0.05s" }}
                  >
                    {/* Album art / placeholder */}
                    <div
                      className="relative h-10 w-10 rounded-[10px] overflow-hidden flex-shrink-0 flex items-center justify-center"
                      style={{
                        background:
                          "var(--md-sys-color-surface-container-highest)",
                      }}
                    >
                      {featured.cover ? (
                        <Image
                          src={featured.cover}
                          alt={featured.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <span
                          className="text-[13px] font-medium"
                          style={{
                            color: "var(--md-sys-color-on-secondary-container)",
                          }}
                        >
                          {featured.title[0].toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Track info */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className="m3-pulse h-[7px] w-[7px] rounded-full flex-shrink-0"
                          style={{
                            background: "var(--md-sys-color-secondary)",
                          }}
                        />
                        <span
                          className="text-[10px] font-medium tracking-[0.12em] uppercase"
                          style={{ color: "var(--md-sys-color-secondary)" }}
                        >
                          {c.musicTitle ?? "now playing"}
                        </span>
                      </div>
                      <div
                        className="text-[14px] font-medium leading-tight truncate"
                        style={{
                          color: "var(--md-sys-color-on-secondary-container)",
                        }}
                      >
                        {featured.title}
                      </div>
                      <div
                        className="text-[12px] truncate mt-0.5"
                        style={{
                          color: "var(--md-sys-color-on-secondary-container)",
                          opacity: 0.75,
                        }}
                      >
                        {featured.artist}
                      </div>
                    </div>

                    {/* Track count + chevron */}
                    <div
                      className="flex items-center gap-0.5 flex-shrink-0"
                      style={{
                        color: "var(--md-sys-color-on-secondary-container)",
                        opacity: 0.75,
                      }}
                    >
                      <span className="text-[13px] font-medium">
                        {musicTracks.length}
                      </span>
                      <ChevronRight />
                    </div>
                  </button>

                  {/* Actify Divider between music and links */}
                  <div className="my-1">
                    <Divider />
                  </div>
                </>
              );
            })()}

          {/* Link items — surface-container-high cards */}
          {c.links.map((l, i) => (
            <a
              key={`${l.url}-${i}`}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="m3-link-card link-in"
              style={{ animationDelay: `${0.08 + i * 0.05}s` }}
            >
              {/* Primary-container icon box */}
              <span className="m3-link-icon">{renderIcon(l.icon)}</span>

              {/* Labels */}
              <span className="flex min-w-0 flex-1 flex-col">
                <span
                  className="text-[15px] font-medium leading-snug truncate"
                  style={{ color: "var(--md-sys-color-on-surface)" }}
                >
                  {l.label}
                </span>
                {l.sub && (
                  <span
                    className="text-[12px] leading-snug truncate"
                    style={{ color: "var(--md-sys-color-on-surface-variant)" }}
                  >
                    {l.sub}
                  </span>
                )}
              </span>

              {/* Trailing chevron */}
              <span
                className="flex-shrink-0"
                style={{ color: "var(--md-sys-color-on-surface-variant)" }}
              >
                <ChevronRight />
              </span>
            </a>
          ))}
        </nav>

        {/* ── Footer (optional) ────────────────────────────────────────────── */}
        {showFooter && (
          <>
            <div className="my-4">
              <Divider />
            </div>
            <footer
              className="flex items-center justify-between font-mono text-[11px]"
              style={{ color: "var(--md-sys-color-on-surface-variant)" }}
            >
              <span>build.{build}</span>
              <span>v1.0</span>
            </footer>
          </>
        )}
      </div>

      {/* ══ Music list bottom sheet ═══════════════════════════════════════════ */}
      <M3BottomSheet
        open={listOpen}
        onClose={() => setListOpen(false)}
        className="px-4 pt-1 pb-8"
      >
        {/* Sheet header */}
        <div className="px-2 pt-1 pb-3">
          <h2
            className="text-[20px] font-medium leading-tight"
            style={{ color: "var(--md-sys-color-on-surface)" }}
          >
            {c.musicTitle ?? "music"}
          </h2>
          <p
            className="text-[12px] font-medium mt-0.5"
            style={{ color: "var(--md-sys-color-on-surface-variant)" }}
          >
            {musicTracks.length} track{musicTracks.length === 1 ? "" : "s"}
          </p>
        </div>

        {/* Track list */}
        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
          {musicTracks.map((t, i) => (
            <button
              key={`${t.url}-${i}`}
              type="button"
              onClick={() => {
                setActiveTrack(t);
                setListOpen(false);
                setSheetOpen(true);
              }}
              className="m3-track-item"
            >
              {/* Art */}
              <div
                className="relative h-12 w-12 rounded-[10px] overflow-hidden flex-shrink-0 flex items-center justify-center"
                style={{
                  background: "var(--md-sys-color-surface-container-highest)",
                }}
              >
                {t.cover ? (
                  <Image
                    src={t.cover}
                    alt={t.title}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <span
                    className="text-[15px] font-medium"
                    style={{ color: "var(--md-sys-color-on-surface-variant)" }}
                  >
                    {t.title[0].toUpperCase()}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex flex-col">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="text-[14px] font-medium truncate"
                    style={{ color: "var(--md-sys-color-on-surface)" }}
                  >
                    {t.title}
                  </span>
                  {t.tag && (
                    <span className="m3-chip !h-auto !py-0.5 !text-[10px] flex-shrink-0">
                      {t.tag}
                    </span>
                  )}
                </div>
                <span
                  className="text-[12px] truncate"
                  style={{ color: "var(--md-sys-color-on-surface-variant)" }}
                >
                  {t.artist}
                </span>
              </div>

              {/* Play indicator */}
              <span style={{ color: "var(--md-sys-color-on-surface-variant)" }}>
                <svg
                  viewBox="0 0 24 24"
                  width={18}
                  height={18}
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </M3BottomSheet>

      {/* ══ Music player bottom sheet ═════════════════════════════════════════ */}
      <MusicSheet
        track={activeTrack}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onBack={
          musicTracks.length > 1
            ? () => {
                setSheetOpen(false);
                setListOpen(true);
              }
            : undefined
        }
      />
    </div>
  );
}
