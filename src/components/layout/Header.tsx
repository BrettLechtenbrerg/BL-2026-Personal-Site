"use client";

// Site header, "Horizon" design (30 Oct 2026; master ~/dev/pts-style-mockups/HORIZON-D-MASTER.md): fixed, transparent
// over the home hero and frosted once scrolled; solid on every other page (those pages keep their own pt-20 offset).

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { links } from "@/lib/utils";
import { HORIZON_HERO_PATHS } from "@/components/horizon/pages";

type NavLink = { name: string; href: string };
type NavItem = NavLink & { children?: NavLink[] };

const navigation: NavItem[] = [
  {
    name: "The Master's Edge",
    href: "/masters-edge",
    children: [
      { name: "The Methodology", href: "/masters-edge" },
      { name: "12-Week Program", href: "/masters-edge-program" },
    ],
  },
  {
    name: "Speaking",
    href: "/speaking",
    children: [
      { name: "Speaking Overview", href: "/speaking" },
      { name: "Book Brett", href: "/book-brett" },
      { name: "Media Kit", href: "/media-kit" },
    ],
  },
  { name: "Coaching", href: "/coaching" },
  { name: "AI Advisory", href: "/ai-advisory" },
  {
    name: "Books & Media",
    href: "/books",
    children: [
      { name: "All Books", href: "/books" },
      { name: "New: The Master's Edge", href: "/books/masters-edge" },
      { name: "Rockstar Team Quiz", href: "/rockstar-team-quiz" },
    ],
  },
  { name: "Testimonials", href: "/testimonials" },
  { name: "About", href: "/about" },
];

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

function Dropdown({ item, pathname, onNavigate }: { item: NavItem; pathname: string; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const button = useRef<HTMLButtonElement>(null);
  // Hover opens the menu; a click right after that hover must not close it again.
  const hoverOpenedAt = useRef(0);
  const children = item.children ?? [];
  const inSection = children.some((c) => pathname === c.href || pathname.startsWith(`${c.href}/`));

  return (
    <div
      className={`dd${open ? " open" : ""}`}
      onMouseEnter={() => { if (!open) hoverOpenedAt.current = Date.now(); setOpen(true); }}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}
      onKeyDown={(e) => { if (e.key === "Escape" && open) { e.preventDefault(); setOpen(false); button.current?.focus(); } }}
    >
      <button
        ref={button}
        className="nav-link dd-btn"
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-current={inSection ? "page" : undefined}
        onClick={(e) => { if (e.detail > 0 && Date.now() - hoverOpenedAt.current < 700) return; setOpen((v) => !v); }}
      >
        {item.name}<span className="chev" aria-hidden="true" />
      </button>
      <div className="dd-panel" id={panelId}>
        {children.map((c) => (
          <Link key={c.href} href={c.href} aria-current={pathname === c.href ? "page" : undefined} onClick={() => { setOpen(false); onNavigate(); }}>
            {c.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname() ?? "/";
  // Pages whose Horizon photo top runs under the menu: transparent until scrolled.
  const overHero = HORIZON_HERO_PATHS.has(pathname);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const menuButton = useRef<HTMLButtonElement>(null);
  const close = () => setOpen(false);
  const current = (href: string) => (pathname === href || pathname.startsWith(`${href}/`) ? ("page" as const) : undefined);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Escape closes the phone menu; the full bar takes over from 1240px.
  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.defaultPrevented) { setOpen(false); menuButton.current?.focus(); }
    };
    const wide = window.matchMedia("(min-width: 1240px)");
    const onWide = (m: MediaQueryListEvent) => { if (m.matches) setOpen(false); };
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => { window.removeEventListener("keydown", onKey); wide.removeEventListener("change", onWide); document.body.classList.remove("nav-open"); };
  }, [open]);

  const headerClass = ["site-header", !overHero ? "is-solid" : scrolled ? "is-scrolled" : ""].filter(Boolean).join(" ");

  return (
    <div className="bl-h">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to main content
      </a>
      <header className={headerClass}>
        <div className="rail header-inner">
          <Link className="brand" href="/" aria-label="Brett Lechtenberg, home" onClick={close}>
            <Image src="/logo.jpg" alt="" width={48} height={48} preload />
            <span className="brand-name" aria-hidden="true"><span className="brand-first">Brett</span> Lechtenberg</span>
          </Link>
          <nav className="primary-nav" aria-label="Main">
            {navigation.map((item) =>
              item.children ? (
                <Dropdown key={item.name} item={item} pathname={pathname} onNavigate={close} />
              ) : (
                <Link key={item.name} className="nav-link" href={item.href} aria-current={current(item.href)}>
                  {item.name}
                </Link>
              ),
            )}
          </nav>
          <div className="header-actions">
            <a className="btn btn-cran btn-sm" href={links.booking} {...ext}>
              Talk With Brett<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <button
              ref={menuButton}
              className="menu-btn"
              type="button"
              data-nav-toggle
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="menu-lines" aria-hidden="true" />
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            </button>
          </div>
        </div>
        <nav className="mobile-nav" id={menuId} aria-label="Main mobile" hidden={!open}>
          {navigation.map((item) =>
            item.children ? (
              <div key={item.name} style={{ display: "contents" }}>
                <p className="m-group">{item.name}</p>
                {item.children.map((c) => (
                  <Link key={c.href} className="m-sub" href={c.href} aria-current={pathname === c.href ? "page" : undefined} onClick={close}>
                    {c.name}
                  </Link>
                ))}
              </div>
            ) : (
              <Link key={item.name} href={item.href} aria-current={current(item.href)} onClick={close}>
                {item.name}
              </Link>
            ),
          )}
          <a className="btn btn-cran m-cta" href={links.booking} {...ext} onClick={close}>
            Talk With Brett<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </nav>
      </header>
    </div>
  );
}
