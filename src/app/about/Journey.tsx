// "The Journey" on the About page: the home page's travelling golden line through the decades (Brett's pick, 30 Oct 2026).
// The line itself is drawn by HorizonMotion from [data-map] / [data-node].
import Image from "next/image";

export type TimelineItem = { year: string; title: string; description: string; image: { src: string; w: number; h: number } };

const Title = () => (
  <div className="sec-head center" data-rise>
    <h2 id="journey-title" className="h2">The <em>Journey</em></h2>
    <p className="body-lg">Four decades of learning, teaching, and transformation, distilled into a methodology that works.</p>
  </div>
);

export function Journey({ items }: { items: readonly TimelineItem[] }) {
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
