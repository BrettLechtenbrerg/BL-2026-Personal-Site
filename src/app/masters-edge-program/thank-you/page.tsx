// THANK YOU (after applying), "Horizon" design (Group 4, 31 Oct 2026). Words and links unchanged
// (tag pre-horizon-inner-2026-10-30); the off-brand green success colour is now Brett's gold and cranberry.
import { Calendar, CheckCircle, Mail } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HorizonMotion } from "@/components/horizon/HorizonMotion";
import { Btn, HorizonPage, PageHero } from "@/components/horizon/kit";
import { links } from "@/lib/utils";

const nextSteps = [
  {
    step: "1",
    title: "Application Review",
    desc: "Brett personally reviews your application within 48 hours to assess fit.",
  },
  {
    step: "2",
    title: "Personal Outreach",
    desc: "If it looks like a good match, you'll receive an email to schedule a brief call.",
  },
  {
    step: "3",
    title: "Welcome to the Cohort",
    desc: "Once accepted, you'll get onboarding materials and your cohort start date.",
  },
];

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <HorizonPage>
          <PageHero
            id="thanks-title"
            eyebrow={<span className="done-badge" aria-hidden="true"><CheckCircle /></span>}
            lines={["Your Application", <em key="i">Is In</em>]}
            lede={<>Brett personally reviews every application. You&apos;ll hear back within <strong className="t-gold">48 hours</strong> with next steps.</>}
            photo={{ src: "/heroes/masters-edge.jpg", alt: "Mountain peak at sunrise", w: 1920, h: 1280, pos: "60% 40%" }}
          />

          <section className="sec sec-night" aria-labelledby="meantime-title">
            <div className="rail">
              <div className="glass meantime" data-rise>
                <h2 id="meantime-title">In the meantime...</h2>
                <p>If you&apos;d like to get a head start on the conversation, you can book a time directly with Brett:</p>
                <Btn href={links.booking} external variant="gold" size="lg"><Calendar className="ico" aria-hidden="true" />Book a Conversation with Brett</Btn>
              </div>
              <p className="questions" data-rise>
                <Mail aria-hidden="true" />
                <span>Questions?</span>
                <a href="mailto:brett@brettlechtenberg.com">brett@brettlechtenberg.com</a>
              </p>
            </div>
          </section>

          <section className="sec sec-paper" aria-labelledby="next-title">
            <div className="rail">
              <h2 id="next-title" className="h2 sec-title center" data-rise>What Happens Next</h2>
              <ol className="teach-steps is-numbered" data-stagger>
                {nextSteps.map((item) => (
                  <li key={item.step} className="paper-card teach-step">
                    <span className="next-num">{item.step}</span>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </li>
                ))}
              </ol>
              <div className="back-home">
                <Btn href="/" variant="ink" arrow>Back to Homepage</Btn>
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
