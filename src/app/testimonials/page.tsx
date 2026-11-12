// TESTIMONIALS, "Horizon" design (Group 2, 30 Oct 2026). Words unchanged from the previous page (tag pre-horizon-inner-2026-10-30).
// Quotes are verbatim. Bill Schuffenhauer's quote and title match the back cover of The Master's Edge (Brett's source of truth, 31 Oct 2026).
// The six video testimonials load from YouTube only when played (like the home page video).
import Image from "next/image";
import { Award, Star, TrendingUp, Users, Video } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HorizonMotion } from "@/components/horizon/HorizonMotion";
import { Btn, FinalCta, HorizonPage, PageHero, VideoPoster } from "@/components/horizon/kit";
import { links } from "@/lib/utils";

const videos = [
  { id: "pofzL8xGFsQ", name: "Dana Fisher", company: "On Point Health" },
  { id: "OA7ptNxEjdM", name: "Bob Morris", company: "Sierra Home Services" },
  { id: "60csverI6oI", name: "Joyce Mathie", company: "Clean Differently" },
  { id: "ryGzHBHCjcg", name: "Rich Lavine", company: "South Paw Home Inspection" },
  { id: "fwlsFGANDJc", name: "Roger Knecht", company: "Universal Business Builder" },
  { id: "p3E50SvodVc", name: "Matt Gibbons", company: "Matt Gibbons Consulting" },
];

const featuredTestimonials = [
  {
    quote:
      "In my lifetime I have had the opportunity to meet extraordinary people from around the world and Brett Lechtenberg is one of them. I love to collaborate with Brett on big ideas because he helps me get into FLOW.",
    name: "Sam Beard",
    title: "Creator of 6 Presidential Programs for 8 United States Presidents",
    image: "/testimonials/sam-beard.jpg",
    pos: "38% 22%",
  },
  {
    quote:
      "Brett really knows flow, peak performance, and goals. I have been around a ton of business coaches and high-level performers, and Brett is a top-tier trainer, teacher, and coach.",
    name: "Bill Schuffenhauer",
    title: "Olympic Silver Medalist\u00a0· 3-Time Olympian",
    image: "/testimonials/bill-schuffenhauer.png",
    pos: "72% 30%",
  },
  {
    quote:
      "In my military career I had to perform in any conditions, at any given time, without fail. If you want to learn that kind of mindset in business and building teams then Brett Lechtenberg is definitely a person that I turn to help me with my goals and objectives.",
    name: "Sal Rossano",
    title: "Green Beret (Ret.) - Trauma Survival Specialist",
    image: "/testimonials/sal-rossano.png",
    pos: "50% 30%",
  },
  {
    quote:
      "Brett is as good an instructor as I have been around. His training methods and information is always cutting edge. If you want to learn how to take your business to the next level with individual, or team training then Brett Lechtenberg is the person to get on your team.",
    name: "Matt Gibbons",
    title: "President, Murray Chamber of Commerce",
    image: "/testimonials/matt-gibbons.png",
    pos: "50% 25%",
  },
  {
    quote:
      "Brett is one of my 300. Just like Spartans of old had to pick 300 to face down their foes who were no nonsense amazing people. Brett is someone I turn to when I need to pick my 300.",
    name: "Jerry Fontanez",
    title: "8-Time World Karate Champion",
    image: "/testimonials/jerry-fontanez.jpg",
    pos: "44% 14%",
  },
  {
    quote:
      "Brett has an innate ability to break down complicated subjects into easy to learn and quick to implement subject matter. He has helped me motivate my staff, implement more cash generation systems and help build a culture of fun and positive growth.",
    name: "John Nottingham",
    title: "Sword and Shield Security, Phoenix, AZ",
    image: "/testimonials/john-nottingham.webp",
    pos: "52% 30%",
  },
];

