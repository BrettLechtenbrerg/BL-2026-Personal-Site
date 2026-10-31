// BLOG, "Horizon" design (Group 3, 30 Oct 2026). Words unchanged from the previous page (tag pre-horizon-inner-2026-10-30).
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HorizonMotion } from '@/components/horizon/HorizonMotion';
import { Btn, FinalCta, HorizonPage, PageHero } from '@/components/horizon/kit';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog · Brett Lechtenberg',
  description:
    'Practical writing on peak performance, leadership, and the disciplines that drive real results. From Brett Lechtenberg: coach, speaker, author.',
  alternates: { canonical: 'https://www.brettlechtenberg.com/blog' },
  openGraph: {
    title: 'Blog · Brett Lechtenberg',
    description:
      'Practical writing on peak performance, leadership, and the disciplines that drive real results.',
    url: 'https://www.brettlechtenberg.com/blog',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // Date-only post dates are UTC midnight; format in UTC so a build in any timezone shows the posted day.
    timeZone: 'UTC',
  });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <HorizonPage>
          <PageHero
            id="blog-title"
            eyebrow="Brett Lechtenberg · Blog"
            lines={["Writing on performance, discipline,", <>and <em>the work itself.</em></>]}
            lede="Bold, practical, performance-driven. No fluff, just what works from four decades on the mat, on the stage, and in the field."
            photo={{ src: "/heroes/books.jpg", alt: "", w: 1920, h: 1775, pos: "50% 40%" }}
            wide
          />

          <section className="sec sec-paper" aria-label="Posts">
            <div className="rail">
              {posts.length === 0 ? (
                <p className="kit-note center">No posts yet. Check back soon.</p>
              ) : (
                <ul className="posts" data-stagger>
                  {posts.map((post) => (
                    <li key={post.slug} className="paper-card post-card">
                      <div className="post-art">
                        <Image src={post.heroImage} alt={post.title} fill sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 92vw" />
                      </div>
                      <div className="post-body">
                        <p className="post-meta">
                          <span>{formatDate(post.date)}</span>
                          <span aria-hidden="true">·</span>
                          <span className="post-time"><Clock aria-hidden="true" />{post.readingMinutes} min read</span>
                        </p>
                        <h2><Link className="post-link" href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                        <p className="post-desc">{post.description}</p>
                        <span className="post-more" aria-hidden="true">Read article<ArrowRight /></span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <FinalCta
            id="blog-final"
            title="Want to work together?"
            text={<>Coaching, speaking, advisory. Book a conversation and let&apos;s see where I can move the needle for you or your team.</>}
            photo={{ src: "/horizon/limitless-horizon.jpg", w: 3200, h: 2133, pos: "46% 35%" }}
          >
            <Btn href="https://www.speaktobrett.com" external variant="gold" size="lg" arrow>Speak to Brett</Btn>
          </FinalCta>
        </HorizonPage>
      </main>
      <Footer />
      <HorizonMotion />
    </>
  );
}
