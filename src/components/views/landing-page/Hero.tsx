import Link from &ldquo;next/link&rdquo;
import { ArrowRight, Sparkles } from &ldquo;lucide-react&rdquo;
import { SparklesText } from &ldquo;@/components/magicui/sparkles-text&rdquo;;
import { BoxReveal } from &ldquo;@/components/magicui/box-reveal&rdquo;;
import { ShineBorder } from &ldquo;@/components/magicui/shine-border&rdquo;;
import { BlurFade } from &ldquo;@/components/magicui/blur-fade&rdquo;;
import { ShimmerButton } from &ldquo;@/components/magicui/shimmer-button&rdquo;;

export default function Hero() {
  return (
    <section className=&ldquo;relative py-20 md:py-32 overflow-hidden&rdquo;>
      {/* Gradient background */}
      <div className=&ldquo;absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent&rdquo; />

      <div className=&ldquo;container mx-auto px-4 sm:px-6 lg:px-8 relative&rdquo;>
        <div className=&ldquo;max-w-4xl mx-auto text-center&rdquo;>
          <ShineBorder className=&ldquo;p-8 rounded-2xl&rdquo;>
            <div className=&ldquo;space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700&rdquo;>
              {/* Floating badge */}
              <BlurFade>
                <div className=&ldquo;inline-flex items-center rounded-full border border-primary/20 bg-background/50 px-6 py-2 mb-8 shadow-glow backdrop-blur-sm&rdquo;>
                  <Sparkles className=&ldquo;h-4 w-4 text-primary mr-2&rdquo; />
                  <SparklesText text=&ldquo;AI-Powered Mental Fitness&rdquo; />
                </div>
              </BlurFade>

              <BoxReveal>
                <h1 className=&ldquo;text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight tracking-tight&rdquo;>
                  Your mind is your best friend—
                  <br />
                  <span className=&ldquo;text-primary&rdquo;>
                    But it can also be your worst enemy.
                  </span>
                </h1>
              </BoxReveal>

              <BlurFade delay={0.2}>
                <p className=&ldquo;text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto&rdquo;>
                  Learn to harness the power of your mind with
                  POSITIVE-Next&apos;s science-backed mental fitness platform.
                </p>

                <div className=&ldquo;flex flex-col sm:flex-row items-center justify-center gap-4 mt-8&rdquo;>
                  <ShimmerButton>
                    <Link
                      href=&ldquo;/sign-up&rdquo;
                      className=&ldquo;inline-flex items-center px-8 py-3 text-lg font-medium&rdquo;
                    >
                      Get Started Free
                      <ArrowRight
                        className=&ldquo;ml-2 group-hover:translate-x-1 transition-transform&rdquo;
                        size={20}
                      />
                    </Link>
                  </ShimmerButton>
                  
                  <Link
                    href=&ldquo;/#features&rdquo;
                    className=&ldquo;inline-flex items-center text-foreground hover:text-primary transition-colors px-8 py-3&rdquo;
                  >
                    Learn More
                  </Link>
                </div>
              </BlurFade>
            </div>

            {/* Stats section with enhanced styling */}
            <div className=&ldquo;mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto&rdquo;>
              {[
                { label: &ldquo;Active Users&rdquo;, value: &ldquo;10,000+&rdquo; },
                { label: &ldquo;Mental Fitness Score&rdquo;, value: &ldquo;85% Improvement&rdquo; },
                { label: &ldquo;User Satisfaction&rdquo;, value: &ldquo;4.9/5&rdquo; },
              ].map((stat, i) => (
                <BlurFade
                  key={stat.label}
                  delay={i * 0.1}
                  className=&ldquo;flex flex-col items-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300&rdquo;
                >
                  <div className=&ldquo;text-2xl font-bold text-foreground&rdquo;>
                    {stat.value}
                  </div>
                  <div className=&ldquo;text-sm text-muted-foreground&rdquo;>
                    {stat.label}
                  </div>
                </BlurFade>
              ))}
            </div>
          </ShineBorder>
        </div>
      </div>
    </section>
  );
}

