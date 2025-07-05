import Link from &ldquo;next/link&rdquo;;
import { FacebookIcon, TwitterIcon, InstagramIcon, Brain } from &ldquo;lucide-react&rdquo;;

export default function Footer() {
  return (
    <footer className=&ldquo;bg-secondary text-foreground py-12&rdquo;>
      <div className=&ldquo;container mx-auto px-4 sm:px-6 lg:px-8&rdquo;>
        <div className=&ldquo;grid grid-cols-1 md:grid-cols-4 gap-8&rdquo;>
          <div>
            <div className=&ldquo;flex items-center space-x-2 mb-4&rdquo;>
              <Brain className=&ldquo;h-8 w-8 text-primary&rdquo; />
              <span className=&ldquo;text-2xl font-bold text-primary&rdquo;>
                POSITIVE-Next
              </span>
            </div>
            <p className=&ldquo;text-muted-foreground&rdquo;>
              Empowering minds for a better tomorrow.
            </p>
          </div>
          <div>
            <h4 className=&ldquo;text-lg font-semibold mb-4&rdquo;>Quick Links</h4>
            <ul className=&ldquo;space-y-2&rdquo;>
              <li>
                <Link
                  href=&ldquo;/#features&rdquo;
                  className=&ldquo;text-muted-foreground hover:text-primary transition-colors&rdquo;
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href=&ldquo;/#about&rdquo;
                  className=&ldquo;text-muted-foreground hover:text-primary transition-colors&rdquo;
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href=&ldquo;/#testimonials&rdquo;
                  className=&ldquo;text-muted-foreground hover:text-primary transition-colors&rdquo;
                >
                  Testimonials
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className=&ldquo;text-lg font-semibold mb-4&rdquo;>Legal</h4>
            <ul className=&ldquo;space-y-2&rdquo;>
              <li>
                <Link
                  href=&ldquo;/terms&rdquo;
                  className=&ldquo;text-muted-foreground hover:text-primary transition-colors&rdquo;
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href=&ldquo;/privacy&rdquo;
                  className=&ldquo;text-muted-foreground hover:text-primary transition-colors&rdquo;
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className=&ldquo;text-lg font-semibold mb-4&rdquo;>Connect</h4>
            <div className=&ldquo;flex space-x-4&rdquo;>
              <a
                href=&ldquo;https://facebook.com/positivenext&rdquo;
                target=&ldquo;_blank&rdquo;
                rel=&ldquo;noopener noreferrer&rdquo;
                className=&ldquo;text-muted-foreground hover:text-primary transition-colors&rdquo;
              >
                <FacebookIcon size={24} />
              </a>
              <a
                href=&ldquo;https://twitter.com/positivenext&rdquo;
                target=&ldquo;_blank&rdquo;
                rel=&ldquo;noopener noreferrer&rdquo;
                className=&ldquo;text-muted-foreground hover:text-primary transition-colors&rdquo;
              >
                <TwitterIcon size={24} />
              </a>
              <a
                href=&ldquo;https://instagram.com/positivenext&rdquo;
                target=&ldquo;_blank&rdquo;
                rel=&ldquo;noopener noreferrer&rdquo;
                className=&ldquo;text-muted-foreground hover:text-primary transition-colors&rdquo;
              >
                <InstagramIcon size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className=&ldquo;mt-8 pt-8 border-t border-border text-center&rdquo;>
          <p className=&ldquo;text-muted-foreground&rdquo;>
            &copy; {new Date().getFullYear()} POSITIVE-Next. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
