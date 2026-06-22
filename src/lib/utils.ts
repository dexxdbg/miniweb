import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { MusicTrack, SiteConfig } from "@/app/config";
import musicGenerated from "@/app/music.generated.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Zero-pad a number to 2 digits. */
export function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Deterministic 3-digit hash derived from a string. */
export function buildHash(s: string): string {
  return Math.abs(
    [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 999
  )
    .toString()
    .padStart(3, "0");
}

/** Derive display initials from config name. */
export function getInitials(c: SiteConfig): string {
  return (
    c.initials ||
    c.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2) ||
    "?"
  ).toUpperCase();
}

/** Merge generated + manual music tracks. */
export function getMusicTracks(c: SiteConfig): MusicTrack[] {
  return [
    ...((musicGenerated as { tracks: MusicTrack[] }).tracks ?? []),
    ...(c.music ?? []),
  ];
}

/** Compute all section-visibility flags from config. */
export function getVisibilityFlags(c: SiteConfig) {
  const showHeader = c.showHeader !== false;
  const showFooter = c.showFooter !== false;
  const showProfile = c.showProfile !== false;
  const showAvatar = showProfile && c.showAvatar !== false;
  const showName = showProfile && c.showName !== false;
  const showBio = showProfile && c.showBio !== false && !!c.bio;
  const showTags =
    showProfile && c.showTags !== false && !!c.tags && c.tags.length > 0;
  const profileVisible = showAvatar || showName || showBio || showTags;
  return { showHeader, showFooter, showProfile, showAvatar, showName, showBio, showTags, profileVisible };
}
