// BLOG POST, "Horizon" design (Group 3, 30 Oct 2026). Words, JSON-LD and metadata unchanged (tag pre-horizon-inner-2026-10-30).
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HorizonMotion } from '@/components/horizon/HorizonMotion';
import { Btn, FinalCta, HorizonPage, PageHero } from '@/components/horizon/kit';
import { getPost, getAllSlugs } from '@/lib/blog';

interface BlogPostParams {
  slug: string;
}

interface BlogPostPageProps {
  params: Promise<BlogPostParams>;
}

const SITE_URL = 'https://www.brettlechtenberg.com';

// Pre-render every post at build time. Vercel rebuilds on every merge,
// so new posts ship as static HTML — fast and SEO-friendly.
export async function generateStaticParams(): Promise<BlogPostParams[]> {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    return { title: 'Post not found · Brett Lechtenberg' };
  }

  const url = `${SITE_URL}/blog/${post.slug}`;
  const heroAbsolute = post.heroImage.startsWith('http')
    ? post.heroImage
    : `${SITE_URL}${post.heroImage}`;

  return {
    title: `${post.title} · Brett Lechtenberg`,
    description: post.description,
    keywords: [post.keyword],
    authors: [{ name: 'Brett Lechtenberg', url: SITE_URL }],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description,
      siteName: 'Brett Lechtenberg',
      publishedTime: post.date,
      authors: ['Brett Lechtenberg'],
      images: [
        {
          url: heroAbsolute,
          width: 1536,
          height: 1024,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [heroAbsolute],
    },
    robots: { index: true, follow: true },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // Date-only post dates are UTC midnight; format in UTC so a build in any timezone shows the posted day.
    timeZone: 'UTC',
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const heroAbsolute = post.heroImage.startsWith('http')
    ? post.heroImage
    : `${SITE_URL}${post.heroImage}`;

  // Schema.org JSON-LD — Article + optional FAQPage if frontmatter has FAQs.
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: heroAbsolute,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: 'Brett Lechtenberg',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'Brett Lechtenberg',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  const faqSchema = post.faq && post.faq.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}
        <HorizonPage>
          <PageHero
            id="post-title"
            small
            eyebrow={
              <span className="post-top">
                <Link href="/blog" className="post-back">← Back to all posts</Link>
                <span className="post-meta">
                  <span>{formatDate(post.date)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="post-time"><Clock aria-hidden="true" /> {post.readingMinutes} min read</span>
                </span>
              </span>
            }
            lines={[post.title]}
            lede={post.description}
            photo={{ src: post.heroImage, alt: post.title, w: 1536, h: 1024, pos: "50% 45%", beside: true }}
          />

          <section className="sec sec-paper post-sec" aria-label="Article">
            <article className="post-article">
              <div className="prose-blog">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
              </div>

              {/* FAQ (if any): visible HTML version. JSON-LD above handles SEO. */}
              {post.faq && post.faq.length > 0 && (
                <section className="post-faq" aria-labelledby="post-faq-title">
                  <h2 id="post-faq-title" className="h3">Frequently asked questions</h2>
                  <dl>
                    {post.faq.map((f, i) => (
                      <div key={i} className="paper-card is-calm">
                        <dt>{f.question}</dt>
                        <dd>{f.answer}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}
            </article>
          </section>

          {/* Author */}
          <section className="sec sec-paper-2 author-sec" aria-label="About the author">
            <div className="rail">
              <div className="paper-card author is-calm" data-rise>
                <span className="author-photo">
                  <Image src="/brett-hero.webp" alt="Brett Lechtenberg" fill sizes="96px" />
                </span>
                <div>
                  <p className="kicker">Written by</p>
                  <h3>Brett Lechtenberg</h3>
                  <p>
                    Peak performance coach, speaker, and author. Four decades on the mat. Brett works with leaders, athletes, and entrepreneurs who
                    refuse to coast, turning discipline into outcomes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <FinalCta
            id="post-final"
            title="Want to work together?"
            text={<>Coaching, speaking, advisory. Book a conversation and let&apos;s see where I can move the needle.</>}
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
