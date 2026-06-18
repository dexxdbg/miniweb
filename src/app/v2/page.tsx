"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { siteConfig } from "../config";
import type { MusicTrack } from "../config";
import musicGenerated from "../music.generated.json";
import { Icons, isIconKey } from "../icons";

// Register @material/web components (client-side only)
if (typeof window !== "undefined") {
  import("@material/web/button/filled-button.js");
  import("@material/web/button/outlined-button.js");
  import("@material/web/chips/assist-chip.js");
  import("@material/web/chips/chip-set.js");
  import("@material/web/dialog/dialog.js");
  import("@material/web/list/list.js");
  import("@material/web/list/list-item.js");
  import("@material/web/divider/divider.js");
}


function pad(n: number) {
  return String(n).padStart(2, "0");
}

function buildHash(s: string) {
  return Math.abs(
    [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 999
  )
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
  return <span style={{ fontFamily: "monospace", fontSize: 14 }}>{icon}</span>;
}

export default function PageV2() {
  const [time, setTime] = useState("--:--:--");
  const [mounted, setMounted] = useState(false);
  const [activeTrack, setActiveTrack] = useState<MusicTrack | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [trackOpen, setTrackOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const listDialogRef = useRef<HTMLElement | null>(null);
  const trackDialogRef = useRef<HTMLElement | null>(null);

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
  const showTags = showProfile && c.showTags !== false && !!c.tags && c.tags.length > 0;

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const d = new Date();
      setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Sync md-dialog open state
  useEffect(() => {
    const el = listDialogRef.current as HTMLElement & { show?: () => void; close?: () => void } | null;
    if (!el) return;
    if (listOpen) el.show?.();
    else el.close?.();
  }, [listOpen]);

  useEffect(() => {
    const el = trackDialogRef.current as HTMLElement & { show?: () => void; close?: () => void } | null;
    if (!el) return;
    if (trackOpen) el.show?.();
    else el.close?.();
  }, [trackOpen]);

  // Audio
  useEffect(() => {
    setPlaying(false);
    setCur(0);
    setDur(0);
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    if (activeTrack?.audio && trackOpen) {
      a.currentTime = 0;
      a.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [activeTrack, trackOpen]);

  useEffect(() => {
    if (!trackOpen) {
      audioRef.current?.pause();
      setPlaying(false);
    }
  }, [trackOpen]);

  const toggleAudio = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().then(() => setPlaying(true)).catch(() => {});
    else { a.pause(); setPlaying(false); }
  };

  const fmt = (s: number) => {
    if (!isFinite(s) || s < 0) s = 0;
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  const pct = dur > 0 ? (cur / dur) * 100 : 0;

  const featured = musicTracks.find((t) => t.featured) ?? musicTracks[0];

  if (!mounted) return null;

  return (
    <div className="v2-root">
      {/* background effects */}
      <div className="fx-grid pointer-events-none fixed inset-0 z-0" />
      <div className="fx-noise pointer-events-none fixed inset-0 z-[1]" />
      <div className="fx-vignette pointer-events-none fixed inset-0 z-[2]" />

      <div className="v2-ab-banner">⚗ you're seeing a test version of this site via a/b testing. your activity may be used for testing.</div>

      <main className="v2-card">
        {showHeader && (
          <header className="v2-header">
            <div className="v2-status">
              <span className="pulse-dot" />
              <span>online</span>
            </div>
            <div className="v2-clock">
              <span suppressHydrationWarning>{time}</span>
              <span className="v2-sep">/</span>
              <span>stable</span>
            </div>
          </header>
        )}
        {showHeader && <md-divider />}

        {(showAvatar || showName || showBio || showTags) && (
          <section className="v2-profile">
            {showAvatar && (
              <div className="v2-avatar-wrap">
                <div className="avatar-ring" />
                <div className="v2-avatar">
                  {c.avatar ? (
                    <Image src={c.avatar} alt={c.name} fill sizes="96px" className="object-cover" />
                  ) : (
                    <span className="v2-avatar-initials">{initials}</span>
                  )}
                </div>
              </div>
            )}
            {showName && <h1 className="v2-name name-grad">{c.name}</h1>}
            {showBio && <p className="v2-bio">{c.bio}</p>}
            {showTags && (
              <md-chip-set className="v2-chips">
                {c.tags!.map((t) => (
                  <md-assist-chip key={t} label={t} />
                ))}
              </md-chip-set>
            )}
          </section>
        )}

        <nav className="v2-links">
          {featured && (
            <>
              <button
                type="button"
                className="v2-music-bar link-card link-in"
                onClick={() => setListOpen(true)}
              >
                <span className="v2-music-cover">
                  {featured.cover ? (
                    <Image src={featured.cover} alt={featured.title} fill sizes="36px" className="object-cover" />
                  ) : (
                    <span className="v2-music-initial">{featured.title[0]}</span>
                  )}
                </span>
                <span className="v2-music-meta">
                  <span className="v2-music-label">
                    <span className="pulse-dot small" />
                    <span>{c.musicTitle ?? "now spinning"}</span>
                  </span>
                  <span className="v2-music-title">
                    {featured.title}
                    <span className="v2-music-artist"> · {featured.artist}</span>
                  </span>
                </span>
                <span className="v2-music-count">
                  <span>{musicTracks.length}</span>
                  <span className="v2-arrow">→</span>
                </span>
              </button>
              <md-divider className="v2-link-divider" />
            </>
          )}

          {c.links.map((l, i) => (
            <a
              key={`${l.url}-${i}`}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="v2-link link-card link-in"
              style={{ animationDelay: `${0.1 + i * 0.06}s` }}
            >
              <span className="ico-box v2-ico">{renderIcon(l.icon)}</span>
              <span className="v2-link-text">
                <span className="v2-link-label">{l.label}</span>
                {l.sub && <span className="v2-link-sub">{l.sub}</span>}
              </span>
              <span className="v2-arrow">→</span>
            </a>
          ))}
        </nav>

        {showFooter && (
          <>
            <md-divider />
            <footer className="v2-footer">
              <span>[ esc ] to exit</span>
              <span className="v2-foot-spacer" />
              <span>v2.0 // build.{build}</span>
            </footer>
          </>
        )}
      </main>

      {/* Music list dialog */}
      <md-dialog
        ref={listDialogRef as React.Ref<HTMLElement>}
        className="v2-dialog"
        onClose={() => setListOpen(false)}
      >
        <div slot="headline" className="v2-dialog-headline">{c.musicTitle ?? "music"}</div>
        <div slot="content" className="v2-dialog-content">
          <md-list>
            {musicTracks.map((t, i) => (
              <md-list-item
                key={`${t.url}-${i}`}
                headline={t.title}
                supporting-text={t.artist}
                onClick={() => {
                  setActiveTrack(t);
                  setListOpen(false);
                  setTrackOpen(true);
                }}
                style={{ cursor: "pointer" }}
              />
            ))}
          </md-list>
        </div>
        <div slot="actions">
          <md-outlined-button onClick={() => setListOpen(false)}>close</md-outlined-button>
        </div>
      </md-dialog>

      {/* Track dialog */}
      {activeTrack && (
        <md-dialog
          ref={trackDialogRef as React.Ref<HTMLElement>}
          className="v2-dialog"
          onClose={() => setTrackOpen(false)}
        >
          <div slot="headline" className="v2-dialog-headline">{activeTrack.title}</div>
          <div slot="content" className="v2-track-content">
            <div className="v2-track-cover">
              {activeTrack.cover ? (
                <Image src={activeTrack.cover} alt={activeTrack.title} fill sizes="176px" className="object-cover" />
              ) : (
                <span className="v2-track-initial">{activeTrack.title[0]}</span>
              )}
            </div>
            <p className="v2-track-artist">{activeTrack.artist}</p>

            {activeTrack.audio ? (
              <>
                <audio
                  ref={audioRef}
                  src={activeTrack.audio}
                  preload="metadata"
                  onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
                  onTimeUpdate={(e) => setCur(e.currentTarget.currentTime)}
                  onEnded={() => { setPlaying(false); setCur(0); }}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                />
                <div className="v2-progress" onClick={(e) => {
                  const a = audioRef.current;
                  if (!a || !dur) return;
                  const r = e.currentTarget.getBoundingClientRect();
                  a.currentTime = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * dur;
                }}>
                  <div className="v2-progress-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="v2-progress-times">
                  <span>{fmt(cur)}</span>
                  <span>{fmt(dur)}</span>
                </div>
                <div className="v2-track-controls">
                  <md-outlined-button onClick={toggleAudio}>{playing ? "pause" : "play"}</md-outlined-button>
                  <md-outlined-button onClick={() => window.open(activeTrack.url, "_blank")}>open ↗</md-outlined-button>
                </div>
              </>
            ) : (
              <md-filled-button onClick={() => window.open(activeTrack.url, "_blank")}>
                open externally ↗
              </md-filled-button>
            )}
          </div>
          <div slot="actions">
            {musicTracks.length > 1 && (
              <md-outlined-button onClick={() => { setTrackOpen(false); setListOpen(true); }}>← back</md-outlined-button>
            )}
            <md-outlined-button onClick={() => setTrackOpen(false)}>close</md-outlined-button>
          </div>
        </md-dialog>
      )}

      <style>{`
        .v2-root {
          display: grid;
          min-height: 100svh;
          place-items: center;
          padding: 2rem 1rem;
        }
        .v2-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 480px;
          background: rgba(17,17,17,0.7);
          border: 1px solid var(--color-line);
          border-radius: 18px;
          padding: 1.75rem 1.75rem 1rem;
          backdrop-filter: blur(12px);
          color: var(--color-ink);
        }
        .v2-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.75rem;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.18em;
          color: var(--color-ink-mute);
        }
        .v2-status { display: flex; align-items: center; gap: 0.5rem; color: var(--color-ink-dim); }
        .v2-clock { display: flex; align-items: center; gap: 0.5rem; }
        .v2-sep { opacity: 0.5; }
        .pulse-dot {
          display: inline-block;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--color-ink);
          animation: pulse 2s ease-in-out infinite;
        }
        .pulse-dot.small { width: 6px; height: 6px; }
        @keyframes pulse {
          0%,100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        md-divider { margin: 0; --md-divider-color: var(--color-line); }
        .v2-profile {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 1.5rem 0 0.5rem;
        }
        .v2-avatar-wrap {
          position: relative;
          width: 96px; height: 96px;
          margin-bottom: 0.75rem;
        }
        .avatar-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, var(--color-line-2), var(--color-ink-mute), var(--color-line-2));
          animation: spin 8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .v2-avatar {
          position: relative;
          z-index: 1;
          width: 96px; height: 96px;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid var(--color-line-2);
          background: linear-gradient(to bottom, #1c1c1c, #0e0e0e);
          display: grid;
          place-items: center;
        }
        .v2-avatar-initials {
          font-family: var(--font-mono);
          font-size: 28px;
          color: var(--color-ink-dim);
        }
        .v2-name {
          font-family: var(--font-mono);
          font-size: 22px;
          font-weight: 600;
          letter-spacing: 0.05em;
          margin: 0;
        }
        .v2-bio {
          margin-top: 0.5rem;
          max-width: 38ch;
          font-size: 13.5px;
          line-height: 1.6;
          color: var(--color-ink-dim);
        }
        md-chip-set { margin-top: 0.875rem; justify-content: center; }
        md-assist-chip {
          --md-assist-chip-container-color: rgba(255,255,255,0.02);
          --md-assist-chip-outline-color: var(--color-line-2);
          --md-assist-chip-label-text-color: var(--color-ink-dim);
          --md-assist-chip-label-text-font: var(--font-mono);
          --md-assist-chip-label-text-size: 10.5px;
        }
        .v2-links {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          margin: 1.25rem 0;
        }
        .v2-link-divider { margin: 0.25rem 0; }
        .link-card {
          display: grid;
          grid-template-columns: 36px 1fr auto;
          align-items: center;
          gap: 0.75rem;
          border: 1px solid var(--color-line);
          border-radius: 12px;
          padding: 0.875rem 1rem;
          text-decoration: none;
          color: var(--color-ink);
          background: transparent;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: background 0.15s, border-color 0.15s;
        }
        .link-card:hover { background: rgba(255,255,255,0.025); border-color: var(--color-line-2); }
        .link-in {
          animation: linkIn 0.4s ease both;
        }
        @keyframes linkIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .v2-music-bar { padding: 0.5rem 0.75rem; }
        .v2-music-cover {
          position: relative;
          display: grid;
          place-items: center;
          width: 36px; height: 36px;
          border-radius: 8px;
          border: 1px solid var(--color-line-2);
          overflow: hidden;
          background: #111;
        }
        .v2-music-initial {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--color-ink-dim);
        }
        .v2-music-meta { display: flex; flex-direction: column; min-width: 0; }
        .v2-music-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 9.5px;
          letter-spacing: 0.18em;
          color: var(--color-ink-mute);
        }
        .v2-music-title {
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .v2-music-artist {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 400;
          color: var(--color-ink-mute);
          margin-left: 0.375rem;
        }
        .v2-music-count {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--color-ink-mute);
        }
        .v2-ico {
          display: grid;
          place-items: center;
          width: 36px; height: 36px;
          border-radius: 8px;
          border: 1px solid var(--color-line-2);
          color: var(--color-ink);
        }
        .v2-link-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .v2-link-label {
          font-size: 13.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .v2-link-sub {
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.18em;
          color: var(--color-ink-mute);
        }
        .v2-arrow {
          font-family: var(--font-mono);
          color: var(--color-ink-mute);
          transition: transform 0.2s, color 0.2s;
        }
        .link-card:hover .v2-arrow { transform: translateX(4px); color: var(--color-ink); }
        .v2-footer {
          display: flex;
          align-items: center;
          padding-top: 0.75rem;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.18em;
          color: var(--color-ink-mute);
        }
        .v2-foot-spacer { flex: 1; }
        /* Dialog styles */
        .v2-dialog {
          --md-dialog-container-color: var(--color-panel);
          --md-dialog-headline-color: var(--color-ink);
          --md-dialog-supporting-text-color: var(--color-ink-dim);
          --md-dialog-container-shape: 18px;
          --md-outlined-button-outline-color: var(--color-line-2);
          --md-outlined-button-label-text-color: var(--color-ink-dim);
          min-width: min(480px, 90vw);
        }
        .v2-dialog-headline {
          font-family: var(--font-mono);
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .v2-dialog-content {
          max-height: 60vh;
          overflow-y: auto;
        }
        md-list-item {
          --md-list-item-label-text-color: var(--color-ink);
          --md-list-item-supporting-text-color: var(--color-ink-mute);
          --md-list-item-container-color: transparent;
        }
        .v2-track-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 0;
        }
        .v2-track-cover {
          position: relative;
          width: 176px; height: 176px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--color-line-2);
          background: linear-gradient(to bottom, #1c1c1c, #0e0e0e);
          display: grid;
          place-items: center;
        }
        .v2-track-initial {
          font-family: var(--font-mono);
          font-size: 42px;
          color: var(--color-ink-dim);
        }
        .v2-track-artist {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.18em;
          color: var(--color-ink-mute);
          margin: 0;
        }
        .v2-progress {
          position: relative;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: var(--color-line-2);
          cursor: pointer;
        }
        .v2-progress-fill {
          position: absolute;
          inset-block: 0;
          left: 0;
          border-radius: 3px;
          background: var(--color-ink);
          transition: width 0.1s linear;
        }
        .v2-progress-times {
          display: flex;
          justify-content: space-between;
          width: 100%;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--color-ink-mute);
        }
        .v2-track-controls {
          display: flex;
          gap: 0.75rem;
        }
        md-outlined-button, md-filled-button {
          --md-outlined-button-label-text-font: var(--font-mono);
          --md-filled-button-label-text-font: var(--font-mono);
        }
        .v2-ab-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          padding: 0.5rem 1rem;
          background: rgba(17,17,17,0.85);
          border-top: 1px solid var(--color-line);
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.12em;
          color: var(--color-ink-mute);
          text-align: center;
          backdrop-filter: blur(8px);
        }
      `}</style>
    </div>
  );
}
