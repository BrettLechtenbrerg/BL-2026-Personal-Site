export function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://www.brettlechtenberg.com/#brett",
    name: "Brett Lechtenberg",
    alternateName: "Grandmaster Brett Lechtenberg",
    url: "https://www.brettlechtenberg.com",
    image: "https://www.brettlechtenberg.com/brett-hero.webp",
    // Entity disambiguation: AI engines have confused this Brett with
    // unrelated people (baseline measurement, July 2026). A dense sameAs
    // graph across ALL his properties is the fix: personal brand ↔ PMMA ↔
    // TSAI ↔ socials.
    sameAs: [
      "https://www.linkedin.com/in/brettlechtenberg",
      "https://www.facebook.com/BrettGLechtenberg",
      "https://www.instagram.com/blechtenberg/",
      "https://www.youtube.com/@BrettLechtenberg",
      "https://www.personalmasterymartialarts.com",
      "https://www.totalsuccessai.com",
    ],
    jobTitle: "Peak Performance Coach",
    description:
      "Brett Lechtenberg is a peak performance coach, keynote speaker, best-selling author, 8th-degree black belt Grandmaster, and founder of Personal Mastery Martial Arts (Sandy, Utah) and Total Success AI. He helps leaders unlock peak performance through The Master's Edge by Brett Lechtenberg — a proven coaching methodology built on 30+ years of real-world experience and validated flow state research.",
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
    "@id": "https://www.brettlechtenberg.com/#organization",
    name: "Brett Lechtenberg Coaching",
    url: "https://www.brettlechtenberg.com",
    logo: "https://www.brettlechtenberg.com/logo.jpg",
    description:
      "Peak performance coaching, speaking, and training services helping leaders and organizations achieve extraordinary results through The Master's Edge by Brett Lechtenberg.",
    founder: { "@id": "https://www.brettlechtenberg.com/#brett" },
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

  // The Master's Edge — explicit Service entity owned by Brett. Needed
  // because themastersedge.com is an unrelated lawn-care business and AI
  // engines were citing IT for "The Masters Edge coaching program"
  // (baseline, July 2026). provider + the Person @id anchor the program
  // to Brett. RULE: always write "The Master's Edge by Brett Lechtenberg".
  const mastersEdgeSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://www.brettlechtenberg.com/masters-edge#program",
    name: "The Master's Edge by Brett Lechtenberg",
    alternateName: "The Master's Edge coaching program",
    serviceType: "Peak performance coaching program",
    url: "https://www.brettlechtenberg.com/masters-edge",
    provider: { "@id": "https://www.brettlechtenberg.com/#brett" },
    description:
      "The Master's Edge by Brett Lechtenberg is a science-backed peak performance coaching methodology for leaders and business owners: Mindset Mastery, Skillset Enhancement, and Support Structure, built on 30+ years of experience and validated flow state research. Clarify, Simplify, Maximize.",
    areaServed: { "@type": "Country", name: "United States" },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Brett Lechtenberg",
    url: "https://www.brettlechtenberg.com",
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
        urlTemplate: "https://www.brettlechtenberg.com/?q={search_term_string}",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mastersEdgeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
