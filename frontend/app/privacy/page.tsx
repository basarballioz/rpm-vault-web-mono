import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <p className="text-muted-foreground text-lg mb-6">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-foreground leading-relaxed">
              At RPMVault, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, and safeguard your data when you use our motorcycle catalog platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
            <div className="space-y-4 text-foreground">
              <div>
                <h3 className="text-xl font-medium mb-2">1.1 Information You Provide</h3>
                <p className="leading-relaxed">
                  We may collect information that you voluntarily provide to us, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                  <li>Contact information (name, email address) when you reach out to us</li>
                  <li>Feedback and correspondence when you communicate with us</li>
                  <li>User preferences and settings</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">1.2 Automatically Collected Information</h3>
                <p className="leading-relaxed">
                  When you use RPMVault, we automatically collect certain information, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                  <li>Device information (browser type, operating system, device type)</li>
                  <li>Usage data (pages viewed, time spent, search queries)</li>
                  <li>IP address and general location information</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
            <p className="text-foreground leading-relaxed mb-3">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-foreground">
              <li>To provide and maintain our motorcycle catalog service</li>
              <li>To improve and personalize your user experience</li>
              <li>To analyze usage patterns and optimize our platform</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To send important updates and notifications about our service</li>
              <li>To detect and prevent fraud or abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Data Sharing and Disclosure</h2>
            <p className="text-foreground leading-relaxed mb-3">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-foreground">
              <li><strong>Service Providers:</strong> With third-party service providers who help us operate our platform (analytics, hosting, etc.)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly agree to share your information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Cookies and Tracking Technologies</h2>
            <p className="text-foreground leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience on RPMVault. Cookies help us:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-2 text-foreground">
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our platform</li>
              <li>Improve our services and features</li>
            </ul>
            <p className="text-foreground leading-relaxed mt-3">
              You can control cookies through your browser settings, but disabling them may affect your experience on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
            <p className="text-foreground leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet 
              or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Rights</h2>
            <p className="text-foreground leading-relaxed mb-3">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-foreground">
              <li><strong>Access:</strong> Request access to your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Objection:</strong> Object to processing of your data</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
            </ul>
            <p className="text-foreground leading-relaxed mt-3">
              To exercise these rights, please contact us using the information provided in the Contact section.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Children's Privacy</h2>
            <p className="text-foreground leading-relaxed">
              RPMVault is not intended for children under the age of 13. We do not knowingly collect personal information 
              from children under 13. If you believe we have collected information from a child under 13, please contact us 
              immediately so we can delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Third-Party Links</h2>
            <p className="text-foreground leading-relaxed">
              Our platform may contain links to third-party websites or services. We are not responsible for the privacy 
              practices of these third parties. We encourage you to review their privacy policies before providing any 
              personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Changes to This Privacy Policy</h2>
            <p className="text-foreground leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
              We will notify you of any material changes by posting the updated policy on this page and updating the "Last updated" 
              date. We encourage you to review this Privacy Policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact Us</h2>
            <p className="text-foreground leading-relaxed mb-3">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
              please contact us:
            </p>
            <div className="bg-muted p-6 rounded-lg space-y-2">
              <p className="text-foreground"><strong>Email:</strong> privacy@rpmvault.com</p>
              <p className="text-foreground"><strong>Website:</strong> <Link href="/contact" className="text-primary hover:underline">Contact Form</Link></p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
