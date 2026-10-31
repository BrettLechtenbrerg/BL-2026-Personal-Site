// BOOKS & MEDIA, "Horizon" design (Group 3, 30 Oct 2026). Words unchanged from the previous page (tag pre-horizon-inner-2026-10-30).
// Book cards are now real links (before, only a click handler on the whole card); the four TV clips load on Play.
// Top photo: a lightly smoothed copy of the bookshelf photo (it sits behind a dark overlay), 63 KB → 40 KB on phones (31 Oct).
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Newspaper, Play, Star, Tv } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HorizonMotion } from "@/components/horizon/HorizonMotion";
import { Book3D, Btn, FinalCta, HorizonPage, NewTab, PageHero, VideoPoster, ext } from "@/components/horizon/kit";
import { links } from "@/lib/utils";
import { FreeBookButton, PressCarousel } from "./BooksClient";

const books = [
  {
    title: "The Master's Edge",
    // Published Oct 19, 2026 (KDP paperback ISBN 9798178891940 + Kindle).
    status: "New, October 2026 (Paperback and Kindle)",
    description:
      "Brett's newest book: mastering business and life through Mindset, Skillset, and Systems Design. Nineteen chapters, each taught parable first, principle second, practice always.",
    bestseller: false,
    featured: true,
    image: "/books/masters-edge-cover.jpg",
    pageUrl: "/books/masters-edge",
  },
  {
    // Published Aug 2026 (KDP, ISBN 9798193944539).
    title: "Powerful AI Strategies for Business Owners",
    status: "New, August 2026 (with Manny Torres)",
    description:
      "A real-world guide to saving time, serving customers, and growing your business with AI. People-first, no hype, tested in real businesses.",
    bestseller: false,
    image: "/books/powerful-ai-strategies.jpg",
    book3d: { w: 750, h: 1200, spine: "/horizon/books/powerful-ai-spine.jpg", spineColor: "#16244a", depth: 0.054 },
    amazonUrl: "https://www.amazon.com/Powerful-Strategies-Business-Owners-Real-World/dp/B0HH6YZYQV",
  },
  {
    title: "Reclaiming The Clock",
    status: "Bestseller",
    description:
      "How to have more time, reduce stress, and increase peace of mind in a world of unparalleled distraction.",
    bestseller: true,
    image: "/books/reclaiming-the-clock.png",
    amazonUrl: "https://www.amazon.com/Reclaiming-Clock-increase-Unparalleled-distraction/dp/1543203868",
  },
  {
    title: "The Anti-Bully Program",
    status: "#1 Amazon Bestseller",
    description:
      "A straightforward and insightful training program for families navigating bullying.",
    bestseller: true,
    image: "/books/anti-bully-program.png",
    amazonUrl: "https://www.amazon.com/Anti-Bully-Program-Common-Sense-Families/dp/1500561665",
  },
  {
    title: "The Anti-Cyber Bully Program",
    status: "#1 Amazon Bestseller",
    description: "Clear, actionable guidance for parents dealing with cyberbullying.",
    bestseller: true,
    image: "/books/anti-cyber-bully-program.png",
    amazonUrl: "https://www.amazon.com/Anti-Cyber-Bully-Program-Families/dp/1502885824",
  },
  {
    title: "Bullyproof: Unleash the Hero in Your Kid",
    status: "#1 Amazon Bestseller (Contributing Author)",
    description:
      "A collaborative work bringing together experts on child empowerment and safety.",
    bestseller: true,
    image: "/books/bullyproof.png",
    book3d: { w: 568, h: 850, spineColor: "#c3c9cd", depth: 0.07 },
    amazonUrl: "https://www.amazon.com/Bullyproof-Unleash-Hero-Inside-Your/dp/0692522719",
  },
  {
    title: "The Ultimate Travel Safety Program",
    status: "Bestseller",
    description:
      "Essential safety training for travelers, missionaries, and anyone heading abroad.",
    bestseller: true,
    image: "/books/travel-safety-program.png",
    book3d: { w: 1626, h: 2440, spineColor: "#f1f0f4", depth: 0.05 },
    amazonUrl: "https://www.amazon.com/Ultimate-Travel-Safety-Program-missionaries/dp/1532765312",
  },
  {
    title: "Protecting Your Castle",
    status: "Published",
    description:
      "The premier anti-home burglary and safety training program for homeowners and renters.",
    bestseller: false,
    image: "/books/protecting-your-castle.png",
    amazonUrl: "https://www.amazon.com/Protecting-Your-Castle-common-defense/dp/153290701X",
  },
  {
    title: "How to Build a Rockstar Team",
    status: "Free eBook",
    description:
      "The essential guide to building, leading, and retaining a team of motivated professionals who perform at their best.",
    bestseller: false,
    freebie: true,
    image: "/books/rockstar-team.png",
  },
];