const businessResults = [
  {
    quote:
      "I have been blown away with the powerful mindset tools, branding systems and business building strategies Brett has shared with me. I added 43 percent to my best month of the year and I am on track to exceed that already this month. Brett has some truly remarkable business building strategies and peak performance systems.",
    name: "Rob Balderas",
    title: "Balderas Family Insurance, Arlington, WA",
    stat: "+43%",
    statLabel: "Revenue",
  },
  {
    quote:
      "Brett has helped me more clearly understand marketing and branding. Not only the implementation but the effect it has on my personal brand and the relationship I have with my community. I could not recommend Brett and his team enough for their effectiveness and professionalism.",
    name: "Al Agon",
    title: "Perfect Balance Fitness, Miami, FL",
    image: "/testimonials/al-agon.webp",
    pos: "44% 24%",
  },
  {
    quote:
      "Brett's books and training bring theory into practice. His trainings exist where the rubber meets the road. He not only teaches you the why, but he gives practical examples of how to implement the why. If you want to hit the next level, personally or as a business, Brett can help you get there.",
    name: "Ben Holt",
    title: "K2T3 PLLC, Sandy, UT",
  },
  {
    quote:
      "Brett is so experienced and knowledgeable with running a successful business. He is great at breaking down complex business systems into simple actions steps that are effective and give great results.",
    name: "Dorie Olds",
    title: "Beyond Creation Institute, Murray, UT",
  },
];

const moreTestimonials = [
  {
    quote:
      "Brett knows tons about business scaling, marketing, and how to improve the business! He has had success with his own businesses and can pass that along to you! He is always happy to help!",
    name: "Dwight Christie",
    title: "Dwight Christie Consulting, Midvale, UT",
    rating: 5,
  },
  {
    quote:
      "Brett will teach you from personal experience in running all of the businesses he has. How he can help you to market yours effectively. He is the go to person if you need help to grow your business.",
    name: "George Wilkinson",
    title: "LegalShield, Ada, OK",
    rating: 5,
  },
  {
    quote:
      "Master Brett Lechtenberg has a wealth of knowledge and experience in Mastery. He has worked hard to create a great system for helping his customers grow.",
    name: "Anthony Miles",
    title: "4th Wall Productions, Gilbert, AZ",
    rating: 5,
  },
  {
    quote:
      "Brett is an all around great and amazing individual. He truly cares about others, it's an honor and privilege to know him.",
    name: "Al Richards",
    title: "Triple A Concrete, West Jordan, UT",
    rating: 5,
  },
  {
    quote:
      "Brett came in and taught us some basic but in depth self defense moves and it was really useful! They were things that anyone of any size can use. I know that I will be going to him again to learn more!",
    name: "Alexus A.",
    title: "Thumbtack Review",
    rating: 5,
  },
  {
    quote:
      "Brett is very knowledgeable on self defense and taught us a lot of valuable tips and tricks for defending yourself in difficult situations. He is very approachable and wants people to be able to come to his classes so they can defend themselves.",
    name: "Brendan W.",
    title: "Thumbtack Review",
    rating: 5,
  },
  {
    quote:
      "If you want to know how to protect yourself and to make sure you go back to your family safely, he's the guy to go to! Amazing! As an EMT myself these basic skills that I was taught will help me in my career as well as in my professional life!",
    name: "Amanda W.",
    title: "Thumbtack Review",
    rating: 5,
  },
];

const initials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2);

function Stars({ count = 5 }: { count?: number }) {
  return (
    <span className="stars-row" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }, (_, i) => <Star key={i} aria-hidden="true" />)}
    </span>
  );
}

