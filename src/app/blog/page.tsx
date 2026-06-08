import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog · Brett Lechtenberg',
  description:
    'Practical writing on peak performance, leadership, and the disciplines that drive real results. From Brett Lechtenberg — coach, speaker, author.',
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
  });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-black via-cranberry-dark to-cranberry text-white overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--gold),_transparent_60%)]" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <p className="text-gold text-sm uppercase tracking-widest mb-4 font-semibold">
              Brett Lechtenberg · Blog
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 font-heading">
              Writing on performance, discipline, and the work itself.
            </h1>
            <p className="text-xl text-white/85 max-w-2xl">
              Bold, practical, performance-driven. No fluff — just what works
              from four decades on the mat, on the stage, and in the field.
            </p>
          </div>
        </section>

        {/* Posts grid */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {posts.length === 0 ? (
              <p className="text-center text-warm-gray py-20">
                No posts yet. Check back soon.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-cranberry/50 hover:shadow-xl hover:shadow-cranberry/10 transition-all"
                  >
                    <div className="relative aspect-[16/10] bg-gray-100">
                      <Image
                        src={post.heroImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-warm-gray mb-3">
                        <span>{formatDate(post.date)}</span>
                        <span className="text-gray-300">·</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readingMinutes} min read
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-black mb-3 group-hover:text-cranberry transition-colors leading-snug font-heading">
                        {post.title}
                      </h2>
                      <p className="text-warm-gray text-sm mb-4 line-clamp-3">
                        {post.description}
                      </p>
                      <span className="inline-flex items-center gap-2 text-cranberry font-semibold text-sm group-hover:gap-3 transition-all">
                        Read article
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-cranberry to-cranberry-dark text-white py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Want to work together?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Coaching, speaking, advisory — book a conversation and let&apos;s see
              where I can move the needle for you or your team.
            </p>
            <a
              href="https://www.speaktobrett.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold text-black font-semibold px-8 py-4 rounded-full hover:bg-gold-light transition-colors"
            >
              Speak to Brett
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
