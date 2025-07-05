import { Brain, Heart, Zap, Target, Smile, TrendingUp } from &ldquo;lucide-react&rdquo;;
import { ShineBorder } from &ldquo;@/components/magicui/shine-border&rdquo;;
import { AnimatedShinyText } from &ldquo;@/components/magicui/animated-shiny-text&rdquo;;
import { BlurFade } from &ldquo;@/components/magicui/blur-fade&rdquo;;

const features = [
  {
    id: &ldquo;mental-fitness&rdquo;,
    icon: Brain,
    title: &ldquo;Mental Fitness&rdquo;,
    description:
      &ldquo;Train your mind to overcome negative thoughts and boost your mental resilience.&rdquo;,
  },
  {
    id: &ldquo;emotional-intelligence&rdquo;,
    icon: Heart,
    title: &ldquo;Emotional Intelligence&rdquo;,
    description:
      &ldquo;Develop a deeper understanding of your emotions and learn to manage them effectively.&rdquo;,
  },
  {
    id: &ldquo;peak-performance&rdquo;,
    icon: Zap,
    title: &ldquo;Peak Performance&rdquo;,
    description:
      &ldquo;Unlock your full potential and achieve your goals with a positive mindset.&rdquo;,
  },
  {
    id: &ldquo;goal-setting&rdquo;,
    icon: Target,
    title: &ldquo;Goal Setting&rdquo;,
    description:
      &ldquo;Learn to set and achieve meaningful goals that align with your values and aspirations.&rdquo;,
  },
  {
    id: &ldquo;stress-management&rdquo;,
    icon: Smile,
    title: &ldquo;Stress Management&rdquo;,
    description:
      &ldquo;Discover techniques to reduce stress and maintain a calm, focused state of mind.&rdquo;,
  },
  {
    id: &ldquo;personal-growth&rdquo;,
    icon: TrendingUp,
    title: &ldquo;Personal Growth&rdquo;,
    description:
      &ldquo;Embark on a journey of continuous self-improvement and lifelong learning.&rdquo;,
  },
].map((feature, index) => ({
  ...feature,
  animationDelay: index * 100,
}));

export default function Features() {
  return (
    <section id=&ldquo;features&rdquo; className=&ldquo;relative py-20 overflow-hidden&rdquo;>
      {/* Background decorations */}
      <div className=&ldquo;absolute inset-0 bg-grid-black/[0.02] -z-10&rdquo; />
      <div className=&ldquo;absolute inset-0 bg-gradient-to-b from-background to-secondary/20 -z-10&rdquo; />

      <div className=&ldquo;container mx-auto px-4 sm:px-6 lg:px-8&rdquo;>
        <BlurFade className=&ldquo;text-center mb-16&rdquo;>
          <AnimatedShinyText>
            <h2 className=&ldquo;text-3xl md:text-4xl font-bold text-foreground mb-4&rdquo;>
              Empower Your Mind
            </h2>
          </AnimatedShinyText>
          <p className=&ldquo;text-lg text-muted-foreground max-w-2xl mx-auto&rdquo;>
            Discover powerful tools and techniques to enhance your mental
            fitness and emotional intelligence.
          </p>
        </BlurFade>

        <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8&rdquo;>
          {features.map((feature) => (
            <ShineBorder
              key={feature.id}
              duration={10}
              className=&ldquo;group relative backdrop-blur-sm rounded-xl overflow-hidden animate-in fade-in-0 duration-1000&rdquo;
              borderWidth={1}
              color=&ldquo;rgba(var(--primary), 0.5)&rdquo;
            >
              <div
                className=&ldquo;relative p-8&rdquo;
                style={{ animationDelay: `${feature.animationDelay}ms` }}
              >
                <div className=&ldquo;inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform&rdquo;>
                  <feature.icon className=&ldquo;h-6 w-6&rdquo; />
                </div>

                <h3 className=&ldquo;text-xl font-semibold text-foreground mb-3&rdquo;>
                  {feature.title}
                </h3>

                <p className=&ldquo;text-muted-foreground&rdquo;>{feature.description}</p>
              </div>
            </ShineBorder>
          ))}
        </div>
      </div>
    </section>
  );
}
