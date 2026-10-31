"use client";

// "In this article" guide beside a blog post (wide screens): links to each section and highlights the one being read.
import { useEffect, useState } from "react";

export type TocItem = { id: string; text: string };

export function PostToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const heads = items.map((i) => document.getElementById(i.id)).filter((h): h is HTMLElement => !!h);
    if (!heads.length) return;
    // The active section is the last heading that has passed the upper third of the screen.
    const update = () => {
      const line = window.innerHeight * 0.33;
      let current = heads[0].id;
      for (const h of heads) if (h.getBoundingClientRect().top <= line) current = h.id;
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [items]);

  return (
    <nav className="post-toc" aria-label="In this article">
      <p className="post-toc-k">In this article</p>
      <ol>
        {items.map((item, i) => (
          <li key={item.id}>
            <a href={`#${item.id}`} aria-current={active === item.id ? "true" : undefined}>
              <span className="post-toc-n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
