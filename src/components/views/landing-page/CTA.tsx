import Link from &ldquo;next/link&rdquo;
import { ArrowRight } from &ldquo;lucide-react&rdquo;

export default function CTA() {
  return (
    <section className=&ldquo;py-20 bg-primary text-primary-foreground&rdquo;>
      <div className=&ldquo;container mx-auto px-4 sm:px-6 lg:px-8&rdquo;>
        <div className=&ldquo;max-w-3xl mx-auto text-center&rdquo;>
          <h2 className=&ldquo;text-3xl md:text-4xl font-bold mb-6&rdquo;>Ready to Transform Your Mind?</h2>
          <p className=&ldquo;text-xl mb-8&rdquo;>
            Join POSITIVE-Next today and start your journey to mental fitness and emotional intelligence.
          </p>
          <Link
            href=&ldquo;/sign-up&rdquo;
            className=&ldquo;inline-flex items-center bg-primary-foreground text-primary px-8 py-3 rounded-md text-lg font-medium hover:bg-primary-foreground/90 transition-colors&rdquo;
          >
            Get Started Now
            <ArrowRight className=&ldquo;ml-2&rdquo; size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}

