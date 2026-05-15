"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { siteConfig } from "./config";
import type { MusicTrack } from "./config";
import musicGenerated from "./music.generated.json";
import { MusicSheet } from "./music-sheet";
import { Icons, isIconKey } from "./icons";
import { M3BottomSheet } from "./bottom-sheet";
// Actify components — Card is used for the profile container, Divider
// for separators, Avatar for the profile photo.
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
    return <I />;
  }
  if (isIconKey(icon)) {
    const I = Icons[icon];
    return <I />;
  }
  return <span className="font-mono text-[14px] leading-none">{icon}</span>;
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

  /* Tilt effect */
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
        el.style.transform = `perspective(1200px) rotateX(${(-y * 2).toFixed(2)}deg) rotateY(${(x * 2).toFixed(2)}deg)`;
        raf = 0;
      });
    };
    const onLeave = () => {
      const el = cardRef.current;
      if (el) el.style.transform = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [mounted]);

  return (
    <div className="relative grid min-h-screen place-items-center px-4 py-8">
      {/* Background layers */}
      <div className="fx-grid pointer-events-none fixed inset-0 z-0" />
      <div className="fx-noise pointer-events-none fixed inset-0 z-[1]" />
      <div className="fx-vignette pointer-events-none fixed inset-0 z-[2]" />

      {/*
        MD3 profile card — uses the .card-shell CSS class which applies the
        dark gradient, box-shadow, entrance animation and hover-tilt effect.
        The ref drives the mouse-tilt via requestAnimationFrame.
      */}
      <div
        ref={cardRef}
        className={`card-shell relative z-10 w-full max-w-[480px] px-7 pb-4 text-on-surface backdrop-blur-md ${
          showHeader || profileVisible ? "pt-7" : "pt-4"
        }`}
      >
        {/* inner flex column */}
        <div className="flex flex-col gap-0">
          {/* ── Header bar ── */}
          {showHeader && (
            <header className="flex items-center justify-between pb-3 font-mono text-[11px] tracking-[0.18em] text-[var(--md-sys-color-on-surface-variant)]">
              <div className="flex items-center gap-2 text-[var(--md-sys-color-on-surface-variant)]">
                <span className="pulse-dot h-2 w-2 rounded-full bg-on-surface" />
                <span>online</span>
              </div>
              <div className="flex items-center gap-2">
                <span suppressHydrationWarning>{time}</span>
                <span className="opacity-50">/</span>
                <span>stable</span>
              </div>
            </header>
          )}

          {showHeader && <Divider />}

          {/* ── Profile section ── */}
          {profileVisible && (
            <section
              className={`flex flex-col items-center text-center ${
                showHeader ? "pt-6" : "pt-2"
              } pb-2`}
            >
              {showAvatar && (
                <div className="relative mb-3 h-24 w-24">
                  <div className="avatar-ring absolute -inset-1.5 rounded-full" />
                  {/* Actify Avatar (simple <img>) inside a styled wrapper */}
                  <div className="relative z-10 h-24 w-24 rounded-full overflow-hidden border border-outline-variant bg-surface-container-low flex items-center justify-center">
                    {c.avatar ? (
                      <Avatar
                        src={c.avatar}
                        alt={c.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-mono text-[28px] text-on-surface-variant">
                        {initials}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {showName && (
                <h1 className="name-grad font-mono text-[22px] font-semibold tracking-wide">
                  {c.name}
                </h1>
              )}

              {showBio && (
                <p className="mt-2 max-w-[38ch] text-[13.5px] leading-relaxed text-on-surface-variant">
                  {c.bio}
                </p>
              )}

              {showTags && (
                <div className="mt-3.5 flex flex-wrap justify-center gap-1.5">
                  {c.tags!.map((t) => (
                    /* MD3 Assist Chip — styled via .m3-chip CSS class */
                    <span key={t} className="m3-chip">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ── Navigation / links ── */}
          <nav className="my-5 flex flex-col gap-2.5">
            {/* Music featured bar */}
            {musicTracks.length > 0 &&
              (() => {
                const featured =
                  musicTracks.find((t) => t.featured) ?? musicTracks[0];
                const trackInitial = featured.title.slice(0, 1).toUpperCase();
                return (
                  <button
                    type="button"
                    onClick={() => setListOpen(true)}
                    className="link-card link-in group relative grid w-full grid-cols-[36px_1fr_auto] items-center gap-3 overflow-hidden px-3 py-2 text-left outline-none focus-visible:ring-2"
                    style={{ animationDelay: "0.05s" }}
                  >
                    <span className="ico-box relative grid h-9 w-9 place-items-center overflow-hidden rounded-lg border border-outline-variant">
                      {featured.cover ? (
                        <Image
                          src={featured.cover}
                          alt={`${featured.title} cover`}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="font-mono text-[12px] text-on-surface-variant">
                          {trackInitial}
                        </span>
                      )}
                    </span>
                    <span className="flex min-w-0 flex-col gap-0 text-left">
                      <span className="flex items-center gap-2">
                        <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-on-surface" />
                        <span className="font-mono text-[9.5px] tracking-[0.18em] text-on-surface-variant">
                          {c.musicTitle ?? "now spinning"}
                        </span>
                      </span>
                      <span className="truncate text-[12.5px] font-semibold tracking-wide text-on-surface">
                        {featured.title}
                        <span className="ml-1.5 font-mono text-[10px] font-normal text-on-surface-variant">
                          · {featured.artist}
                        </span>
                      </span>
                    </span>
                    <span className="flex items-center gap-2 text-on-surface-variant">
                      <span className="font-mono text-[10px] tracking-[0.14em]">
                        {musicTracks.length}
                      </span>
                      <span className="transition-all duration-300 group-hover:translate-x-1 group-hover:text-on-surface">
                        →
                      </span>
                    </span>
                  </button>
                );
              })()}

            {musicTracks.length > 0 && (
              <div className="my-1">
                <Divider />
              </div>
            )}

            {/* Social / site links */}
            {c.links.map((l, i) => (
              <a
                key={`${l.url}-${i}`}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-card link-in group relative grid grid-cols-[36px_1fr_auto] items-center gap-3 overflow-hidden px-4 py-3.5 font-mono text-[13.5px] text-on-surface outline-none focus-visible:ring-2"
                style={{ animationDelay: `${0.1 + i * 0.06}s` }}
              >
                <span className="ico-box grid h-9 w-9 place-items-center rounded-lg border border-outline-variant text-on-surface">
                  {renderIcon(l.icon)}
                </span>
                <span className="flex min-w-0 flex-col gap-0.5 text-left">
                  <span className="truncate text-[13.5px] font-semibold tracking-wide text-on-surface">
                    {l.label}
                  </span>
                  {l.sub && (
                    <span className="text-[10.5px] tracking-[0.18em] text-on-surface-variant">
                      {l.sub}
                    </span>
                  )}
                </span>
                <span className="font-mono text-on-surface-variant transition-all duration-300 group-hover:translate-x-1 group-hover:text-on-surface">
                  →
                </span>
              </a>
            ))}
          </nav>

          {/* ── Footer bar ── */}
          {showFooter && (
            <>
              <Divider />
              <footer className="flex items-center pt-3 font-mono text-[10.5px] tracking-[0.18em] text-on-surface-variant">
                <span>[ esc ] to exit</span>
                <span className="flex-1" />
                <span>v1.0 // build.{build}</span>
              </footer>
            </>
          )}
        </div>
      </div>

      {/* ── Music list sheet ── */}
      <M3BottomSheet
        open={listOpen}
        onClose={() => setListOpen(false)}
        className="px-5 pt-2 pb-6"
      >
        <h2 className="name-grad font-mono text-[16px] font-semibold tracking-wide">
          {c.musicTitle ?? "music"}
        </h2>
        <p className="font-mono text-[10.5px] tracking-[0.18em] text-on-surface-variant mb-3">
          {musicTracks.length} track{musicTracks.length === 1 ? "" : "s"}
        </p>

        <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto pr-1">
          {musicTracks.map((t, i) => {
            const ti = t.title.slice(0, 1).toUpperCase();
            return (
              <button
                key={`${t.url}-${i}`}
                type="button"
                onClick={() => {
                  setActiveTrack(t);
                  setListOpen(false);
                  setSheetOpen(true);
                }}
                className="link-card no-lift group relative grid w-full grid-cols-[44px_1fr_auto] items-center gap-3 overflow-hidden px-3 py-2.5 text-left outline-none focus-visible:ring-2"
              >
                <span className="ico-box relative grid h-11 w-11 place-items-center overflow-hidden rounded-lg border border-outline-variant">
                  {t.cover ? (
                    <Image
                      src={t.cover}
                      alt={`${t.title} cover`}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="font-mono text-[14px] text-on-surface-variant">
                      {ti}
                    </span>
                  )}
                  <span className="pointer-events-none absolute inset-0 grid place-items-center bg-black/55 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <svg
                      viewBox="0 0 24 24"
                      width={16}
                      height={16}
                      fill="currentColor"
                      className="text-on-surface"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
                <span className="flex min-w-0 flex-col gap-0.5 text-left">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[13.5px] font-semibold tracking-wide text-on-surface">
                      {t.title}
                    </span>
                    {t.tag && (
                      <span className="m3-chip !text-[9.5px] !py-0 !px-1.5">
                        {t.tag}
                      </span>
                    )}
                  </span>
                  <span className="truncate font-mono text-[10.5px] tracking-[0.14em] text-on-surface-variant">
                    {t.artist}
                  </span>
                </span>
                <span className="font-mono text-on-surface-variant transition-all duration-300 group-hover:translate-x-1 group-hover:text-on-surface">
                  ▶
                </span>
              </button>
            );
          })}
        </div>
      </M3BottomSheet>

      {/* ── Music player sheet ── */}
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
