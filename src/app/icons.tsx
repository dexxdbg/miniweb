import type { JSX, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  viewBox: "0 0 24 24",
  width: 18,
  height: 18,
  ...props,
});

export const Icons = {
  git: (p: IconProps) => (
    <svg {...base(p)} fill="currentColor">
      <path d="M23.546 10.93L13.067.452a1.55 1.55 0 0 0-2.19 0L8.648 2.683l2.766 2.766a1.842 1.842 0 0 1 2.33 2.35l2.666 2.666a1.842 1.842 0 1 1-1.104 1.04l-2.489-2.489v6.543a1.843 1.843 0 1 1-1.514-.016V9.404a1.843 1.843 0 0 1-1.001-2.42L7.535 4.218 .452 11.3a1.55 1.55 0 0 0 0 2.19l10.479 10.478a1.55 1.55 0 0 0 2.19 0l10.425-10.425a1.55 1.55 0 0 0 0-2.612z" />
    </svg>
  ),
  github: (p: IconProps) => (
    <svg {...base(p)} fill="currentColor">
      <path d="M12 .5C5.7.5.7 5.5.7 11.8c0 5 3.2 9.2 7.7 10.7.6.1.8-.2.8-.6v-2c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.7 1.2 3.4.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.3-5.1-5.6 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-3 0 0 .9-.3 3 1.1.9-.2 1.8-.4 2.8-.4s1.9.1 2.8.4c2.1-1.4 3-1.1 3-1.1.6 1.6.2 2.7.1 3 .7.8 1.1 1.8 1.1 3 0 4.3-2.6 5.2-5.1 5.5.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.5-1.5 7.7-5.7 7.7-10.7C23.3 5.5 18.3.5 12 .5z" />
    </svg>
  ),
  x: (p: IconProps) => (
    <svg {...base(p)} fill="currentColor">
      <path d="M18.244 2H21l-6.49 7.41L22 22h-6.715l-4.69-6.123L4.8 22H2.04l6.94-7.93L2 2h6.84l4.243 5.61L18.244 2zm-1.18 18h1.86L7.05 4H5.06l12.004 16z" />
    </svg>
  ),
  instagram: (p: IconProps) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x={3} y={3} width={18} height={18} rx={5} />
      <circle cx={12} cy={12} r={4} />
      <circle cx={17.5} cy={6.5} r={1} fill="currentColor" />
    </svg>
  ),
  youtube: (p: IconProps) => (
    <svg {...base(p)} fill="currentColor">
      <path d="M23 7.2s-.2-1.6-.9-2.3c-.8-.9-1.7-.9-2.1-1C16.7 3.6 12 3.6 12 3.6s-4.7 0-8 .3c-.4.1-1.3.1-2.1 1C1.2 5.6 1 7.2 1 7.2S.8 9 .8 10.9v1.7C.8 14.5 1 16.3 1 16.3s.2 1.6.9 2.3c.8.9 1.9.9 2.4 1 1.7.2 7.7.3 7.7.3s4.7 0 8-.3c.4-.1 1.3-.1 2.1-1 .7-.7.9-2.3.9-2.3s.2-1.8.2-3.7v-1.7C23.2 9 23 7.2 23 7.2zM9.7 14.6V8.4l6.1 3.1-6.1 3.1z" />
    </svg>
  ),
  discord: (p: IconProps) => (
    <svg {...base(p)} fill="currentColor">
      <path d="M20.3 4.5A18.5 18.5 0 0 0 16 3.2l-.2.3c-1.7-.3-3.4-.3-5.1 0L10.5 3a18.5 18.5 0 0 0-4.3 1.5C3.4 8.5 2.7 12.4 3 16.2a18.6 18.6 0 0 0 5.6 2.8l.4-.6c-.6-.2-1.2-.5-1.8-.9.2-.1.3-.2.5-.3 3.5 1.6 7.3 1.6 10.7 0 .2.1.3.2.5.3-.6.4-1.2.7-1.8.9l.4.6a18.6 18.6 0 0 0 5.6-2.8c.4-4.4-.6-8.3-2.8-11.7zM9.5 14.3c-1.1 0-2-1-2-2.3s.9-2.3 2-2.3 2 1 2 2.3-.9 2.3-2 2.3zm5 0c-1.1 0-2-1-2-2.3s.9-2.3 2-2.3 2 1 2 2.3-.9 2.3-2 2.3z" />
    </svg>
  ),
  mail: (p: IconProps) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x={3} y={5} width={18} height={14} rx={2} />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  globe: (p: IconProps) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <circle cx={12} cy={12} r={9} />
      <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
    </svg>
  ),
  twitch: (p: IconProps) => (
    <svg {...base(p)} fill="currentColor">
      <path d="M4 2 2 6v14h5v3h3l3-3h4l5-5V2H4zm17 11-3 3h-5l-3 3v-3H6V4h15v9zM16 7h-2v6h2V7zm-5 0H9v6h2V7z" />
    </svg>
  ),
  spotify: (p: IconProps) => (
    <svg {...base(p)} fill="currentColor">
      <path d="M12 .5A11.5 11.5 0 1 0 23.5 12 11.5 11.5 0 0 0 12 .5zm5.3 16.6c-.2.3-.6.4-.9.2-2.5-1.5-5.7-1.9-9.4-1-.4.1-.7-.2-.8-.5-.1-.4.2-.7.5-.8 4.1-.9 7.6-.5 10.4 1.2.3.2.4.6.2.9zm1.4-3.1c-.3.4-.7.5-1.1.3-2.9-1.8-7.3-2.3-10.7-1.3-.4.1-.9-.1-1-.6-.1-.4.1-.9.6-1 4-1.2 8.8-.6 12.1 1.5.4.2.5.7.1 1.1zm.1-3.2C15.4 8.6 9.4 8.4 6.2 9.4c-.5.2-1.1-.1-1.3-.7-.2-.5.1-1.1.7-1.3 3.7-1.1 10.4-.9 14.5 1.5.5.3.7 1 .4 1.5-.3.4-1 .6-1.7.4z" />
    </svg>
  ),
  linkedin: (p: IconProps) => (
    <svg {...base(p)} fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1-.02 5.01A2.5 2.5 0 0 1 4.98 3.5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.66 4.78 6.12V21h-4v-5.42c0-1.3-.02-2.97-1.81-2.97-1.82 0-2.1 1.42-2.1 2.88V21h-4z" />
    </svg>
  ),
  telegram: (p: IconProps) => (
    <svg {...base(p)} fill="currentColor">
      <path d="M9.78 15.27 9.6 19c.4 0 .58-.17.79-.37l1.9-1.79 3.93 2.87c.72.4 1.24.19 1.43-.66l2.59-12.13c.25-1.07-.39-1.49-1.09-1.23L3.7 9.93c-1.04.4-1.02 1-.18 1.27l4.27 1.33L17.7 6.34c.47-.31.9-.14.55.18z" />
    </svg>
  ),
  tiktok: (p: IconProps) => (
    <svg {...base(p)} fill="currentColor">
      <path d="M16.5 3a5.5 5.5 0 0 0 4.5 4.5v3.1a8.6 8.6 0 0 1-4.5-1.4v6.6a6.4 6.4 0 1 1-6.4-6.4c.34 0 .67.03 1 .08v3.2a3.3 3.3 0 1 0 2.3 3.13V3h3.1z" />
    </svg>
  ),
  code: (p: IconProps) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  link: (p: IconProps) => (
    <svg {...base(p)} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </svg>
  ),
  rss: (p: IconProps) => (
    <svg {...base(p)} fill="currentColor">
      <path d="M5 4v3a13 13 0 0 1 13 13h3A16 16 0 0 0 5 4zm0 6v3a7 7 0 0 1 7 7h3a10 10 0 0 0-10-10zm1.5 7a2 2 0 1 0 .01 4.01A2 2 0 0 0 6.5 17z" />
    </svg>
  ),
  kemono: (p: IconProps) => (
    <svg {...base(p)} fill="currentColor">
      {/* paw print */}
      <ellipse cx="6" cy="10" rx="1.7" ry="2.3" />
      <ellipse cx="10" cy="6.5" rx="1.7" ry="2.3" />
      <ellipse cx="14" cy="6.5" rx="1.7" ry="2.3" />
      <ellipse cx="18" cy="10" rx="1.7" ry="2.3" />
      <path d="M12 11.5c-3 0-5.5 2.4-5.5 5 0 1.7 1.3 2.7 3 2.7 1.2 0 1.7-.5 2.5-.5s1.3.5 2.5.5c1.7 0 3-1 3-2.7 0-2.6-2.5-5-5.5-5z" />
    </svg>
  ),
} satisfies Record<string, (props: IconProps) => JSX.Element>;

export type IconKey = keyof typeof Icons;

export function isIconKey(v: unknown): v is IconKey {
  return typeof v === "string" && v in Icons;
}
