"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { siteConfig, type MusicTrack } from "./config";
import musicGenerated from "./music.generated.json";
import { Icons, isIconKey } from "./icons";
import { MusicSheet } from "./music-sheet";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function getTime() {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function renderIcon(icon?: string) {
  if (icon && isIconKey(icon)) {
    const Icon = Icons[icon];
    return <Icon aria-hidden="true" />;
  }

  if (icon) return <span className="fallback-icon">{icon}</span>;
  const Icon = Icons.link;
  return <Icon aria-hidden="true" />;
}

export default function Page() {
  const config = siteConfig;
  const [time, setTime] = useState("--:--:--");
  const [activeTrack, setActiveTrack] = useState<MusicTrack | null>(null);
  const [trackListOpen, setTrackListOpen] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);

  const tracks = useMemo<MusicTrack[]>(
    () => [
      ...((musicGenerated as { tracks?: MusicTrack[] }).tracks ?? []),
      ...(config.music ?? []),
    ],
    [config.music],
  );

  useEffect(() => {
    const interval = window.setInterval(() => setTime(getTime()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const featured = tracks.find((track) => track.featured) ?? tracks[0];
  const handle = config.name.replace(/^@/, "");
  const initials = (config.initials || handle.slice(0, 3) || "???").toUpperCase();

  return (
    <main className="index-page">
      <div className="index-frame">
        {config.showHeader !== false && (
          <header className="masthead">
            <a className="wordmark" href="#top" aria-label="Back to top">
              mini/web<span>®</span>
            </a>
            <p className="masthead-note">personal index · kyiv / internet</p>
            <div className="live-clock">
              <span className="live-dot" aria-hidden="true" />
              <span>online</span>
              <time suppressHydrationWarning>{time}</time>
            </div>
          </header>
        )}

        <section className="identity" id="top" aria-labelledby="page-title">
          <div className="identity-copy">
            <p className="section-kicker">01 / identity</p>
            {config.showProfile !== false && config.showName !== false && (
              <h1 id="page-title" className="display-name">
                <span>@</span>{handle}
              </h1>
            )}
            {config.showProfile !== false && config.showBio !== false && config.bio && (
              <div className="bio-row">
                <span className="bio-mark">↳</span>
                <p>{config.bio}</p>
              </div>
            )}
          </div>

          {config.showProfile !== false && config.showAvatar !== false && (
            <figure className="portrait">
              <div className="portrait-image">
                {config.avatar ? (
                  <Image
                    src={config.avatar}
                    alt={config.name}
                    fill
                    priority
                    sizes="(max-width: 760px) 100vw, 38vw"
                    className="portrait-photo"
                  />
                ) : (
                  <span className="portrait-initials">{initials}</span>
                )}
              </div>
              <figcaption>
                <span>FIG. 001</span>
                <span>DO NOT ADJUST</span>
              </figcaption>
              <span className="portrait-stamp" aria-hidden="true">D/25</span>
            </figure>
          )}
        </section>

        <div className="content-grid">
          <section className="links-panel" aria-labelledby="links-title">
            <div className="section-head">
              <p className="section-kicker">02 / departures</p>
              <h2 id="links-title">Elsewhere</h2>
              <span>{String(config.links.length).padStart(2, "0")} links</span>
            </div>
            <nav className="link-list" aria-label="Social links">
              {config.links.map((link, index) => (
                <a
                  key={`${link.url}-${index}`}
                  className="index-link"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="link-number">{pad(index + 1)}</span>
                  <span className="link-icon">{renderIcon(link.icon)}</span>
                  <span className="link-title">{link.label}</span>
                  <span className="link-address">{link.sub || new URL(link.url).hostname}</span>
                  <span className="link-arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </nav>
          </section>

          <aside className="side-panel">
            <section className="sound-block" aria-labelledby="sound-title">
              <div className="side-title">
                <p className="section-kicker">03 / sound</p>
                <span className="sound-bars" aria-hidden="true"><i /><i /><i /><i /></span>
              </div>
              <h2 id="sound-title">On rotation</h2>
              {featured ? (
                <button className="featured-track" type="button" onClick={() => setTrackListOpen(true)}>
                  <span className="record-cover">
                    {featured.cover ? (
                      <Image src={featured.cover} alt="" fill sizes="112px" className="cover-image" />
                    ) : (
                      <span>{featured.title.slice(0, 1).toUpperCase()}</span>
                    )}
                  </span>
                  <span className="track-copy">
                    <strong>{featured.title}</strong>
                    <span>{featured.artist}</span>
                    <small>{tracks.length} track{tracks.length === 1 ? "" : "s"} in the crate</small>
                  </span>
                  <span className="play-mark" aria-hidden="true">▶</span>
                </button>
              ) : (
                <p className="empty-state">silence, for now.</p>
              )}
            </section>

            <section className="webring-block" aria-labelledby="webring-title">
              <div className="side-title">
                <p className="section-kicker">04 / neighborhood</p>
                <span>www</span>
              </div>
              <h2 id="webring-title">Keep the web weird.</h2>
              <iframe
                src="https://dw.dexx.moe/widget?f=auto"
                title="DWing webring"
                loading="lazy"
              />
            </section>
          </aside>
        </div>

        <footer className="index-footer">
          <p>Built by hand. Best viewed with curiosity.</p>
          <p>© {new Date().getFullYear()} {config.name}</p>
          <a href="#top">top ↑</a>
        </footer>
      </div>

      <Sheet open={trackListOpen} onOpenChange={setTrackListOpen}>
        <SheetContent side="bottom" className="track-sheet">
          <div className="sheet-rule" />
          <div className="sheet-heading">
            <div>
              <SheetDescription>mini/web audio dept.</SheetDescription>
              <SheetTitle>{config.musicTitle ?? "On rotation"}</SheetTitle>
            </div>
            <span>{pad(tracks.length)} selections</span>
          </div>
          <div className="track-list">
            {tracks.map((track, index) => (
              <button
                key={`${track.url}-${index}`}
                type="button"
                className="track-row"
                onClick={() => {
                  setActiveTrack(track);
                  setTrackListOpen(false);
                  setPlayerOpen(true);
                }}
              >
                <span>{pad(index + 1)}</span>
                <strong>{track.title}</strong>
                <small>{track.artist}</small>
                <i>▶</i>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      <MusicSheet
        track={activeTrack}
        open={playerOpen}
        onOpenChange={setPlayerOpen}
        onBack={tracks.length > 1 ? () => {
          setPlayerOpen(false);
          setTrackListOpen(true);
        } : undefined}
      />
    </main>
  );
}
