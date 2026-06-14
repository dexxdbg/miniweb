/**
 * config.ts — edit this to customize your page.
 */
import type { ReactNode } from "react";
import { Icons, type IconKey } from "./icons";

export type SiteLink = {
  label: string;
  sub?: string;
  url: string;
  /** built-in icon key, or any string/emoji to render as text */
  icon?: IconKey | string;
};

export type MusicTrack = {
  title: string;
  artist: string;
  /** cover image URL (square works best) */
  cover?: string;
  /** link out — Spotify / YouTube / Bandcamp / etc */
  url: string;
  /** small badge text, e.g. "now playing", "ep", "single" */
  tag?: string;
  /** local or remote audio file for in-page playback (e.g. "/audio/song.mp3") */
  audio?: string;
  /** mark as featured — shown in the collapsed bar */
  featured?: boolean;
};

export type SiteConfig = {
  name: string;
  bio?: string;
  /** image URL — leave empty to show initials fallback */
  avatar?: string;
  initials?: string;
  tags?: string[];
  links: SiteLink[];
  /** optional music showcase shown above links */
  music?: MusicTrack[];
  /** section heading */
  musicTitle?: string;
  /** Master toggle — hide the entire profile section (avatar, name, bio, tags) */
  showProfile?: boolean;
  /** Granular toggles (only applied when showProfile !== false) */
  showAvatar?: boolean;
  showName?: boolean;
  showBio?: boolean;
  showTags?: boolean;
  /** Hide the top status / clock bar */
  showHeader?: boolean;
  /** Hide the bottom build / footer bar */
  showFooter?: boolean;
};

export const siteConfig: SiteConfig = {
  name: "@dexxdbg",
  bio: "why would u ddo this?//",
  avatar: "/wrong.jpg", // e.g. "/me.jpg" or "https://..."
  initials: "dgb",
  tags: ["designer", "dev"],
  // === visibility toggles ===
  // set showProfile: false for a links-only page
  showProfile: true,
  showAvatar: true,
  showName: true,
  showBio: true,
  showTags: false,
  showHeader: true,
  showFooter: false,
  musicTitle: "now spinning",
  // Tracks come from src/app/music.list.ts → run `npm run music:sync`
  // You can still hardcode entries here; they merge after the generated ones.
  music: [],
  links: [
    { label: "Git", sub: "git.dexx.moe", url: "https://git.dexx.moe/dexx", icon: "git" },
    { label: "Twitter / X", sub: "@dexxdbg", url: "https://x.com/dexxdbg", icon: "x" },
    //{ label: "Instagram", sub: "@you", url: "https://instagram.com/", icon: "instagram" },
    { label: "YouTube", sub: "empty", url: "https://youtube.com/@dexxdbg", icon: "youtube" },
    //{ label: "Discord", sub: "join the server", url: "https://discord.gg/", icon: "discord" },
    //{ label: "Email", sub: "say hi", url: "mailto:hi@example.com", icon: "mail" },
    //{ label: "Website", sub: "example.com", url: "https://example.com", icon: "globe" },
  ],
};

// re-export for convenience
export { Icons };
export type { ReactNode };
