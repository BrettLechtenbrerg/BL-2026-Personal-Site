// CONTACT, "Horizon" design (Group 4, 31 Oct 2026). Words and links unchanged (tag pre-horizon-inner-2026-10-30).
import Image from "next/image";
import { Calendar, Globe, Lock, Mail, MapPin, Shield, Target } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HorizonMotion } from "@/components/horizon/HorizonMotion";
import { Btn, HorizonPage, PageHero, ext } from "@/components/horizon/kit";
import { links } from "@/lib/utils";

const promises = [
  {
    icon: Target,
    title: "No Sales Pressure",
    description:
      "This is a conversation, not a pitch. Brett wants to understand your situation before recommending anything.",
  },
  {
    icon: Shield,
    title: "Customized to You",
    description:
      "Every engagement starts from scratch. There's no prepackaged program waiting to be sold.",
    gold: true,
  },
  {
    icon: Lock,
    title: "Confidential",
    description: "What you share stays between you and Brett. Period.",
  },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <HorizonPage>
          <PageHero
            id="contact-title"
            lines={["Let's Talk About What's", <em key="p">Possible</em>]}
            lede={<>No pitch. No pressure. Just a genuine conversation about where you are, where you want to be, and whether The Master&apos;s Edge is the right fit.</>}
            photo={{ src: "/heroes/contact.jpg", alt: "Professional handshake representing connection", w: 1920, h: 1282, pos: "50% 45%" }}
            side="right"
          />

          {/* Two ways to reach Brett + three promises */}
          <section className="sec sec-paper" aria-label="Ways to reach Brett">
            <div className="rail">
              <div className="contact-ways" data-stagger>
                <div className="way is-call">
                  <span className="ico-badge" aria-hidden="true"><Calendar /></span>
                  <h2>Book a Call With Brett</h2>
                  <p>Schedule a conversation at a time that works for you.</p>
                  <Btn href={links.booking} external variant="gold" size="lg">Book a Call</Btn>
                </div>
                <div className="paper-card way is-mail">
                  <span className="ico-badge is-gold" aria-hidden="true"><Mail /></span>
                  <h2>Or Reach Out Directly</h2>
                  <p>Prefer email? Send Brett a message anytime.</p>
                  <a className="btn btn-cran btn-lg" href={links.email}>Brett@BrettLechtenberg.com</a>
                </div>
              </div>

              <ul className="card-grid cols-3 promises" data-stagger>
                {promises.map((promise) => (
                  <li key={promise.title} className="paper-card promise">
                    <span className={`ico-badge${promise.gold ? " is-gold" : ""}`} aria-hidden="true"><promise.icon /></span>
                    <h3>{promise.title}</h3>
                    <p>{promise.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Quick Reference */}
          <section className="sec sec-night" aria-labelledby="ref-title">
            <div className="rail">
              <h2 id="ref-title" className="h2 sec-title center" data-rise>Quick <em>Reference</em></h2>
              <div className="glass ref-card" data-rise>
                <span className="ref-photo">
                  <Image src="/media-kit/brett-casual.webp" alt="Brett Lechtenberg" fill sizes="104px" />
                </span>
                <p className="ref-name">Brett Lechtenberg</p>
                <p className="ref-role">Peak Performance Coach | Speaker | Author</p>
                <p className="ref-gold">Creator of The Master&apos;s Edge</p>
                <p className="ref-place"><MapPin aria-hidden="true" /><span>Sandy, Utah</span></p>

                <div className="ref-sites">
                  <p className="ref-sites-k"><Globe aria-hidden="true" /><span>Websites</span></p>
                  <div className="ref-links">
                    <a href="https://www.brettlechtenberg.com">brettlechtenberg.com</a>
                    <a href={links.martialArts} {...ext}>personalmasterymartialarts.com</a>
                    <a href={links.ai} {...ext}>totalsuccessai.com</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </HorizonPage>
      </main>
      <Footer />
      <HorizonMotion />
    </>
  );
}
