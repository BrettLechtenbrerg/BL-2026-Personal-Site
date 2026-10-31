// BLOG POST, "Horizon" design (Group 3, 30 Oct 2026). Words, JSON-LD and metadata unchanged (tag pre-horizon-inner-2026-10-30).
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowRight, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HorizonMotion } from '@/components/horizon/HorizonMotion';
import { Btn, FinalCta, HorizonPage, PageHero } from '@/components/horizon/kit';
import { getPost, getAllPosts, getAllSlugs } from '@/lib/blog';
import { PostToc, type TocItem } from './PostToc';

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

// Section headings (## lines) become link targets for the "In this article" guide.
const slugify = (text: string) =>
  text.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function headingsOf(markdown: string): TocItem[] {
  return markdown
    .split('\n')
    .filter((line) => /^## /.test(line))
    .map((line) => line.replace(/^## /, '').replace(/[*_`]/g, '').trim())
    .map((text) => ({ id: slugify(text), text }));
}

const textOf = (children: React.ReactNode): string =>
  Array.isArray(children) ? children.map(textOf).join('') : typeof children === 'string' ? children : '';

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const heroAbsolute = post.heroImage.startsWith('http')
    ? post.heroImage
    : `${SITE_URL}${post.heroImage}`;
  const toc = headingsOf(post.content);
  const morePosts = getAllPosts().filter((p) => p.slug !== post.slug).slice(0, 3);

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
          {/* Reading progress (CSS scroll-driven; hidden where browsers lack support). */}
          <div className="read-progress" aria-hidden="true" />
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
            <div className="post-layout">
            {toc.length > 1 && <PostToc items={toc} />}
            <article className="post-article">
              <div className="prose-blog">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{ h2: ({ children }) => <h2 id={slugify(textOf(children))}>{children}</h2> }}
                >
                  {post.content}
                </ReactMarkdown>
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
            </div>
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

          {/* Keep reading: the other posts */}
          {morePosts.length > 0 && (
            <section className="sec sec-night keep-reading" aria-labelledby="keep-title">
              <div className="rail">
                <h2 id="keep-title" className="h2 sec-title center" data-rise>Keep <em>reading</em></h2>
                <ul className="posts" data-stagger>
                  {morePosts.map((p) => (
                    <li key={p.slug} className="paper-card post-card">
                      <div className="post-art">
                        <Image src={p.heroImage} alt="" fill sizes="(min-width: 1100px) 400px, (min-width: 768px) 50vw, 92vw" />
                      </div>
                      <div className="post-body">
                        <p className="post-meta">
                          <span>{formatDate(p.date)}</span>
                          <span aria-hidden="true">·</span>
                          <span className="post-time"><Clock aria-hidden="true" />{p.readingMinutes} min read</span>
                        </p>
                        <h3><Link className="post-link" href={`/blog/${p.slug}`}>{p.title}</Link></h3>
                        <p className="post-desc">{p.description}</p>
                        <span className="post-more" aria-hidden="true">Read article<ArrowRight /></span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

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