const usaTodayImages = [
  { src: "/usa-today/butler-elementary.png", alt: "Brett's Anti-Bullying Program featured at Butler Elementary, USA Today" },
  { src: "/usa-today/phoenix-antibullying.png", alt: "USA Today coverage of Anti-Bullying program in Phoenix" },
  { src: "/usa-today/screenshot-2015.png", alt: "USA Today feature article 2015" },
  { src: "/usa-today/screenshot-2019.png", alt: "USA Today feature article 2019" },
  { src: "/usa-today/lp-bully.png", alt: "Anti-Bully Program featured in USA Today" },
  { src: "/usa-today/draper.jpg", alt: "Brett's program in Draper, USA Today" },
];

const clips = [
  { id: "Dq7agUEBr6I", title: "Brett Lechtenberg on Good Things Utah", poster: "/horizon/good-things-utah-poster.jpg", label: "Good Things Utah - The Master's Edge" },
  { id: "tos_1uWdW4E", start: 1, title: "Brett Lechtenberg - Profiles in Caring", poster: "/horizon/video/tos_1uWdW4E.jpg", label: "Profiles in Caring", gold: true },
  { id: "tHNnmrkqPrM", title: "Brett Lechtenberg on The Daily Dish - CW30", poster: "/horizon/video/tHNnmrkqPrM.jpg", label: "The Daily Dish - CW30" },
  { id: "A4yGZCZL2S8", title: "Brett Lechtenberg on Good Things Utah - Wild Bear X", poster: "/horizon/video/A4yGZCZL2S8.jpg", label: "Good Things Utah - Wild Bear X", gold: true },
];

type Book = (typeof books)[number];

function BookCard({ book }: { book: Book }) {
  const featured = "featured" in book && book.featured;
  const freebie = "freebie" in book && book.freebie;
  const amazon = "amazonUrl" in book ? book.amazonUrl : undefined;
  const page = "pageUrl" in book ? book.pageUrl : undefined;
  // Flat covers are shown as 3D books (Brett, 30 Oct 2026).
  const mock = "book3d" in book ? book.book3d : undefined;
  return (
    <li className={`paper-card book${featured ? " is-featured" : ""}${freebie ? " is-free" : ""}`}>
      <div className={`book-art${mock ? " is-3d" : ""}`}>
        {featured ? (
          <Image src="/books/masters-edge-stack.jpg" alt="Stack of The Master's Edge books by Brett Lechtenberg" fill sizes="(min-width: 1024px) 460px, 92vw" />
        ) : mock ? (
          <Book3D src={book.image} alt="" w={mock.w} h={mock.h} spine={"spine" in mock ? mock.spine : undefined} spineColor={mock.spineColor} depth={mock.depth} sizes="120px" />
        ) : (
          <Image src={book.image} alt="" fill sizes="160px" />
        )}
      </div>
      <div className="book-body">
        <div className="book-head">
          <h3>
            {page ? (
              <Link className="book-link" href={page}>{book.title}</Link>
            ) : amazon ? (
              <a className="book-link" href={amazon} {...ext}>{book.title}<NewTab /></a>
            ) : freebie ? (
              <FreeBookButton className="book-link">{book.title}</FreeBookButton>
            ) : (
              book.title
            )}
          </h3>
          {freebie ? (
            <span className="book-badge is-free">FREE</span>
          ) : book.bestseller && (
            <span className="book-badge"><Star aria-hidden="true" />Bestseller</span>
          )}
        </div>
        <p className="book-status">{book.status}</p>
        <p className="book-desc">{book.description}</p>
        {page && <p className="book-more">See the book and order it →</p>}
      </div>
    </li>
  );
}

