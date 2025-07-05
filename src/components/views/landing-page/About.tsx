import { CheckCircle } from &ldquo;lucide-react&rdquo;;
import { ShineBorder } from &ldquo;@/components/magicui/shine-border&rdquo;;
import { BlurFade } from &ldquo;@/components/magicui/blur-fade&rdquo;;
import { SparklesText } from &ldquo;@/components/magicui/sparkles-text&rdquo;;

export default function About() {
  return (
    <section id=&ldquo;about&rdquo; className=&ldquo;py-20 bg-secondary&rdquo;>
      <div className=&ldquo;container mx-auto px-4 sm:px-6 lg:px-8&rdquo;>
        <BlurFade className=&ldquo;max-w-3xl mx-auto text-center&rdquo;>
          <SparklesText text=&ldquo;About POSITIVE-Next&rdquo;>

          </SparklesText>
          <p className=&ldquo;text-lg text-muted-foreground mb-12&rdquo;>
            POSITIVE-Next is a revolutionary app designed to help you harness
            the power of your mind. Our mission is to empower individuals to
            overcome mental saboteurs and achieve their full potential.
          </p>
        </BlurFade>

        <div className=&ldquo;grid md:grid-cols-2 gap-12 items-center&rdquo;>
          <ShineBorder 
            className=&ldquo;space-y-6 p-8 rounded-xl&rdquo;
            borderWidth={1}
            color=&ldquo;rgba(var(--primary), 0.5)&rdquo;
          >
            <h3 className=&ldquo;text-2xl font-semibold text-foreground mb-4&rdquo;>
              Why Choose POSITIVE-Next?
            </h3>
            {[
              { id: &ldquo;science&rdquo;, text: &ldquo;Science-based approach&rdquo; },
              { id: &ldquo;personal&rdquo;, text: &ldquo;Personalized experience&rdquo; },
              { id: &ldquo;progress&rdquo;, text: &ldquo;Track your progress&rdquo; },
              { id: &ldquo;expert&rdquo;, text: &ldquo;Expert guidance&rdquo; },
            ].map((item) => (
              <BlurFade
                key={item.id}
                className=&ldquo;flex items-center space-x-3&rdquo;
              >
                <CheckCircle className=&ldquo;h-6 w-6 text-primary&rdquo; />
                <span className=&ldquo;text-foreground&rdquo;>{item.text}</span>
              </BlurFade>
            ))}
          </ShineBorder>

          <ShineBorder 
            className=&ldquo;bg-primary/10 rounded-xl p-8&rdquo;
            borderWidth={1}
            color=&ldquo;rgba(var(--primary), 0.5)&rdquo;
          >
            <BlurFade>
              <h3 className=&ldquo;text-2xl font-semibold text-foreground mb-4&rdquo;>
                Our Vision
              </h3>
              <p className=&ldquo;text-muted-foreground&rdquo;>
                We envision a world where everyone has the tools and knowledge to
                cultivate a positive, resilient mindset. Through POSITIVE-Next,
                we&apos;re making mental fitness accessible and engaging for all.
              </p>
            </BlurFade>
          </ShineBorder>
        </div>
      </div>
    </section>
  );
}
