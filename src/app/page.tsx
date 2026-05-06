"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { siteConfig } from "./config";
import { Icons, isIconKey } from "./icons";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


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
  return <span className="font-mono text-[14px] leading-none">{icon}</span>;
}

export default function Page() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("--:--:--");
  const [mounted, setMounted] = useState(false);

  const c = siteConfig;
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

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const d = new Date();
      setTime(
        `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

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
        el.style.transform = `perspective(1200px) rotateX(${(-y * 2).toFixed(
          2
        )}deg) rotateY(${(x * 2).toFixed(2)}deg)`;
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
      <div className="fx-grid pointer-events-none fixed inset-0 z-0" />
      <div className="fx-noise pointer-events-none fixed inset-0 z-[1]" />
      <div className="fx-vignette pointer-events-none fixed inset-0 z-[2]" />

      <Card
        ref={cardRef}
        className={`card-shell relative z-10 w-full max-w-[480px] gap-0 rounded-[18px] border-[var(--color-line)] bg-transparent px-7 pb-4 text-foreground backdrop-blur-md ${
          showHeader || profileVisible ? "pt-7" : "pt-4"
        }`}
      >
        {showHeader && (
          <header className="flex items-center justify-between pb-3 font-mono text-[11px] tracking-[0.18em] text-[var(--color-ink-mute)]">
            <div className="flex items-center gap-2 text-[var(--color-ink-dim)]">
              <span className="pulse-dot h-2 w-2 rounded-full bg-foreground" />
              <span>online</span>
            </div>
            <div className="flex items-center gap-2">
              <span suppressHydrationWarning>{time}</span>
              <span className="opacity-50">/</span>
              <span>sys.ok</span>
            </div>
          </header>
        )}

        {showHeader && (
          <Separator className="border-dashed bg-transparent border-t border-[var(--color-line)]" />
        )}

        {profileVisible && (
          <section
            className={`flex flex-col items-center text-center ${
              showHeader ? "pt-6" : "pt-2"
            } pb-2`}
          >
            {showAvatar && (
              <div className="relative mb-3 h-24 w-24">
                <div className="avatar-ring absolute -inset-1.5 rounded-full" />
                <Avatar className="relative z-10 h-24 w-24 border border-[var(--color-line-2)] bg-gradient-to-b from-[#1c1c1c] to-[#0e0e0e]">
                  {c.avatar && <AvatarImage src={c.avatar} alt={c.name} />}
                  <AvatarFallback className="bg-transparent font-mono text-[28px] text-[var(--color-ink-dim)]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
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
                  <Badge
                    key={t}
                    variant="outline"
                    className="rounded-full border-[var(--color-line-2)] bg-white/[0.02] px-2 py-1 font-mono text-[10.5px] font-normal tracking-[0.14em] text-[var(--color-ink-dim)]"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            )}
          </section>
        )}

        <nav className="my-5 flex flex-col gap-2.5">
          {c.music && c.music.length > 0 && (
            <section className="link-in mb-1 flex flex-col gap-2">
              <div className="flex items-center justify-between px-1 font-mono text-[10.5px] tracking-[0.18em] text-[var(--color-ink-mute)]">
                <span>{c.musicTitle ?? "music"}</span>
                <span className="flex items-center gap-1.5">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-foreground" />
                  <span>
                    {c.music.length} track{c.music.length === 1 ? "" : "s"}
                  </span>
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {c.music.map((t, i) => {
                  const initials = t.title.slice(0, 1).toUpperCase();
                  return (
                    <a
                      key={`${t.url}-${i}`}
                      href={t.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-card link-in group relative grid grid-cols-[44px_1fr_auto] items-center gap-3 overflow-hidden rounded-xl border border-[var(--color-line)] px-3 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                      style={{ animationDelay: `${0.05 + i * 0.05}s` }}
                    >
                      <span className="ico-box relative grid h-11 w-11 place-items-center overflow-hidden rounded-lg border border-[var(--color-line-2)]">
                        {t.cover ? (
                          <Image
                            src={t.cover}
                            alt={`${t.title} cover`}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="font-mono text-[14px] text-[var(--color-ink-dim)]">
                            {initials}
                          </span>
                        )}
                        <span className="pointer-events-none absolute inset-0 grid place-items-center bg-black/55 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <svg
                            viewBox="0 0 24 24"
                            width={16}
                            height={16}
                            fill="currentColor"
                            className="text-foreground"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </span>
                      <span className="flex min-w-0 flex-col gap-0.5 text-left">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-[13.5px] font-semibold tracking-wide text-foreground">
                            {t.title}
                          </span>
                          {t.tag && (
                            <Badge
                              variant="outline"
                              className="rounded-full border-[var(--color-line-2)] bg-white/[0.02] px-1.5 py-0 font-mono text-[9.5px] font-normal tracking-[0.14em] text-[var(--color-ink-dim)]"
                            >
                              {t.tag}
                            </Badge>
                          )}
                        </span>
                        <span className="truncate font-mono text-[10.5px] tracking-[0.14em] text-[var(--color-ink-mute)]">
                          {t.artist}
                        </span>
                      </span>
                      <span className="font-mono text-[var(--color-ink-mute)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-foreground">
                        ↗
                      </span>
                    </a>
                  );
                })}
              </div>
              <Separator className="mt-1 border-dashed bg-transparent border-t border-[var(--color-line)]" />
            </section>
          )}

          {c.links.map((l, i) => (
            <a
              key={`${l.url}-${i}`}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-card link-in group relative grid grid-cols-[36px_1fr_auto] items-center gap-3 overflow-hidden rounded-xl border border-[var(--color-line)] px-4 py-3.5 font-mono text-[13.5px] text-[var(--color-ink)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50"
              style={{ animationDelay: `${0.1 + i * 0.06}s` }}
            >
              <span className="ico-box grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-line-2)] text-foreground">
                {renderIcon(l.icon)}
              </span>
              <span className="flex min-w-0 flex-col gap-0.5 text-left">
                <span className="truncate text-[13.5px] font-semibold tracking-wide text-foreground">
                  {l.label}
                </span>
                {l.sub && (
                  <span className="text-[10.5px] tracking-[0.18em] text-[var(--color-ink-mute)]">
                    {l.sub}
                  </span>
                )}
              </span>
              <span className="font-mono text-[var(--color-ink-mute)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-foreground">
                →
              </span>
            </a>
          ))}
        </nav>

        {showFooter && (
          <>
            <Separator className="border-dashed bg-transparent border-t border-[var(--color-line)]" />
            <footer className="flex items-center pt-3 font-mono text-[10.5px] tracking-[0.18em] text-[var(--color-ink-mute)]">
              <span>[ esc ] to exit</span>
              <span className="flex-1" />
              <span>v1.0 // build.{build}</span>
            </footer>
          </>
        )}
      </Card>
    </div>
  );
}
