import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { SparklesText } from "@/components/magicui/sparkles-text";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { ShineBorder } from "@/components/magicui/shine-border";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

export default function Hero() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <ShineBorder className="p-8 rounded-2xl">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Floating badge */}
              <BlurFade>
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-background/50 px-6 py-2 mb-8 shadow-glow backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-primary mr-2" />
                  <SparklesText text="AI-Powered Mental Fitness" />
                </div>
              </BlurFade>

              <BoxReveal>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight tracking-tight">
                  Your mind is your best friend—
                  <br />
                  <span className="text-primary">
                    But it can also be your worst enemy.
                  </span>
                </h1>
              </BoxReveal>

              <BlurFade delay={0.2}>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                  Learn to harness the power of your mind with
                  POSITIVE-Next&apos;s science-backed mental fitness platform.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                  <ShimmerButton>
                    <Link
                      href="/sign-up"
                      className="inline-flex items-center px-8 py-3 text-lg font-medium"
                    >
                      Get Started Free
                      <ArrowRight
                        className="ml-2 group-hover:translate-x-1 transition-transform"
                        size={20}
                      />
                    </Link>
                  </ShimmerButton>
                  
                  <Link
                    href="/#features"
                    className="inline-flex items-center text-foreground hover:text-primary transition-colors px-8 py-3"
                  >
                    Learn More
                  </Link>
                </div>
              </BlurFade>
            </div>

            {/* Stats section with enhanced styling */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {[
                { label: "Active Users", value: "10,000+" },
                { label: "Mental Fitness Score", value: "85% Improvement" },
                { label: "User Satisfaction", value: "4.9/5" },
              ].map((stat, i) => (
                <BlurFade
                  key={stat.label}
                  delay={i * 0.1}
                  className="flex flex-col items-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
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

