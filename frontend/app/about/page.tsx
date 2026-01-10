import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Target, Users, Zap, Shield } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-foreground">RPMVault</span>
            </Link>
            <Link
              href="/"
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">About RPMVault</h1>
        
        <div className="space-y-12">
          {/* Introduction */}
          <section>
            <p className="text-lg text-foreground leading-relaxed">
              RPMVault is your comprehensive motorcycle database, designed for enthusiasts, buyers, and professionals 
              who want access to detailed technical specifications, performance data, and in-depth information about 
              motorcycles from around the world.
            </p>
          </section>

          {/* Mission */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
            <p className="text-foreground leading-relaxed">
              We believe that every motorcycle enthusiast deserves access to accurate, comprehensive, and easy-to-understand 
              technical information. Our mission is to create the most complete and user-friendly motorcycle database, 
              helping riders make informed decisions and deepen their knowledge of the machines they love.
            </p>
          </section>

          {/* What We Offer */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Detailed Specifications</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access comprehensive technical data including engine specs, dimensions, weight, performance metrics, 
                  and more for thousands of motorcycle models.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Advanced Search</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Find your perfect motorcycle with our powerful search and filtering system. Search by brand, category, 
                  year, engine size, and more.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Community Driven</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Built by motorcycle enthusiasts for motorcycle enthusiasts. We continuously update our database 
                  with the latest models and accurate information.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Reliable Data</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All specifications are carefully verified and sourced from official manufacturer data and trusted 
                  industry sources to ensure accuracy.
                </p>
              </div>
            </div>
          </section>

          {/* Our Story */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Story</h2>
            <div className="space-y-4 text-foreground leading-relaxed">
              <p>
                RPMVault was born from a simple frustration: finding accurate, comprehensive motorcycle specifications 
                online was unnecessarily difficult. Information was scattered across multiple websites, often outdated, 
                or incomplete.
              </p>
              <p>
                We set out to change that. Our team of motorcycle enthusiasts and developers came together to create 
                a centralized platform where riders could find everything they need to know about any motorcycle model, 
                past or present.
              </p>
              <p>
                Today, RPMVault serves thousands of users worldwide, from casual riders researching their next purchase 
                to professional mechanics looking up technical specifications. We're constantly expanding our database 
                and improving our platform to better serve the motorcycle community.
              </p>
            </div>
          </section>

          {/* Values */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Values</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">Accuracy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We are committed to providing the most accurate and up-to-date information possible. Every specification 
                  is verified and regularly updated.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">Accessibility</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Information should be free and accessible to everyone. We believe in making motorcycle knowledge 
                  available to all enthusiasts, regardless of their background.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">Community</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We're part of the motorcycle community, and we're here to serve it. Your feedback and suggestions 
                  help us improve and grow.
                </p>
              </div>

              <div className="border-l-4 border-primary pl-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">Innovation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We continuously innovate to provide better tools and features, making it easier for you to find 
                  and compare motorcycle information.
                </p>
              </div>
            </div>
          </section>

          {/* Future */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Looking Forward</h2>
            <p className="text-foreground leading-relaxed mb-4">
              We're just getting started. Our roadmap includes exciting features such as:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-foreground">
              <li>User reviews and ratings</li>
              <li>Comparison tools for side-by-side motorcycle analysis</li>
              <li>Mobile applications for iOS and Android</li>
              <li>API access for developers and third-party applications</li>
              <li>Expanded coverage of vintage and classic motorcycles</li>
              <li>Multilingual support for our global community</li>
            </ul>
          </section>

          {/* Contact CTA */}
          <section className="bg-muted rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Join Our Journey</h2>
            <p className="text-foreground leading-relaxed mb-6">
              Have questions, suggestions, or want to contribute to RPMVault? We'd love to hear from you.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get in Touch
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