export default function TestimonialsPage() {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <HorizonPage>
          <PageHero
            id="testimonials-title"
            eyebrow={<Stars />}
            lines={["See What's", <em key="p">Possible</em>]}
            lede={<>Don&apos;t take Brett&apos;s word for it. Hear from the leaders, athletes, coaches, and business owners who&apos;ve experienced The Master&apos;s Edge firsthand.</>}
            photo={{ src: "/heroes/testimonials-usama.jpg", alt: "Brett Lechtenberg speaking at USA Martial Arts", w: 1920, h: 1080, pos: "50% 30%", shift: "12%" }}
            video="/videos/testimonials-hero-usama.mp4"
            side="right"
          />

          {/* Video testimonials */}
          <section className="sec sec-night" aria-labelledby="videos-title">
            <div className="rail">
              <div className="sec-head center" data-rise>
                <p className="chip"><Video aria-hidden="true" />Video Testimonials</p>
                <h2 id="videos-title" className="h2">Hear It <em>Directly</em> From Them</h2>
              </div>
              <ul className="video-grid" data-stagger>
                {videos.map((v) => (
                  <li key={v.id}>
                    <VideoPoster
                      id={v.id}
                      title={`${v.name} - ${v.company} Testimonial`}
                      poster={`/horizon/video/${v.id}.jpg`}
                      sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 92vw"
                      label={
                        <div className="video-label">
                          <span><span className="v-name">{v.name}</span><span className="v-sub">{v.company}</span></span>
                        </div>
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Featured testimonials */}
          <section className="sec sec-paper" aria-labelledby="featured-title">
            <div className="rail">
              <div className="sec-head center" data-rise>
                <p className="chip"><Award aria-hidden="true" />High-Profile Endorsements</p>
                <h2 id="featured-title" className="h2">Featured <em>Testimonials</em></h2>
              </div>
              <ul className="quote-grid cols-3" data-stagger>
                {featuredTestimonials.map((t) => (
                  <li key={t.name} className="paper-card tcard">
                    <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                    <p className="qcard-by">
                      <span className="portrait">
                        <Image src={t.image} alt="" fill sizes="64px" style={{ objectPosition: t.pos }} />
                      </span>
                      <span><span className="q-name">{t.name}</span>{t.title && <span className="q-title">{t.title}</span>}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Business results */}
          <section className="sec sec-night-2" aria-labelledby="results-title">
            <div className="rail">
              <div className="sec-head center" data-rise>
                <p className="chip chip-gold"><TrendingUp aria-hidden="true" />Business Results</p>
                <h2 id="results-title" className="h2">Results That Speak for <em>Themselves</em></h2>
              </div>
              <ul className="card-grid cols-2" data-stagger>
                {businessResults.map((t) => (
                  <li key={t.name} className="glass gcard biz-result">
                    {"image" in t && t.image && (
                      <span className="biz-result-photo" aria-hidden="true">
                        <Image src={t.image} alt="" fill sizes="220px" style={{ objectPosition: t.pos }} />
                      </span>
                    )}
                    {t.stat && <p className="biz-result-stat"><b>{t.stat}</b><span>{t.statLabel}</span></p>}
                    <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                    <div className="biz-result-by">
                      <cite>— {t.name}</cite>
                      {t.title && <p>{t.title}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* More reviews */}
          <section className="sec sec-paper-2" aria-labelledby="more-title">
            <div className="rail">
              <div className="sec-head center" data-rise>
                <p className="chip"><Users aria-hidden="true" />5-Star Reviews</p>
                <h2 id="more-title" className="h2">More <em>Success Stories</em></h2>
              </div>
              <ul className="masonry" data-stagger>
                {moreTestimonials.map((t) => (
                  <li key={t.name} className="paper-card review">
                    <Stars count={t.rating} />
                    <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                    <p className="qcard-by">
                      <span className="initials" aria-hidden="true">{initials(t.name)}</span>
                      <span><span className="q-name">{t.name}</span><span className="q-title">{t.title}</span></span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <FinalCta
            id="testimonials-final"
            title="Ready to Write Your Own Transformation Story?"
            photo={{ src: "/heroes/testimonials.jpg", w: 1920, h: 1280, pos: "55% 40%" }}
          >
            <Btn href={links.booking} external variant="gold" size="lg">Talk With Brett</Btn>
          </FinalCta>
        </HorizonPage>
      </main>
      <Footer />
      <HorizonMotion />
    </>
  );
}
