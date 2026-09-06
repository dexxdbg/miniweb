"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { siteConfig, type MusicTrack } from "./config";
import musicGenerated from "./music.generated.json";
import { MusicSheet } from "./music-sheet";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";

export default function Page() {
  const config = siteConfig;
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

  const featured = tracks.find((track) => track.featured) ?? tracks[0];
  const handle = config.name.replace(/^@/, "");
  const initials = (config.initials || handle.slice(0, 2) || "??").toUpperCase();
  const showProfile = config.showProfile !== false;
  const showAvatar = showProfile && config.showAvatar !== false;

  return (
    <main className="site-shell" id="top">
      <div className="site-content">
        {config.showHeader !== false && (
          <header className="site-header">
            <a href="#top" className="site-mark">miniweb</a>
            <span>Ukraine</span>
          </header>
        )}

        {showProfile && (
          <section className="profile" aria-labelledby="page-title">
            {showAvatar && (
              <div className="avatar">
                {config.avatar ? (
                  <Image src={config.avatar} alt="" fill priority sizes="64px" className="avatar-image" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
            )}
            <div className="profile-copy">
              {config.showName !== false && <h1 id="page-title">@{handle}</h1>}
              {config.showBio !== false && config.bio && <p>{config.bio}</p>}
              {config.showTags !== false && config.tags && config.tags.length > 0 && (
                <span className="profile-tags">{config.tags.join(" · ")}</span>
              )}
            </div>
          </section>
        )}

        <nav className="link-list" aria-label="Links">
          {config.links.map((link, index) => (
            <a key={`${link.url}-${index}`} href={link.url} target="_blank" rel="noopener noreferrer" className="link-row">
              <span>{link.label}</span>
              <small>{link.sub || new URL(link.url).hostname}</small>
              <i aria-hidden="true">↗</i>
            </a>
          ))}
        </nav>

        {featured && (
          <button className="listening-row" type="button" onClick={() => setTrackListOpen(true)}>
            <span className="listening-cover">
              {featured.cover ? (
                <Image src={featured.cover} alt="" fill sizes="40px" className="cover-image" />
              ) : (
                featured.title.slice(0, 1).toUpperCase()
              )}
            </span>
            <span className="listening-copy">
              <small>Listening</small>
              <strong>{featured.title}</strong>
              <span>{featured.artist}</span>
            </span>
            <i aria-hidden="true">›</i>
          </button>
        )}

        {config.showFooter !== false && (
          <footer className="site-footer">
            <span>© {new Date().getFullYear()} {config.name}</span>
            <a href="https://dw.dexx.moe" target="_blank" rel="noopener noreferrer">webring ↗</a>
          </footer>
        )}
      </div>

      <Sheet open={trackListOpen} onOpenChange={setTrackListOpen}>
        <SheetContent side="bottom" className="track-sheet">
          <div className="sheet-heading">
            <SheetTitle>{config.musicTitle ?? "Music"}</SheetTitle>
            <SheetDescription>{tracks.length} tracks</SheetDescription>
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
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{track.title}</strong>
                <small>{track.artist}</small>
                <i aria-hidden="true">›</i>
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
