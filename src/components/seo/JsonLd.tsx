export function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Brett Lechtenberg",
    url: "https://brettlechtenberg.com",
    image: "https://brettlechtenberg.com/brett-hero.webp",
    sameAs: [
      "https://www.linkedin.com/in/brettlechtenberg",
      "https://www.facebook.com/BrettGLechtenberg",
      "https://www.instagram.com/blechtenberg/",
      "https://www.youtube.com/@BrettLechtenberg",
    ],
    jobTitle: "Peak Performance Coach",
    description:
      "Brett Lechtenberg helps leaders unlock peak performance through The Master's Edge — a proven methodology built on 30+ years of real-world experience and validated flow state research.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sandy",
      addressRegion: "UT",
      addressCountry: "US",
    },
    knowsAbout: [
      "Peak Performance",
      "Leadership Development",
      "Executive Coaching",
      "Flow State Research",
      "Mindset Mastery",
      "Business Coaching",
      "Keynote Speaking",
      "Martial Arts",
    ],
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Brett Lechtenberg Coaching",
    url: "https://brettlechtenberg.com",
    logo: "https://brettlechtenberg.com/logo.jpg",
    description:
      "Peak performance coaching, speaking, and training services helping leaders and organizations achieve extraordinary results through The Master's Edge methodology.",
    founder: {
      "@type": "Person",
      name: "Brett Lechtenberg",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sandy",
      addressRegion: "UT",
      addressCountry: "US",
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    serviceType: [
      "Executive Coaching",
      "Leadership Development",
      "Corporate Training",
      "Keynote Speaking",
      "Business Consulting",
    ],
    priceRange: "$$$$",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Brett Lechtenberg",
    url: "https://brettlechtenberg.com",
    description:
      "Official website of Brett Lechtenberg - Peak Performance Coach, Speaker & Author",
    publisher: {
      "@type": "Person",
      name: "Brett Lechtenberg",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://brettlechtenberg.com/?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
