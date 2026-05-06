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

export type SiteConfig = {
  name: string;
  bio?: string;
  /** image URL — leave empty to show initials fallback */
  avatar?: string;
  initials?: string;
  tags?: string[];
  links: SiteLink[];
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
  avatar: "", // e.g. "/me.jpg" or "https://..."
  initials: "dgb",
  tags: ["designer", "dev"],
  // === visibility toggles ===
  // set showProfile: false for a links-only page
  showProfile: true,
  showAvatar: true,
  showName: false,
  showBio: false,
  showTags: false,
  showHeader: false,
  showFooter: false,
  links: [
    { label: "GitHub", sub: "github.com/you", url: "https://github.com/", icon: "github" },
    { label: "Twitter / X", sub: "@you", url: "https://twitter.com/", icon: "x" },
    { label: "Instagram", sub: "@you", url: "https://instagram.com/", icon: "instagram" },
    { label: "YouTube", sub: "subscribe", url: "https://youtube.com/", icon: "youtube" },
    { label: "Discord", sub: "join the server", url: "https://discord.gg/", icon: "discord" },
    { label: "Email", sub: "say hi", url: "mailto:hi@example.com", icon: "mail" },
    { label: "Website", sub: "example.com", url: "https://example.com", icon: "globe" },
    { label: "Kemono", sub: "kemono.cr", url: "https://kemono.cr/", icon: "kemono" },
  ],
};

// re-export for convenience
export { Icons };
export type { ReactNode };
