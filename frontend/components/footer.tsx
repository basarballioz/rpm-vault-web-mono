import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-foreground">RPMVault</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Discover your dream motorcycle with our comprehensive motorcycle database. Technical specifications,
              performance data and detailed reviews.
            </p>
          </div>

          {/* Catalog */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Catalog</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalog" className="text-muted-foreground hover:text-primary transition-colors">
                  All Motorcycles
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=enduro" className="text-muted-foreground hover:text-primary transition-colors">
                  Enduro
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=sport" className="text-muted-foreground hover:text-primary transition-colors">
                  Sport
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=touring" className="text-muted-foreground hover:text-primary transition-colors">
                  Touring
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=naked" className="text-muted-foreground hover:text-primary transition-colors">
                  Naked
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Brands */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Popular Brands</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalog?brand=Honda" className="text-muted-foreground hover:text-primary transition-colors">
                  Honda
                </Link>
              </li>
              <li>
                <Link href="/catalog?brand=Yamaha" className="text-muted-foreground hover:text-primary transition-colors">
                  Yamaha
                </Link>
              </li>
              <li>
                <Link href="/catalog?brand=Kawasaki" className="text-muted-foreground hover:text-primary transition-colors">
                  Kawasaki
                </Link>
              </li>
              <li>
                <Link href="/catalog?brand=Suzuki" className="text-muted-foreground hover:text-primary transition-colors">
                  Suzuki
                </Link>
              </li>
              <li>
                <Link href="/catalog?brand=BMW" className="text-muted-foreground hover:text-primary transition-colors">
                  BMW
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 RPMVault. All rights reserved. Designed for motorcycle enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  )
}
