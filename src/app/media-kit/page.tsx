// MEDIA KIT, "Horizon" design (Group 3, 30 Oct 2026). Words unchanged from the previous page (tag pre-horizon-inner-2026-10-30).
// Talk & Training Topics keeps the four-lane structure (CLAUDE_CODE_SPEC_Speaking_Page_v2.md, Section 9).
// Download buttons on the photos are always visible now (before, they only appeared on mouse hover).
import Image from "next/image";
import Link from "next/link";
import { Check, Download, FileText, Image as ImageIcon, Mic2, Monitor, Play, User } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HorizonMotion } from "@/components/horizon/HorizonMotion";
import { Book3D, Btn, FinalCta, HorizonPage, PageHero } from "@/components/horizon/kit";
import { LiveClip } from "@/components/ui/LiveClip";
import { CopyButton } from "./CopyButton";

const talkLanes = [
  {
    lane: "Peak Performance & Mindset",
    talks: [
      {
        title: "The Master's Edge",
        subtitle: "The Science of Inside-Out Transformation",
        duration: "60 to 90 min keynote or full-day workshop",
        bestFor: "Corporate events, leadership summits, conference keynotes",
      },
      {
        title: "The Limitless Mindset",
        subtitle: "The Little-Known Mindset Shifts That Upgrade Your Business and Your Life",
        duration: "60 to 90 min keynote or workshop",
        bestFor: "Company kickoffs, leadership retreats, conference keynotes",
      },
      {
        title: "Reclaiming The Clock",
        subtitle: "Mastering Habits, Productivity & the Truth About Leveraging Time",
        duration: "60 to 90 min keynote or half-day workshop",
        bestFor: "Business owners, entrepreneurs, chamber events",
      },
      {
        title: "Flow by Design",
        subtitle: "The Research-Backed Science of Peak States, Faster Learning, and Effortless Performance",
        duration: "60 to 90 min keynote",
        bestFor: "Conferences, high-performance teams, healthcare and technology audiences",
      },
    ],
  },
  {
    lane: "Leadership & Team Culture",
    talks: [
      {
        title: "Winning Team Culture",
        subtitle: "The Science & Art of Developing an Empowered Team of Motivated Professionals",
        duration: "Half-day or full-day training",
        bestFor: "Corporate retreats, management training, sports organizations",
      },
      {
        title: "The Road Less Traveled (Mastery Edition)",
        subtitle: "What 40 Years of Martial Arts Mastery Teaches Leaders About Excellence, Patience, and Longevity",
        duration: "45 to 60 min keynote",
        bestFor: "Leadership retreats, founder and owner groups, closing keynotes",
      },
    ],
  },
  {
    lane: "AI for Humans",
    talks: [
      {
        title: "Who Owns the Outcome?",
        subtitle: "The Leadership Question That Decides Whether AI Transforms Your Organization or Quietly Damages It",
        duration: "15 to 25 min keynote, expandable to 45 to 60 min",
        bestFor: "Executive meetings, leadership summits, board retreats, company kickoffs",
      },
      {
        title: "The AI Edge",
        subtitle: "Build It Before You Leave. A Hands-On Workshop",
        duration: "Half-day or full-day workshop; 90-minute starter version available",
        bestFor: "Leadership teams, operations and sales teams, company retreats where people need to leave with something working",
      },
    ],
  },
  {
    lane: "Sales & Ethical Influence",
    talks: [
      {
        title: "The Honest Close",
        subtitle: "The Three Beliefs Behind Every Yes and the Ethical Framework That Earns Them",
        duration: "60 to 90 min keynote or half-day training",
        bestFor: "Sales team meetings, credit unions and financial services, any team tired of pressure tactics",
      },
      {
        title: "A Category of One",
        subtitle: "Position Yourself So Far Ahead That Comparison Becomes Irrelevant",
        duration: "60 to 90 min keynote",
        bestFor: "Sales conferences, industry events, competitive environments",
      },
    ],
  },
];

const avRequirements = [
  "Wireless clip-on microphone (preferred) or handheld",
  "LCD projector and screen for presentations",
  "HDMI connection for laptop (adapter provided if needed)",
  "Confidence monitor or ability to see slides",
  "Stage lighting appropriate for video recording",
  "Small table for materials/water",
  "Brett may bring a videographer or set up a camera to record the session for his own promotional use. Please let us know in advance if your organization has restrictions.",
];