export default function BooksPage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <HorizonPage>
          <PageHero
            id="books-title"
            eyebrow={<><BookOpen className="eyebrow-ico" aria-hidden="true" />Books &amp; Media</>}
            lines={["Ideas That Have Helped", <em key="t">Thousands</em>]}
            lede={<>Eight books, five bestsellers, and a growing library of media appearances, all built on one principle: <strong>teach what you&apos;ve tested.</strong></>}
            photo={{ src: "/horizon/books-shelf-soft.jpg", alt: "", w: 1536, h: 1024, pos: "70% 45%" }}
          />

          {/* Books */}
          <section className="sec sec-paper" aria-labelledby="shelf-title">
            <div className="rail">
              <h2 id="shelf-title" className="h2 sec-title center" data-rise>Brett&apos;s <em>Books</em></h2>
              <ul className="books" data-stagger>
                {books.map((book) => <BookCard key={book.title} book={book} />)}
              </ul>
            </div>
          </section>

          {/* Media */}
          <section className="sec sec-night" aria-labelledby="media-title">
            <div className="rail">
              <h2 id="media-title" className="h2 sec-title center" data-rise>Brett in the <em>Media</em></h2>
              <div className="seen-on" data-rise>
                <p className="chip chip-gold"><Tv aria-hidden="true" />As Seen On</p>
                <ul className="seen-list">
                  {["Good Things Utah", "The Daily Dish (CW30)", "Channel 4", "Channel 13", "Profiles in Caring"].map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
              <ul className="clips" data-stagger>
                {clips.map((c) => (
                  <li key={c.id}>
                    <VideoPoster
                      id={c.id}
                      start={c.start}
                      title={c.title}
                      poster={c.poster}
                      sizes="(min-width: 768px) 600px, 92vw"
                      label={
                        <p className="clip-label">
                          <span className={`clip-ico${c.gold ? " is-gold" : ""}`} aria-hidden="true"><Play /></span>
                          {c.label}
                        </p>
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* USA Today */}
          <section className="sec sec-paper-2" aria-labelledby="usa-title">
            <div className="rail">
              <div className="sec-head center" data-rise>
                <p className="chip"><Newspaper aria-hidden="true" />National Press</p>
                <h2 id="usa-title" className="h2">Featured in <em>USA Today</em></h2>
                <p className="body-lg">Brett&apos;s anti-bullying programs have received national recognition and coverage.</p>
              </div>
              <div data-rise><PressCarousel images={usaTodayImages} /></div>
            </div>
          </section>

          {/* Free book */}
          <section className="sec sec-night-2" aria-labelledby="free-title">
            <div className="rail">
              <div className="glass freebook" data-rise>
                <div className="freebook-art" aria-hidden="true">
                  <Image src="/books/rockstar-team.png" alt="" width={1500} height={1383} sizes="(min-width: 860px) 320px, 70vw" />
                </div>
                <div className="freebook-copy">
                  <h2 id="free-title" className="h2">Get Your Free Copy of <em>How to Build a Rockstar Team</em></h2>
                  <p className="body-lg">
                    Brett&apos;s essential guide to building, leading, and retaining a team of motivated professionals, delivered to your inbox.
                  </p>
                  <FreeBookButton className="btn btn-gold btn-lg"><BookOpen className="ico" aria-hidden="true" />Get the Free eBook</FreeBookButton>
                  <p className="freebook-quiz">
                    Not sure where your team is leaking talent?{" "}
                    <Link href="/rockstar-team-quiz">Take the free 2-minute Rockstar Team Quiz</Link>{" "}
                    and get your #1 gap diagnosed.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <FinalCta
            id="books-final"
            title="Want Brett to Write the Next Chapter With You?"
            photo={{ src: "/heroes/books.jpg", w: 1920, h: 1775, pos: "50% 45%" }}
          >
            <Btn href={links.booking} external variant="gold" size="lg" arrow>Talk With Brett</Btn>
          </FinalCta>
        </HorizonPage>
      </main>
      <Footer />
      <HorizonMotion />
    </>
  );
}
