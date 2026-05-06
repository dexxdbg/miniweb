"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { siteConfig } from "./config";
import { Icons, isIconKey } from "./icons";

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
  return (
    <span className="font-mono text-[14px] leading-none">{icon}</span>
  );
}

export default function Page() {
  const cardRef = useRef<HTMLElement>(null);
  const [time, setTime] = useState("--:--:--");
  const [mounted, setMounted] = useState(false);

  const c = siteConfig;
  const initials = (
    c.initials ||
    c.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2) ||
    "?"
  ).toUpperCase();
  const build = buildHash(c.name);

  // visibility flags (default true)
  const showHeader = c.showHeader !== false;
  const showFooter = c.showFooter !== false;
  const showProfile = c.showProfile !== false;
  const showAvatar = showProfile && c.showAvatar !== false;
  const showName = showProfile && c.showName !== false;
  const showBio = showProfile && c.showBio !== false && !!c.bio;
  const showTags =
    showProfile && c.showTags !== false && !!c.tags && c.tags.length > 0;
  const profileVisible = showAvatar || showName || showBio || showTags;

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

  // parallax tilt
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
      {/* background fx */}
      <div className="fx-grid pointer-events-none fixed inset-0 z-0" />
      <div className="fx-noise pointer-events-none fixed inset-0 z-[1]" />
      <div className="fx-vignette pointer-events-none fixed inset-0 z-[2]" />

      <main
        ref={cardRef}
        className={`card-shell relative z-10 w-full max-w-[480px] rounded-[18px] border border-[var(--color-line)] px-7 pb-4 backdrop-blur-md ${
          showHeader || profileVisible ? "pt-7" : "pt-4"
        }`}
      >
        {/* header */}
        {showHeader && (
          <header className="flex items-center justify-between border-b border-dashed border-[var(--color-line)] pb-3 font-mono text-[11px] tracking-[0.18em] text-[var(--color-ink-mute)]">
            <div className="flex items-center gap-2 text-[var(--color-ink-dim)]">
              <span className="pulse-dot h-2 w-2 rounded-full bg-white" />
              <span>online</span>
            </div>
            <div className="flex items-center gap-2">
              <span suppressHydrationWarning>{time}</span>
              <span className="opacity-50">/</span>
              <span>sys.ok</span>
            </div>
          </header>
        )}

        {/* profile */}
        {profileVisible && (
          <section
            className={`flex flex-col items-center text-center ${
              showHeader ? "pt-6" : "pt-2"
            } pb-2`}
          >
            {showAvatar && (
              <div className="relative mb-3 h-24 w-24">
                <div className="avatar-ring absolute -inset-1.5 rounded-full" />
                <div className="relative z-10 grid h-full w-full place-items-center overflow-hidden rounded-full border border-[var(--color-line-2)] bg-gradient-to-b from-[#1c1c1c] to-[#0e0e0e] font-mono text-[28px] text-[var(--color-ink-dim)]">
                  {c.avatar ? (
                    <Image
                      src={c.avatar}
                      alt={c.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <span>{initials}</span>
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
              <p className="mt-2 max-w-[38ch] text-[13.5px] leading-relaxed text-[var(--color-ink-dim)]">
                {c.bio}
              </p>
            )}

            {showTags && (
              <div className="mt-3.5 flex flex-wrap justify-center gap-1.5">
                {c.tags!.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[var(--color-line-2)] bg-white/[0.02] px-2 py-1 font-mono text-[10.5px] tracking-[0.14em] text-[var(--color-ink-dim)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}

        {/* links */}
        <nav className="my-5 flex flex-col gap-2.5">
          {c.links.map((l, i) => (
            <a
              key={`${l.url}-${i}`}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-card link-in group relative grid grid-cols-[36px_1fr_auto] items-center gap-3 overflow-hidden rounded-xl border border-[var(--color-line)] px-4 py-3.5 font-mono text-[13.5px] text-[var(--color-ink)]"
              style={{ animationDelay: `${0.1 + i * 0.06}s` }}
            >
              <span className="ico-box grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-line-2)] text-white">
                {renderIcon(l.icon)}
              </span>
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-[13.5px] font-semibold tracking-wide text-white">
                  {l.label}
                </span>
                {l.sub && (
                  <span className="text-[10.5px] tracking-[0.18em] text-[var(--color-ink-mute)]">
                    {l.sub}
                  </span>
                )}
              </span>
              <span className="font-mono text-[var(--color-ink-mute)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">
                →
              </span>
            </a>
          ))}
        </nav>

        {/* footer */}
        {showFooter && (
          <footer className="flex items-center border-t border-dashed border-[var(--color-line)] pt-3 font-mono text-[10.5px] tracking-[0.18em] text-[var(--color-ink-mute)]">
            <span>[ esc ] to exit</span>
            <span className="flex-1" />
            <span>v1.0 // build.{build}</span>
          </footer>
        )}
      </main>
    </div>
  );
}