// Stage and event photos (Website-Fixes spec 3.8, Sep 27 2026). Captions match
// the /speaking gallery. More photos coming: add entries here.
const eventPhotos = [
  { src: "/speaking-gallery/america-first-training.jpg", label: "America First Credit Union", description: "Brett with the America First Credit Union team, Super Ethical Sales & Team Building, August 2026" },
  { src: "/speaking-gallery/murray-chamber-training.webp", label: "Murray Chamber of Commerce", description: "Women in Business Empowerment Training, Murray Chamber of Commerce, May 2026" },
];

const shortBio = `Brett Lechtenberg is a peak performance coach, author of eight books including five bestsellers, and the creator of The Master's Edge methodology. With over 30 years as a business owner and an 8th-degree black belt, Brett brings real-world business experience, original flow state research, and proven leadership principles to every audience he serves.`;

const longBio = `Brett Lechtenberg is a peak performance coach, bestselling author, and the creator of The Master's Edge, a methodology built on three pillars: First Principles to clarify, Frontloading to simplify, and Flow to maximize.

For over three decades, Brett has run Personal Mastery Martial Arts in Sandy, Utah, a living laboratory where every strategy was tested before it was ever taught. That real-world experience, combined with his formal research on flow states reviewed by the Flow Research Collective, gives Brett a perspective that resonates with audiences from corporate boardrooms to championship sports teams.

An 8th-degree black belt and author of eight books, five of them bestsellers, on topics ranging from personal safety to time management to AI, Brett has spoken at organizations including America First Credit Union, Packsize, Purple, Thumbtack, American Express, Delta, and chambers of commerce across Utah. His approach combines evidence-based strategies with engaging storytelling and practical application, so audiences leave not just inspired but equipped with tools they can use immediately.

Brett is also co-founder of Total Success AI, where he helps businesses adopt AI with a human-centered approach, and author of Powerful AI Strategies for Business Owners. His newest book, The Master's Edge, came out in October 2026 in paperback and on Kindle.`;

const shortIntro = `Please welcome Brett Lechtenberg, peak performance coach, author of eight books including five bestsellers, and creator of The Master's Edge methodology. With over 30 years as a business owner and an 8th-degree black belt, Brett brings practical, tested strategies for achieving peak performance. Please welcome, Brett Lechtenberg!`;

const longIntro = `Our next speaker is someone who doesn't just teach peak performance. He lives it.

Brett Lechtenberg has spent over 30 years running his own business, testing every strategy he teaches in the real world before sharing it with others. He's an 8th-degree black belt, author of eight books including five bestsellers, and the creator of The Master's Edge, a methodology that has helped thousands of leaders clarify their goals, simplify their approach, and maximize their results.

His original research on flow states has been reviewed by the Flow Research Collective, and his client list includes America First Credit Union, Packsize, American Express, and Delta.

What sets Brett apart is how he takes big ideas and makes them usable. Your audience will leave today with real tools they can use tomorrow.

Please give a warm welcome to Brett Lechtenberg!`;

const headshots = [
  { src: "/media-kit/brett-headshot-nobg.webp", label: "Professional Headshot", description: "Transparent background, ideal for graphics", hasBg: false },
  { src: "/media-kit/brett-fullbody-nobg.webp", label: "Full Body Portrait", description: "Transparent background, ideal for banners", hasBg: false },
  { src: "/media-kit/brett-casual.webp", label: "Casual Portrait", description: "Approachable office setting", hasBg: true },
  { src: "/media-kit/brett-twins.png", label: "Dual Portrait", description: "Martial arts & business, black background", hasBg: true },
  { src: "/media-kit/brett-twins-nobg.png", label: "Dual Portrait (No BG)", description: "Martial arts & business, transparent", hasBg: false },
];

function KitHead({ id, icon: Icon, gold, children }: { id: string; icon: typeof Download; gold?: boolean; children: React.ReactNode }) {
  return (
    <div className="kit-head" data-rise>
      <span className={`ico-badge${gold ? " is-gold" : ""}`} aria-hidden="true"><Icon /></span>
      <h2 id={id} className="h2">{children}</h2>
    </div>
  );
}

function PhotoCard({ src, alt, label, description, contain }: { src: string; alt: string; label: string; description: string; contain?: boolean }) {
  return (
    <li className="paper-card photo-card">
      <div className={`photo-frame${contain ? " is-contain" : ""}`}>
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw" />
      </div>
      <div className="photo-body">
        <div>
          <h3>{label}</h3>
          <p>{description}</p>
        </div>
        <a className="dl-btn" href={src} download aria-label={`Download ${label}`}><Download aria-hidden="true" />Download</a>
      </div>
    </li>
  );
}

