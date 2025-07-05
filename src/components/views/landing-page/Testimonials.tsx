import { Star } from &ldquo;lucide-react&rdquo;;

const testimonials = [
  {
    id: &ldquo;t1&rdquo;,
    quote:
      &ldquo;POSITIVE-Next has completely transformed my mindset. I'm more productive and happier than ever!&rdquo;,
    author: &ldquo;Sarah J., Entrepreneur&rdquo;,
    rating: 5,
  },
  {
    id: &ldquo;t2&rdquo;,
    quote:
      &ldquo;As a CEO, mental fitness is crucial. This app has been a game-changer for my leadership skills.&rdquo;,
    author: &ldquo;Michael R., CEO&rdquo;,
    rating: 5,
  },
  {
    id: &ldquo;t3&rdquo;,
    quote:
      &ldquo;I've tried many self-improvement apps, but POSITIVE-Next stands out with its practical approach.&rdquo;,
    author: &ldquo;Emily L., Life Coach&rdquo;,
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id=&ldquo;testimonials&rdquo; className=&ldquo;py-20 bg-background&rdquo;>
      <div className=&ldquo;container mx-auto px-4 sm:px-6 lg:px-8&rdquo;>
        <h2 className=&ldquo;text-3xl md:text-4xl font-bold text-center text-foreground mb-12&rdquo;>
          What Our Users Say
        </h2>
        <div className=&ldquo;grid grid-cols-1 md:grid-cols-3 gap-8&rdquo;>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className=&ldquo;bg-card rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700&rdquo;
              style={{
                animationDelay: `${Number(testimonial.id.slice(1)) * 100}ms`,
              }}
            >
              <div className=&ldquo;flex mb-4&rdquo;>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={`${testimonial.id}-star-${i}`}
                    className=&ldquo;h-5 w-5 text-primary fill-current&rdquo;
                  />
                ))}
              </div>
              <p className=&ldquo;text-foreground mb-4&rdquo;>
                &quot;{testimonial.quote}&quot;
              </p>
              <p className=&ldquo;text-primary font-semibold&rdquo;>{testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
