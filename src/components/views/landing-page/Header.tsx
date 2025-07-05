&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import Link from &ldquo;next/link&rdquo;;
import { Menu, X, Brain } from &ldquo;lucide-react&rdquo;;
import { AuthHeader } from &ldquo;./auth-header&rdquo;;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className=&ldquo;sticky top-0 z-50 bg-background border-b border-border&rdquo;>
      <div className=&ldquo;container mx-auto px-4 sm:px-6 lg:px-8&rdquo;>
        <div className=&ldquo;flex justify-between items-center py-4&rdquo;>
          <div className=&ldquo;flex items-center space-x-2&rdquo;>
            <Brain className=&ldquo;h-8 w-8 text-primary&rdquo; />
            <Link href=&ldquo;/&rdquo; className=&ldquo;text-2xl font-bold text-primary&rdquo;>
              POSITIVE-Next
            </Link>
          </div>
          <nav className=&ldquo;hidden md:flex space-x-8&rdquo;>
            <Link
              href=&ldquo;/#features&rdquo;
              className=&ldquo;text-foreground hover:text-primary transition-colors&rdquo;
            >
              Features
            </Link>
            <Link
              href=&ldquo;/#about&rdquo;
              className=&ldquo;text-foreground hover:text-primary transition-colors&rdquo;
            >
              About
            </Link>
            <Link
              href=&ldquo;/#testimonials&rdquo;
              className=&ldquo;text-foreground hover:text-primary transition-colors&rdquo;
            >
              Testimonials
            </Link>
          </nav>
          <div className=&ldquo;hidden md:flex&rdquo;>
            <AuthHeader />
          </div>
          <div className=&ldquo;md:hidden&rdquo;>
            <button
              type=&ldquo;button&rdquo;
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className=&ldquo;text-foreground&rdquo;
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className=&ldquo;md:hidden bg-background&rdquo;>
          <div className=&ldquo;px-2 pt-2 pb-3 space-y-1 sm:px-3&rdquo;>
            <Link
              href=&ldquo;/#features&rdquo;
              className=&ldquo;block px-3 py-2 text-foreground hover:text-primary transition-colors&rdquo;
            >
              Features
            </Link>
            <Link
              href=&ldquo;/#about&rdquo;
              className=&ldquo;block px-3 py-2 text-foreground hover:text-primary transition-colors&rdquo;
            >
              About
            </Link>
            <Link
              href=&ldquo;/#testimonials&rdquo;
              className=&ldquo;block px-3 py-2 text-foreground hover:text-primary transition-colors&rdquo;
            >
              Testimonials
            </Link>
            <div className=&ldquo;px-3 py-2&rdquo;>
              <AuthHeader />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