export default function MediaKitPage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <HorizonPage>
          <PageHero
            id="kit-title"
            eyebrow={<><Download className="eyebrow-ico" aria-hidden="true" />Media Kit</>}
            lines={["Event Planner", <em key="r">Resources</em>]}
            lede={<>Everything you need to promote Brett&apos;s appearance at your event: biography, headshots, introductions, topics, and AV requirements.</>}
            photo={{ src: "/heroes/media-kit-brett-smile3.jpg", alt: "Brett Lechtenberg smiling while speaking at USA Martial Arts in Phoenix", w: 1440, h: 1380, pos: "50% 30%", beside: true }}
            side="right"
          />

          {/* Speaker one-sheet */}
          <section className="sec sec-paper onesheet-sec" aria-labelledby="onesheet-title">
            <div className="rail">
              <div className="onesheet" data-rise>
                <span className="ico-badge is-gold" aria-hidden="true"><FileText /></span>
                <div className="onesheet-copy">
                  <h2 id="onesheet-title">Speaker One-Sheet</h2>
                  <p>Everything you need in a single PDF: bio, topics, testimonials &amp; more</p>
                </div>
                <a className="btn btn-gold btn-lg" href="/brett-lechtenberg-speaker-one-sheet.pdf" download><Download className="ico" aria-hidden="true" />Download PDF</a>
              </div>
            </div>
          </section>

          {/* Speaker footage */}
          <section className="sec sec-night" aria-labelledby="footage-title">
            <div className="rail">
              <KitHead id="footage-title" icon={Play}>Speaker Footage</KitHead>
              <div className="split split-even">
                <div data-rise>
                  <LiveClip
                    src="/videos/sizzle-reel-2026.mp4"
                    poster="/videos/sizzle-reel-poster.jpg"
                    label="Brett Lechtenberg 2026 speaker sizzle reel"
                    aspect="wide"
                    caption="▶ Watch the 3:27 sizzle reel (with sound)"
                  />
                </div>
                <div className="kit-copy" data-rise>
                  <h3 className="h3">See What Your Audience Gets</h3>
                  <p className="body-lg">
                    Brett&apos;s official 2026 sizzle reel: live keynotes, corporate trainings, and audience reaction in under three and a half minutes.
                  </p>
                  <a className="btn btn-gold" href="/videos/sizzle-reel-2026.mp4" download><Download className="ico" aria-hidden="true" />Download the reel</a>
                  <p className="fine">
                    Need raw video files or additional footage for event promotion? <Link className="text-link" href="/contact">Contact us</Link>.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Headshots */}
          <section className="sec sec-paper" aria-labelledby="headshots-title">
            <div className="rail">
              <KitHead id="headshots-title" icon={ImageIcon}>Headshots</KitHead>
              <ul className="photo-grid" data-stagger>
                {headshots.map((p) => (
                  <PhotoCard key={p.label} src={p.src} alt={p.label} label={p.label} description={p.description} contain={!p.hasBg} />
                ))}
              </ul>
              <p className="kit-note">Need different formats or higher resolution? <Link className="text-link" href="/contact">Contact us</Link>.</p>
            </div>
          </section>

          {/* Stage and event photos (spec 3.8) */}
          <section className="sec sec-paper-2" aria-labelledby="events-title">
            <div className="rail">
              <KitHead id="events-title" icon={ImageIcon} gold>Stage and Event Photos</KitHead>
              <ul className="photo-grid is-wide" data-stagger>
                {eventPhotos.map((p) => (
                  <PhotoCard key={p.src} src={p.src} alt={p.description} label={p.label} description={p.description} />
                ))}
              </ul>
              <p className="kit-note">More event photos are on the way. Need something specific? <Link className="text-link" href="/contact">Contact us</Link>.</p>
            </div>
          </section>

          {/* Biography */}
          <section className="sec sec-paper" aria-labelledby="bio-title">
            <div className="rail">
              <KitHead id="bio-title" icon={User} gold>Biography</KitHead>
              <div className="bio-grid">
                <div className="bio-col">
                  <div className="paper-card text-card is-calm" data-rise>
                    <div className="text-card-head"><h3>Short Bio (50 words)</h3><CopyButton text={shortBio} what="short bio" /></div>
                    <p>{shortBio}</p>
                  </div>
                  {/* Master's Edge cover (spec 3.11). The real published cover (Oct 2026). */}
                  <figure className="paper-card cover-card is-calm" data-rise>
                    <a className="book3d-link" href="/books/masters-edge-cover.jpg" target="_blank" rel="noopener noreferrer" aria-label="Open the full-size cover of The Master's Edge (opens in a new tab)">
                      <Book3D src="/books/masters-edge-cover.jpg" alt="The Master's Edge by Brett Lechtenberg, book cover" w={800} h={1200} spine="/horizon/books/masters-edge-spine.jpg" spineColor="#efe9df" depth={0.093} sizes="200px" />
                    </a>
                    <figcaption>
                      The Master&apos;s Edge, out now in paperback and on Kindle.{" "}
                      <Link href="/books/masters-edge">About the book</Link>
                    </figcaption>
                  </figure>
                </div>
                <div className="bio-col">
                  <div className="paper-card text-card is-calm" data-rise>
                    <div className="text-card-head"><h3>Full Bio (200 words)</h3><CopyButton text={longBio} what="full bio" /></div>
                    <p className="pre-line">{longBio}</p>
                  </div>
                  <p className="kit-note">
                    <strong>Recent clients</strong> include America First Credit Union, Packsize, Purple, Thumbtack, MemberSolutions, American Express,
                    Delta, and the Murray, Park City, and Heber Valley Chambers of Commerce.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Introductions */}
          <section className="sec sec-night-2" aria-labelledby="intros-title">
            <div className="rail">
              <KitHead id="intros-title" icon={Mic2}>Pre-Written Introductions</KitHead>
              <div className="intro-grid" data-stagger>
                <div className="glass gcard intro-card">
                  <div className="text-card-head"><h3>Short Introduction (30 sec)</h3><CopyButton text={shortIntro} what="short introduction" /></div>
                  <p>{shortIntro}</p>
                </div>
                <div className="glass gcard intro-card">
                  <div className="text-card-head"><h3>Full Introduction (60-90 sec)</h3><CopyButton text={longIntro} what="full introduction" /></div>
                  <p className="pre-line">{longIntro}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Talk topics: four lanes */}
          <section className="sec sec-paper" aria-labelledby="topics-title">
            <div className="rail">
              <KitHead id="topics-title" icon={FileText} gold>Talk &amp; Training Topics</KitHead>
              <div className="topic-lanes">
                {talkLanes.map((lane) => (
                  <div key={lane.lane} className="topic-lane">
                    <p className="kicker">{lane.lane}</p>
                    <ul className="topic-list" data-stagger>
                      {lane.talks.map((talk) => (
                        <li key={talk.title} className="paper-card topic">
                          <div>
                            <h3>{talk.title}</h3>
                            <p className="topic-sub">{talk.subtitle}</p>
                          </div>
                          <div className="topic-meta">
                            <p><b>Duration:</b> {talk.duration}</p>
                            <p><b>Best for:</b> {talk.bestFor}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="kit-note">
                All topics can be customized to your audience and event format. <Link className="text-link" href="/book-brett">Request a custom presentation</Link>.
              </p>
            </div>
          </section>

          {/* AV requirements */}
          <section className="sec sec-paper-2" aria-labelledby="av-title">
            <div className="rail">
              <KitHead id="av-title" icon={Monitor}>AV &amp; Technical Requirements</KitHead>
              <div className="paper-card av-card is-calm" data-rise>
                <ul className="av-list">
                  {avRequirements.map((req) => (
                    <li key={req}><span className="av-tick" aria-hidden="true"><Check /></span><span>{req}</span></li>
                  ))}
                </ul>
                <p className="av-note">
                  <b>Note:</b> Brett travels with his own presentation clicker and can adapt to most AV setups. For virtual events, he uses professional
                  lighting and audio equipment from his studio.
                </p>
              </div>
            </div>
          </section>

          <FinalCta
            id="kit-final"
            title="Ready to Book Brett?"
            text={<>Have questions or need something not listed here? We&apos;re happy to help.</>}
            photo={{ src: "/heroes/speaking.jpg", w: 1920, h: 1280, pos: "40% 50%" }}
          >
            <div className="final-ctas">
              <Btn href="/book-brett" variant="gold" size="lg" arrow>Request Booking</Btn>
              <Btn href="/contact" variant="glass" size="lg">Contact Us</Btn>
            </div>
          </FinalCta>
        </HorizonPage>
      </main>
      <Footer />
      <HorizonMotion />
    </>
  );
}
