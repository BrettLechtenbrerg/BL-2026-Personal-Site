import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowRight, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getPost, getAllSlugs } from '@/lib/blog';

interface BlogPostParams {
  slug: string;
}

interface BlogPostPageProps {
  params: Promise<BlogPostParams>;
}

const SITE_URL = 'https://brettlechtenberg.com';

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
      <main className="min-h-screen bg-white">
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

        {/* Hero */}
        <section className="relative bg-gradient-to-br from-black via-cranberry-dark to-cranberry text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--gold),_transparent_60%)]" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
            <Link
              href="/blog"
              className="text-gold text-sm hover:text-gold-light inline-flex items-center gap-2 mb-6"
            >
              ← Back to all posts
            </Link>
            <div className="flex items-center gap-3 text-sm text-white/70 mb-4">
              <span>{formatDate(post.date)}</span>
              <span className="text-white/40">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3 h-3" /> {post.readingMinutes} min read
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 font-heading">
              {post.title}
            </h1>
            <p className="text-lg text-white/85 max-w-2xl">{post.description}</p>
          </div>
        </section>

        {/* Hero image */}
        <section className="bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
              <Image
                src={post.heroImage}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
        </section>

        {/* Body */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="prose-blog">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>

          {/* FAQ (if any) — visible HTML version. JSON-LD above handles SEO. */}
          {post.faq && post.faq.length > 0 && (
            <section className="mt-16 pt-12 border-t border-gray-200">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-8 font-heading">
                Frequently asked questions
              </h2>
              <dl className="space-y-6">
                {post.faq.map((f, i) => (
                  <div key={i}>
                    <dt className="text-lg font-bold text-cranberry mb-2">{f.question}</dt>
                    <dd className="text-warm-gray leading-relaxed">{f.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
        </article>

        {/* Author bio */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0 bg-cranberry/10 ring-2 ring-gold/30">
                <Image
                  src="/brett-hero.webp"
                  alt="Brett Lechtenberg"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-cranberry mb-2">
                  Written by
                </p>
                <h3 className="text-xl font-bold text-black mb-2 font-heading">Brett Lechtenberg</h3>
                <p className="text-warm-gray leading-relaxed">
                  Peak performance coach, speaker, and author. Four decades on the
                  mat. Brett works with leaders, athletes, and entrepreneurs who
                  refuse to coast — turning discipline into outcomes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-cranberry to-cranberry-dark rounded-2xl p-8 md:p-12 text-white text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 font-heading">
                Want to work together?
              </h2>
              <p className="text-white/90 text-lg mb-6 max-w-xl mx-auto">
                Coaching, speaking, advisory — book a conversation and let&apos;s
                see where I can move the needle.
              </p>
              <a
                href="https://www.speaktobrett.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gold text-black font-semibold px-8 py-3 rounded-full hover:bg-gold-light transition-colors"
              >
                Speak to Brett
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
