// "The Journey" on the About page, two versions for Brett to choose from (30 Oct 2026).
import Image from "next/image";
import type { TimelineItem } from "./AboutContent";

const Title = () => (
  <div className="sec-head center" data-rise>
    <h2 id="journey-title" className="h2">The <em>Journey</em></h2>
    <p className="body-lg">Four decades of learning, teaching, and transformation, distilled into a methodology that works.</p>
  </div>
);

// Version B: a golden line that travels down through the decades (built by HorizonMotion from [data-map], like the home page).
export function JourneyPath({ items }: { items: readonly TimelineItem[] }) {
  return (
    <section className="sec sec-night" aria-labelledby="journey-title">
      <div className="rail">
        <Title />
        <div className="journey-map tl-map" data-map>
          <svg className="journey-svg" aria-hidden="true" focusable="false">
            <path className="path-ghost" data-ghost d="" />
            <path className="path-live" data-path d="" />
          </svg>
          <ol className="stops tl-stops">
            {items.map((item) => (
              <li key={item.year} className="stop" data-stop>
                <span className="stop-node" data-node aria-hidden="true" />
                <div className="stop-body tl-body">
                  <div className="tl-thumb">
                    <Image src={item.image.src} alt="" width={item.image.w} height={item.image.h} sizes="88px" />
                  </div>
                  <div>
                    <span className="tl-year">{item.year}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// Version A: like the original page: a centre line, one step per row, alternating sides, on the light background.
export function JourneyClassic({ items }: { items: readonly TimelineItem[] }) {
  return (
    <section className="sec sec-paper-2" aria-labelledby="journey-title">
      <div className="rail">
        <Title />
        <ol className="tlc">
          {items.map((item, i) => (
            <li key={item.year} className={`tlc-row ${i % 2 ? "is-right" : "is-left"}`} data-rise>
              <span className="tlc-dot" aria-hidden="true" />
              <div className="tlc-card">
                <Image className="tlc-bg" aria-hidden="true" src={item.image.src} alt="" width={item.image.w} height={item.image.h} sizes="240px" />
                <span className={`tlc-year${i % 2 ? " is-gold" : ""}`}>{item.year}</span>
                <div className="tlc-main">
                  <span className={`ico-badge${i % 2 ? " is-gold" : ""}`} aria-hidden="true"><item.icon /></span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
